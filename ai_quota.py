"""Database-backed, application-owned quotas for KNOWME AI."""

from __future__ import annotations

import hashlib
import hmac
import math
import os
import re
import uuid
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from typing import Callable

from sqlalchemy import func, select, update
from sqlalchemy.dialects.postgresql import insert as postgresql_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.exc import SQLAlchemyError

from models import AIQuotaBucket, AIQuotaEvent, AIUsageRequest


UTC = timezone.utc
CONCURRENCY_DATE = date(1970, 1, 1)
MAX_CHAT_MESSAGES = 200
MAX_CHAT_MESSAGE_CHARS = 12_000
MAX_CHAT_TOTAL_CHARS = 150_000


def _positive_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    try:
        value = default if raw is None else int(raw)
    except (TypeError, ValueError) as error:
        raise RuntimeError(f"{name} must be a positive integer") from error
    if value <= 0:
        raise RuntimeError(f"{name} must be a positive integer")
    return value


@dataclass(frozen=True)
class AIQuotaLimits:
    visitor_daily_requests: int = 20
    visitor_daily_tokens: int = 150_000
    ip_daily_requests: int = 200
    ip_daily_tokens: int = 500_000
    global_daily_requests: int = 10_000
    global_daily_tokens: int = 10_000_000
    max_input_bytes: int = 196_608
    max_input_tokens: int = 40_000
    max_output_tokens: int = 2_048
    max_total_tokens_per_request: int = 42_048
    max_concurrent_requests: int = 20
    reservation_ttl_seconds: int = 180

    @classmethod
    def from_env(cls) -> "AIQuotaLimits":
        return cls(
            visitor_daily_requests=_positive_int("AI_VISITOR_DAILY_REQUEST_LIMIT", 20),
            visitor_daily_tokens=_positive_int("AI_VISITOR_DAILY_TOKEN_LIMIT", 150_000),
            ip_daily_requests=_positive_int("AI_IP_DAILY_REQUEST_LIMIT", 200),
            ip_daily_tokens=_positive_int("AI_IP_DAILY_TOKEN_LIMIT", 500_000),
            global_daily_requests=_positive_int("AI_GLOBAL_DAILY_REQUEST_LIMIT", 10_000),
            global_daily_tokens=_positive_int("AI_GLOBAL_DAILY_TOKEN_LIMIT", 10_000_000),
            max_input_bytes=_positive_int("AI_MAX_INPUT_BYTES", 196_608),
            max_input_tokens=_positive_int("AI_MAX_INPUT_TOKENS", 40_000),
            max_output_tokens=_positive_int("AI_MAX_OUTPUT_TOKENS", 2_048),
            max_total_tokens_per_request=_positive_int("AI_MAX_TOTAL_TOKENS_PER_REQUEST", 42_048),
            max_concurrent_requests=_positive_int("AI_MAX_CONCURRENT_REQUESTS", 20),
            reservation_ttl_seconds=_positive_int("AI_QUOTA_RESERVATION_TTL_SECONDS", 180),
        )


class QuotaRejected(Exception):
    def __init__(self, error_code: str, retry_after: int, scope: str):
        super().__init__(error_code)
        self.error_code = error_code
        self.retry_after = max(0, int(retry_after))
        self.scope = scope


class QuotaStorageUnavailable(Exception):
    """A reservation could not be durably committed."""


@dataclass(frozen=True)
class Reservation:
    request_id: str
    quota_date: date
    visitor_hash: str
    ip_hash: str
    reserved_tokens: int


@dataclass(frozen=True)
class TokenEstimate:
    """A preflight estimate; provider usage remains authoritative."""

    tokens: int
    tokenizer: str
    tokenization_exact: bool
    safety_factor: float

    @property
    def exact(self) -> bool:
        # Even exact content tokenization cannot know all provider-side chat
        # serialization and routing details, so the full estimate is approximate.
        return False


@dataclass(frozen=True)
class ChatContext:
    messages: list[dict[str, str]]
    estimate: TokenEstimate


