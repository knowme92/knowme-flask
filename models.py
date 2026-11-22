from datetime import date, datetime, timezone

from sqlalchemy import (
    String,
    Text,
    DateTime,
    Boolean,
    JSON,
    Date,
    Integer,
    BigInteger,
    Index,
    UniqueConstraint,
    CheckConstraint,
    text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from database import Base


class ContactMessage(Base):

    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(80),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(120),
        nullable=False
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false")
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class ProjectRequest(Base):
    """A website brief submitted through the /start-project wizard."""

    __tablename__ = "project_requests"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Contact information
    full_name: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), nullable=False, default="")
    company: Mapped[str] = mapped_column(String(120), nullable=False, default="")

    # Project configuration
    website_type: Mapped[str] = mapped_column(String(40), nullable=False)
    website_goal: Mapped[str] = mapped_column(String(40), nullable=False)
    design_style: Mapped[str] = mapped_column(String(40), nullable=False)
    pages_scope: Mapped[str] = mapped_column(String(40), nullable=False)
    layout_style: Mapped[str] = mapped_column(String(40), nullable=False, default="balanced", server_default="balanced")
    font_style: Mapped[str] = mapped_column(String(40), nullable=False, default="modern", server_default="modern")
    animation_level: Mapped[str] = mapped_column(String(20), nullable=False, default="subtle", server_default="subtle")
    preferred_domain: Mapped[str] = mapped_column(String(253), nullable=False, default="", server_default="")
    security_requirements: Mapped[list] = mapped_column(JSON, nullable=False, default=list, server_default=text("'[]'"))
    required_pages: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    features: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    selected_3d_models: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
        server_default=text("'[]'")
    )
    primary_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#ef4444")
    secondary_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#006eff")
    reference_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    target_audience: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    budget: Mapped[str] = mapped_column(String(40), nullable=False)
    deadline: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false")
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class AIQuotaBucket(Base):
    """Atomic UTC-day counters and the shared concurrency gate."""

    __tablename__ = "ai_quota_buckets"
    __table_args__ = (
        UniqueConstraint("scope", "quota_date", "subject_hash", name="uq_ai_quota_bucket_identity"),
        CheckConstraint("request_count >= 0", name="ck_ai_quota_bucket_requests_nonnegative"),
        CheckConstraint("used_tokens >= 0", name="ck_ai_quota_bucket_used_nonnegative"),
        CheckConstraint("reserved_tokens >= 0", name="ck_ai_quota_bucket_reserved_nonnegative"),
        CheckConstraint("current_concurrent >= 0", name="ck_ai_quota_bucket_concurrent_nonnegative"),
        Index("ix_ai_quota_bucket_day_scope", "quota_date", "scope"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scope: Mapped[str] = mapped_column(String(16), nullable=False)
    quota_date: Mapped[date] = mapped_column(Date, nullable=False)
    # Empty only for global/concurrency rows; visitor and IP hashes are HMAC-SHA256.
    subject_hash: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    request_count: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0, server_default=text("0"))
    used_tokens: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0, server_default=text("0"))
    reserved_tokens: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0, server_default=text("0"))
    current_concurrent: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default=text("0"))


class AIUsageRequest(Base):
    """One metadata-only record per accepted AI request; no chat content is stored."""

    __tablename__ = "ai_usage_requests"
    __table_args__ = (
        Index("ix_ai_usage_request_day_status", "quota_date", "status"),
        Index("ix_ai_usage_request_expiry", "status", "reservation_expires_at"),
        Index("ix_ai_usage_request_visitor_day", "visitor_hash", "quota_date"),
        Index("ix_ai_usage_request_ip_day", "ip_hash", "quota_date"),
        CheckConstraint("reserved_tokens >= 0", name="ck_ai_usage_request_reserved_nonnegative"),
    )

    request_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    quota_date: Mapped[date] = mapped_column(Date, nullable=False)
    visitor_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    reserved_tokens: Mapped[int] = mapped_column(BigInteger, nullable=False)
    prompt_tokens: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    completion_tokens: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    actual_total_tokens: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    reservation_expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class AIQuotaEvent(Base):
    """Coalesced exhaustion events, keyed only by pseudonymous identities."""

    __tablename__ = "ai_quota_events"
    __table_args__ = (
        UniqueConstraint(
            "quota_date", "scope", "error_code", "visitor_hash", "ip_hash",
            name="uq_ai_quota_event_day_scope_code_identity",
        ),
        Index("ix_ai_quota_event_day", "quota_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    quota_date: Mapped[date] = mapped_column(Date, nullable=False)
    scope: Mapped[str] = mapped_column(String(16), nullable=False)
    error_code: Mapped[str] = mapped_column(String(48), nullable=False)
    visitor_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    event_count: Mapped[int] = mapped_column(BigInteger, nullable=False, default=1, server_default=text("1"))
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