class ContextTooLarge(ValueError):
    """The system prompt and latest user message exceed one-request input room."""

    def __init__(self, estimate: TokenEstimate, input_budget: int):
        super().__init__("The required system prompt and latest user message exceed the input budget")
        self.estimate = estimate
        self.input_budget = input_budget


_TOKEN_PART_RE = re.compile(
    r"https?://[^\s]+|www\.[^\s]+|[\w]+|[^\w\s]",
    re.UNICODE | re.IGNORECASE,
)
_CODE_HINT_RE = re.compile(
    r"\x60{3}|(?:\b(?:def|class|function|const|let|var|return|import|from)\b)|"
    r"[{}();=<>\[\]]",
    re.IGNORECASE,
)
_TIKTOKEN_MODELS = (
    "gpt-3.5-turbo",
    "gpt-4",
    "gpt-4-turbo",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "o1",
    "o1-mini",
    "o3-mini",
)
_TOKENIZER_CACHE: dict[str, object | None] = {}


def _supported_tiktoken_encoder(model: str | None):
    """Return an installed, known-compatible OpenAI tokenizer, without network IO."""
    if not model or model.strip().lower() in {"openrouter/free", "openrouter/auto", "auto"}:
        return None
    normalized = model.strip().lower()
    if not normalized.startswith("openai/"):
        return None
    model_name = normalized.split("/", 1)[1]
    if not any(model_name == known or model_name.startswith(known + "-") for known in _TIKTOKEN_MODELS):
        return None
    if normalized in _TOKENIZER_CACHE:
        return _TOKENIZER_CACHE[normalized]
    try:
        import tiktoken
        encoder = tiktoken.encoding_for_model(model_name)
    except (ImportError, KeyError, ValueError):
        encoder = None
    _TOKENIZER_CACHE[normalized] = encoder
    return encoder


def _script_token_weight(character: str, code_like: bool) -> float:
    codepoint = ord(character)
    if 0x0530 <= codepoint <= 0x058F:  # Armenian
        return 1 / 1.4
    if 0x0400 <= codepoint <= 0x052F:  # Cyrillic
        return 1 / 1.7
    if character.isascii() and character.isalpha():
        return 1 / (3.0 if code_like else 3.4)
    if character.isdigit():
        return 1 / 2.5
    if character.isalpha():
        return 1 / 2.0
    return 1 / 2.5


def _heuristic_content_tokens(content: str) -> int:
    code_like = bool(_CODE_HINT_RE.search(content))
    estimate = 0
    for part in _TOKEN_PART_RE.findall(content):
        if part.lower().startswith(("http://", "https://", "www.")):
            # URLs are commonly split at punctuation; use a conservative
            # character-based rate instead of treating UTF-8 bytes as tokens.
            estimate += max(1, math.ceil(len(part) / 3.0))
            continue
        if part[0].isalnum() or part[0] == "_":
            weight = sum(_script_token_weight(char, code_like) for char in part)
            estimate += max(1, math.ceil(weight))
        else:
            # Punctuation and operators can each become separate tokens.
            estimate += len(part)
    return estimate


def estimate_input_tokens(
    messages: list[dict[str, str]],
    model: str | None = None,
) -> TokenEstimate:
    """Estimate chat input tokens; this is never represented as provider-exact.

    Known fixed OpenAI model IDs use tiktoken for exact content tokenization when
    that optional package is already installed. Message framing remains
    estimated. Dynamic OpenRouter selectors (including openrouter/free), other
    providers, unknown IDs, or missing tiktoken use a deterministic multilingual
    heuristic: Latin letters average 3.4 chars/token (3.0 in code-like text),
    Cyrillic 1.7, Armenian 1.4, other Unicode letters 2.0, and digits/other
    characters 2.5; URLs use 3.0 chars/token and punctuation is counted per
    character. It adds a 20% safety margin and eight framing tokens per message.
    No files are downloaded and no network calls are made.

    Successful OpenRouter usage is the authoritative count for quota accounting.
    """
    encoder = _supported_tiktoken_encoder(model)
    if encoder is not None:
        content_tokens = sum(
            len(encoder.encode(item["content"]))
            for item in messages
        )
        raw = content_tokens + (8 * len(messages))
        return TokenEstimate(math.ceil(raw * 1.10), "tiktoken-content+estimated-framing", True, 1.10)

    content_tokens = sum(_heuristic_content_tokens(item["content"]) for item in messages)
    raw = content_tokens + (8 * len(messages))
    return TokenEstimate(math.ceil(raw * 1.20), "multilingual-heuristic", False, 1.20)


def build_chat_context(
    messages: list[dict[str, str]],
    system_prompt: str,
    limits: AIQuotaLimits,
    model: str | None = None,
) -> ChatContext:
    """Keep the latest user turn and newest complete prior turns that fit."""
    if not messages or messages[-1]["role"] != "user":
        raise ValueError("The final chat message must be the current user message")

    latest_user = messages[-1]
    prompt_message = {"role": "system", "content": system_prompt}
    input_budget = min(
        limits.max_input_tokens,
        limits.max_total_tokens_per_request - limits.max_output_tokens,
    )
    latest_only = [prompt_message, latest_user]
    estimate = estimate_input_tokens(latest_only, model=model)
    if estimate.tokens > input_budget:
        raise ContextTooLarge(estimate, input_budget)

    # Only adjacent user/assistant messages form a complete prior turn. Any
    # orphaned or malformed historical message is omitted without changing roles.
    complete_pairs: list[tuple[dict[str, str], dict[str, str]]] = []
    pending_user: dict[str, str] | None = None
    for message in messages[:-1]:
        if message["role"] == "user":
            pending_user = message
        elif message["role"] == "assistant" and pending_user is not None:
            complete_pairs.append((pending_user, message))
            pending_user = None

    selected_pairs: list[tuple[dict[str, str], dict[str, str]]] = []
    for pair in reversed(complete_pairs):
        candidate_pairs = [pair, *selected_pairs]
        candidate_messages = [
            prompt_message,
            *(message for turn in candidate_pairs for message in turn),
            latest_user,
        ]
        candidate_estimate = estimate_input_tokens(candidate_messages, model=model)
        if candidate_estimate.tokens > input_budget:
            # The selected turns are a recent suffix, so an older, smaller turn
            # cannot be inserted after a newer complete turn failed to fit.
            break
        selected_pairs = candidate_pairs
        estimate = candidate_estimate

    selected_messages = [
        prompt_message,
        *(message for turn in selected_pairs for message in turn),
        latest_user,
    ]
    return ChatContext(selected_messages, estimate)


def utc_day(now: datetime | None = None) -> date:
    return (now or datetime.now(UTC)).astimezone(UTC).date()


def seconds_until_utc_reset(now: datetime | None = None) -> int:
    moment = (now or datetime.now(UTC)).astimezone(UTC)
    tomorrow = moment.date() + timedelta(days=1)
    reset = datetime.combine(tomorrow, time.min, tzinfo=UTC)
    return max(1, math.ceil((reset - moment).total_seconds()))


def _as_utc(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


class AIQuotaManager:
    def __init__(
        self,
        session_factory: Callable,
        hmac_secret: str,
        limits: AIQuotaLimits | None = None,
        clock: Callable[[], datetime] | None = None,
    ):
        if not hmac_secret:
            raise ValueError("An HMAC secret is required")
        self.session_factory = session_factory
        self.hmac_secret = hmac_secret.encode("utf-8")
        self.limits = limits or AIQuotaLimits.from_env()
        self.clock = clock or (lambda: datetime.now(UTC))

    def hash_identity(self, kind: str, value: str) -> str:
        payload = f"knowme-ai:{kind}:{value}".encode("utf-8")
        return hmac.new(self.hmac_secret, payload, hashlib.sha256).hexdigest()

    @staticmethod
    def _db_insert(session, model, values: dict):
        dialect = session.get_bind().dialect.name
        if dialect == "postgresql":
            statement = postgresql_insert(model).values(**values).on_conflict_do_nothing()
        elif dialect == "sqlite":
            statement = sqlite_insert(model).values(**values).on_conflict_do_nothing()
        else:
            raise QuotaStorageUnavailable("Unsupported quota database dialect")
        session.execute(statement)

    @staticmethod
    def _db_upsert_event(session, values: dict):
        dialect = session.get_bind().dialect.name
        insert = postgresql_insert if dialect == "postgresql" else sqlite_insert if dialect == "sqlite" else None
        if insert is None:
            raise QuotaStorageUnavailable("Unsupported quota database dialect")
        statement = insert(AIQuotaEvent).values(**values)
        conflict = {
            "constraint": "uq_ai_quota_event_day_scope_code_identity"
        } if dialect == "postgresql" else {
            "index_elements": [
                AIQuotaEvent.quota_date,
                AIQuotaEvent.scope,
                AIQuotaEvent.error_code,
                AIQuotaEvent.visitor_hash,
                AIQuotaEvent.ip_hash,
            ]
        }
        statement = statement.on_conflict_do_update(
            **conflict,
            set_={
                "event_count": AIQuotaEvent.event_count + 1,
                "last_seen_at": values["last_seen_at"],
            },
        )
        session.execute(statement)

    @staticmethod
    def _bucket_values(scope: str, quota_date: date, subject_hash: str = "") -> dict:
        return {
            "scope": scope,
            "quota_date": quota_date,
            "subject_hash": subject_hash,
        }

    def _ensure_buckets(self, session, quota_date: date, visitor_hash: str, ip_hash: str) -> None:
        keys = [
            self._bucket_values("concurrency", CONCURRENCY_DATE),
            self._bucket_values("global", quota_date),
            self._bucket_values("visitor", quota_date, visitor_hash),
            self._bucket_values("ip", quota_date, ip_hash),
        ]
        for key in keys:
            self._db_insert(session, AIQuotaBucket, key)

    def _record_exhaustion(self, quota_date: date, visitor_hash: str, ip_hash: str, code: str, scope: str, now: datetime) -> None:
        values = {
            "quota_date": quota_date,
            "scope": scope,
            "error_code": code,
            "visitor_hash": visitor_hash,
            "ip_hash": ip_hash,
            "event_count": 1,
            "first_seen_at": now,
            "last_seen_at": now,
        }
        try:
            with self.session_factory() as session, session.begin():
                self._db_upsert_event(session, values)
        except SQLAlchemyError:
            # Denial remains fail-closed even if the optional event record fails.
            return

    def _reap_expired_reservations(self, session, now: datetime) -> None:
        # A single durable gate serializes cleanup with new reservations, including
        # across UTC dates. All callers acquire it before daily buckets.
        gate = self._bucket_values("concurrency", CONCURRENCY_DATE)
        session.execute(
            update(AIQuotaBucket)
            .where(
                AIQuotaBucket.scope == gate["scope"],
                AIQuotaBucket.quota_date == gate["quota_date"],
                AIQuotaBucket.subject_hash == gate["subject_hash"],
            )
            .values(current_concurrent=AIQuotaBucket.current_concurrent)
        )
        expired = session.scalars(
            select(AIUsageRequest)
            .where(
                AIUsageRequest.status == "reserved",
                AIUsageRequest.reservation_expires_at <= now,
            )
            .order_by(AIUsageRequest.created_at)
            .with_for_update(skip_locked=True)
            .limit(100)
        ).all()
        for usage in expired:
            for scope, subject_hash in (
                ("global", ""),
                ("visitor", usage.visitor_hash),
                ("ip", usage.ip_hash),
            ):
                result = session.execute(
                    update(AIQuotaBucket)
                    .where(
                        AIQuotaBucket.scope == scope,
                        AIQuotaBucket.quota_date == usage.quota_date,
                        AIQuotaBucket.subject_hash == subject_hash,
                        AIQuotaBucket.reserved_tokens >= usage.reserved_tokens,
                    )
                    .values(
                        reserved_tokens=AIQuotaBucket.reserved_tokens - usage.reserved_tokens,
                        used_tokens=AIQuotaBucket.used_tokens + usage.reserved_tokens,
                    )
                )
                if result.rowcount != 1:
                    raise QuotaStorageUnavailable("Quota reservation could not be recovered")
            result = session.execute(
                update(AIQuotaBucket)
                .where(
                    AIQuotaBucket.scope == "concurrency",
                    AIQuotaBucket.quota_date == CONCURRENCY_DATE,
                    AIQuotaBucket.subject_hash == "",
                    AIQuotaBucket.current_concurrent > 0,
                )
                .values(current_concurrent=AIQuotaBucket.current_concurrent - 1)
            )
            if result.rowcount != 1:
                raise QuotaStorageUnavailable("Concurrency reservation could not be recovered")
            usage.status = "expired_unknown"
            usage.completed_at = now

    def reserve(self, visitor_id: str, client_ip: str, expected_tokens: int) -> Reservation:
        now = _as_utc(self.clock())
        quota_date = now.date()
        visitor_hash = self.hash_identity("visitor", visitor_id)
        ip_hash = self.hash_identity("ip", client_ip)
        request_id = str(uuid.uuid4())
        retry_after = seconds_until_utc_reset(now)
        failure: tuple[str, str, int] | None = None

        try:
            with self.session_factory() as session, session.begin():
                self._ensure_buckets(session, quota_date, visitor_hash, ip_hash)
                self._reap_expired_reservations(session, now)

                result = session.execute(
                    update(AIQuotaBucket)
                    .where(
                        AIQuotaBucket.scope == "concurrency",
                        AIQuotaBucket.quota_date == CONCURRENCY_DATE,
                        AIQuotaBucket.subject_hash == "",
                        AIQuotaBucket.current_concurrent < self.limits.max_concurrent_requests,
                    )
                    .values(current_concurrent=AIQuotaBucket.current_concurrent + 1)
                )
                if result.rowcount != 1:
                    failure = ("AI_QUOTA_TEMPORARY_FAILURE", 5, "concurrency")
                    raise QuotaRejected(*failure)

                scopes = [
                    (
                        "global", "", self.limits.global_daily_requests,
                        self.limits.global_daily_tokens, "AI_GLOBAL_DAILY_QUOTA_EXCEEDED",
                    ),
                    (
                        "visitor", visitor_hash, self.limits.visitor_daily_requests,
                        self.limits.visitor_daily_tokens, "AI_VISITOR_DAILY_QUOTA_EXCEEDED",
                    ),
                    (
                        "ip", ip_hash, self.limits.ip_daily_requests,
                        self.limits.ip_daily_tokens, "AI_IP_DAILY_QUOTA_EXCEEDED",
                    ),
                ]
                for scope, subject_hash, request_limit, token_limit, error_code in scopes:
                    result = session.execute(
                        update(AIQuotaBucket)
                        .where(
                            AIQuotaBucket.scope == scope,
                            AIQuotaBucket.quota_date == quota_date,
                            AIQuotaBucket.subject_hash == subject_hash,
                            AIQuotaBucket.request_count < request_limit,
                            AIQuotaBucket.used_tokens + AIQuotaBucket.reserved_tokens + expected_tokens <= token_limit,
                        )
                        .values(
                            request_count=AIQuotaBucket.request_count + 1,
                            reserved_tokens=AIQuotaBucket.reserved_tokens + expected_tokens,
                        )
                    )
                    if result.rowcount != 1:
                        failure = (error_code, retry_after, scope)
                        raise QuotaRejected(*failure)

                session.add(AIUsageRequest(
                    request_id=request_id,
                    quota_date=quota_date,
                    visitor_hash=visitor_hash,
                    ip_hash=ip_hash,
                    status="reserved",
                    reserved_tokens=expected_tokens,
                    created_at=now,
                    reservation_expires_at=now + timedelta(seconds=self.limits.reservation_ttl_seconds),
                ))

            return Reservation(request_id, quota_date, visitor_hash, ip_hash, expected_tokens)
        except QuotaRejected as rejected:
            self._record_exhaustion(
                quota_date, visitor_hash, ip_hash, rejected.error_code, rejected.scope, now,
            )
            raise
        except SQLAlchemyError as error:
            raise QuotaStorageUnavailable(type(error).__name__) from None

    def _release_concurrency(self, session) -> None:
        result = session.execute(
            update(AIQuotaBucket)
            .where(
                AIQuotaBucket.scope == "concurrency",
                AIQuotaBucket.quota_date == CONCURRENCY_DATE,
                AIQuotaBucket.subject_hash == "",
                AIQuotaBucket.current_concurrent > 0,
            )
            .values(current_concurrent=AIQuotaBucket.current_concurrent - 1)
        )
        if result.rowcount != 1:
            raise QuotaStorageUnavailable("Concurrency reservation is inconsistent")

    def reconcile(
        self,
        request_id: str,
        status: str,
        usage: dict[str, int] | None = None,
    ) -> None:
        now = _as_utc(self.clock())
        try:
            with self.session_factory() as session, session.begin():
                row = session.scalar(
                    select(AIUsageRequest)
                    .where(AIUsageRequest.request_id == request_id)
                    .with_for_update()
                )
                if row is None or row.status != "reserved":
                    return

                charged_tokens = row.reserved_tokens if usage is None else usage["total_tokens"]
                for scope, subject_hash in (
                    ("global", ""),
                    ("visitor", row.visitor_hash),
                    ("ip", row.ip_hash),
                ):
                    result = session.execute(
                        update(AIQuotaBucket)
                        .where(
                            AIQuotaBucket.scope == scope,
                            AIQuotaBucket.quota_date == row.quota_date,
                            AIQuotaBucket.subject_hash == subject_hash,
                            AIQuotaBucket.reserved_tokens >= row.reserved_tokens,
                        )
                        .values(
                            reserved_tokens=AIQuotaBucket.reserved_tokens - row.reserved_tokens,
                            used_tokens=AIQuotaBucket.used_tokens + charged_tokens,
                        )
                    )
                    if result.rowcount != 1:
                        raise QuotaStorageUnavailable("Quota reservation is inconsistent")

                self._release_concurrency(session)
                row.status = status if usage is not None or status != "success" else "success_usage_unknown"
                row.prompt_tokens = None if usage is None else usage["prompt_tokens"]
                row.completion_tokens = None if usage is None else usage["completion_tokens"]
                row.actual_total_tokens = None if usage is None else usage["total_tokens"]
                row.completed_at = now
        except SQLAlchemyError as error:
            raise QuotaStorageUnavailable(type(error).__name__) from None

    def retry_after_for_concurrency(self) -> int:
        now = _as_utc(self.clock())
        try:
            with self.session_factory() as session:
                earliest = session.scalar(
                    select(func.min(AIUsageRequest.reservation_expires_at))
                    .where(AIUsageRequest.status == "reserved")
                )
            if earliest is None:
                return 5
            return max(1, math.ceil((_as_utc(earliest) - now).total_seconds()))
        except SQLAlchemyError:
            return 5


def get_ai_usage_report(session_factory: Callable, limits: AIQuotaLimits | None = None, day: date | None = None) -> dict:
    """Return aggregate daily metrics and grouped pseudonymous usage."""
    limits = limits or AIQuotaLimits.from_env()
    quota_date = day or utc_day()
    try:
        with session_factory() as session:
            bucket = session.scalar(select(AIQuotaBucket).where(
                AIQuotaBucket.scope == "global",
                AIQuotaBucket.quota_date == quota_date,
                AIQuotaBucket.subject_hash == "",
            ))
            rows = session.execute(
                select(AIUsageRequest.status, func.count())
                .where(AIUsageRequest.quota_date == quota_date)
                .group_by(AIUsageRequest.status)
            ).all()
            by_status = {status: int(count) for status, count in rows}
            usage_rows = session.execute(
                select(
                    AIUsageRequest.visitor_hash,
                    AIUsageRequest.ip_hash,
                    func.count(),
                    func.coalesce(func.sum(AIUsageRequest.prompt_tokens), 0),
                    func.coalesce(func.sum(AIUsageRequest.completion_tokens), 0),
                    func.coalesce(func.sum(AIUsageRequest.actual_total_tokens), 0),
                    func.coalesce(func.sum(AIUsageRequest.reserved_tokens), 0),
                )
                .where(AIUsageRequest.quota_date == quota_date)
                .group_by(AIUsageRequest.visitor_hash, AIUsageRequest.ip_hash)
            ).all()
            visitor_rows = session.execute(
                select(
                    AIUsageRequest.visitor_hash,
                    func.count(),
                    func.coalesce(func.sum(AIUsageRequest.prompt_tokens), 0),
                    func.coalesce(func.sum(AIUsageRequest.completion_tokens), 0),
                    func.coalesce(func.sum(AIUsageRequest.actual_total_tokens), 0),
                )
                .where(AIUsageRequest.quota_date == quota_date)
                .group_by(AIUsageRequest.visitor_hash)
            ).all()
            ip_rows = session.execute(
                select(
                    AIUsageRequest.ip_hash,
                    func.count(),
                    func.coalesce(func.sum(AIUsageRequest.prompt_tokens), 0),
                    func.coalesce(func.sum(AIUsageRequest.completion_tokens), 0),
                    func.coalesce(func.sum(AIUsageRequest.actual_total_tokens), 0),
                )
                .where(AIUsageRequest.quota_date == quota_date)
                .group_by(AIUsageRequest.ip_hash)
            ).all()
            unknown_charged = session.scalar(
                select(func.coalesce(func.sum(AIUsageRequest.reserved_tokens), 0))
                .where(
                    AIUsageRequest.quota_date == quota_date,
                    AIUsageRequest.actual_total_tokens.is_(None),
                )
            )
            exhausted = session.execute(
                select(AIQuotaEvent.scope, AIQuotaEvent.error_code, func.sum(AIQuotaEvent.event_count))
                .where(AIQuotaEvent.quota_date == quota_date)
                .group_by(AIQuotaEvent.scope, AIQuotaEvent.error_code)
            ).all()
            all_requests = sum(by_status.values())
            successful = by_status.get("success", 0) + by_status.get("success_usage_unknown", 0)
            failed = by_status.get("failure", 0) + by_status.get("expired_unknown", 0)
            known_prompt = sum(int(row[3]) for row in usage_rows)
            known_completion = sum(int(row[4]) for row in usage_rows)
            known_total = sum(int(row[5]) for row in usage_rows)
            charged_total = 0 if bucket is None else int(bucket.used_tokens + bucket.reserved_tokens)
            report = {
                "utc_date": quota_date.isoformat(),
                "total_requests": all_requests,
                "successful_requests": successful,
                "failed_requests": failed,
                "unknown_usage_requests": by_status.get("success_usage_unknown", 0) + by_status.get("expired_unknown", 0),
                "prompt_tokens_reported": known_prompt,
                "completion_tokens_reported": known_completion,
                "total_tokens_reported": known_total,
                "total_tokens_charged_conservatively": charged_total,
                "unknown_or_pending_token_estimate": max(0, unknown_charged),
                "remaining_global_requests": max(0, limits.global_daily_requests - (0 if bucket is None else bucket.request_count)),
                "remaining_global_tokens": max(0, limits.global_daily_tokens - charged_total),
                "usage_by_identity_hash": [
                    {
                        "visitor_hash": row[0],
                        "ip_hash": row[1],
                        "requests": int(row[2]),
                        "prompt_tokens_reported": int(row[3]),
                        "completion_tokens_reported": int(row[4]),
                        "total_tokens_reported": int(row[5]),
                        "reserved_token_budget": int(row[6]),
                    }
                    for row in usage_rows
                ],
                "usage_by_visitor_hash": [
                    {
                        "visitor_hash": row[0],
                        "requests": int(row[1]),
                        "prompt_tokens_reported": int(row[2]),
                        "completion_tokens_reported": int(row[3]),
                        "total_tokens_reported": int(row[4]),
                    }
                    for row in visitor_rows
                ],
                "usage_by_ip_hash": [
                    {
                        "ip_hash": row[0],
                        "requests": int(row[1]),
                        "prompt_tokens_reported": int(row[2]),
                        "completion_tokens_reported": int(row[3]),
                        "total_tokens_reported": int(row[4]),
                    }
                    for row in ip_rows
                ],
                "quota_exhaustion_events": [
                    {"scope": row[0], "error_code": row[1], "events": int(row[2])}
                    for row in exhausted
                ],
            }
            return report
    except SQLAlchemyError as error:
        raise QuotaStorageUnavailable(type(error).__name__) from None
