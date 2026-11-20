# KNOWME AI quota management

## Configuration example

Set these in the local environment or deployment environment. The example contains no credentials and does not replace `.env`.

```dotenv
# Per-day application quotas (UTC)
AI_VISITOR_DAILY_REQUEST_LIMIT=20
AI_VISITOR_DAILY_TOKEN_LIMIT=150000
AI_IP_DAILY_REQUEST_LIMIT=200
AI_IP_DAILY_TOKEN_LIMIT=500000
AI_GLOBAL_DAILY_REQUEST_LIMIT=10000
AI_GLOBAL_DAILY_TOKEN_LIMIT=10000000

# Per-request safety limits
AI_MAX_INPUT_BYTES=196608
AI_MAX_INPUT_TOKENS=40000
AI_MAX_OUTPUT_TOKENS=2048
AI_MAX_TOTAL_TOKENS_PER_REQUEST=42048
AI_MAX_CONCURRENT_REQUESTS=20
AI_QUOTA_RESERVATION_TTL_SECONDS=180

# Privacy and proxy handling
AI_QUOTA_HMAC_SECRET=<set-a-long-random-secret>
AI_TRUSTED_PROXY_COUNT=1

# Keep Flask-Limiter distributed in production. Use the actual shared store URL;
# no Valkey/Redis service or URL is provisioned by this project.
RATELIMIT_STORAGE_URI=<shared-redis-compatible-store-url>
```

Defaults are applied by the application when an individual `AI_*_LIMIT` value is unset. `AI_QUOTA_HMAC_SECRET` falls back to Flask's existing `SECRET_KEY`; a dedicated stable secret is recommended so identity hashes do not rotate when session signing keys change. Never reuse an example placeholder as a secret.

The current Flask-Limiter rule of 10 requests per minute remains in place. In non-production, the existing memory storage default remains convenient for development. In production the app now refuses to start unless `RATELIMIT_STORAGE_URI` is configured, so it cannot silently use per-worker memory counters. A Redis-protocol URL can point to a future shared Valkey service, but this repository does not assume one exists.

`AI_TRUSTED_PROXY_COUNT` defaults to `0` outside production and is required in production. `ProxyFix` uses that count for forwarded client address and scheme headers. Set it to the verified number of trusted proxies in the actual deployment chain; do not use arbitrary client headers directly as identity. With zero trusted proxies, the quota key uses Flask's socket `remote_addr`.

## Defaults and behavior

| Variable | Default | Enforcement |
|---|---:|---|
| `AI_VISITOR_DAILY_REQUEST_LIMIT` | 20 | Requests reserved per signed Flask session visitor ID per UTC day |
| `AI_VISITOR_DAILY_TOKEN_LIMIT` | 150,000 | Actual plus outstanding reserved tokens per visitor/day |
| `AI_IP_DAILY_REQUEST_LIMIT` | 200 | Requests reserved per HMAC IP hash per UTC day |
| `AI_IP_DAILY_TOKEN_LIMIT` | 500,000 | Actual plus outstanding reserved tokens per IP/day |
| `AI_GLOBAL_DAILY_REQUEST_LIMIT` | 10,000 | Application-wide daily requests |
| `AI_GLOBAL_DAILY_TOKEN_LIMIT` | 10,000,000 | Application-wide actual plus outstanding reserved tokens |
| `AI_MAX_INPUT_BYTES` | 196,608 | Maximum raw `/api/chat` JSON body |
| `AI_MAX_INPUT_TOKENS` | 40,000 | Maximum preflight input estimate, including the server prompt |
| `AI_MAX_OUTPUT_TOKENS` | 2,048 | `max_tokens` sent to the existing OpenRouter model |
| `AI_MAX_TOTAL_TOKENS_PER_REQUEST` | 42,048 | Input estimate plus maximum output budget |
| `AI_MAX_CONCURRENT_REQUESTS` | 20 | Shared in-flight reservation ceiling across workers |
| `AI_QUOTA_RESERVATION_TTL_SECONDS` | 180 | Lease for recovering abandoned reservations; keep above provider timeout |
| `AI_QUOTA_HMAC_SECRET` | Existing `SECRET_KEY` | HMAC-SHA256 key for visitor/IP pseudonyms |
| `AI_TRUSTED_PROXY_COUNT` | 0 outside production; required in production | Number of trusted proxies for `ProxyFix` |
| `RATELIMIT_STORAGE_URI` | `memory://` outside production; required in production | Existing Flask-Limiter backend |

Daily counters use the UTC date. A daily quota denial reports seconds until the next UTC midnight. Context/request-size errors report `retry_after: 0`; concurrency denials report the earliest active reservation expiry. The server accepts up to 200 validated browser messages, each at most 12,000 characters, with at most 150,000 total message characters. The raw JSON body remains capped at `AI_MAX_INPUT_BYTES`. CSRF, Turnstile, user/assistant-only role validation, Flask-Limiter, OpenRouter provider integration, and the configured model remain active.

## Prompt and context budget

`system_prompt.py` is the one canonical source for the assistant prompt. It contains the confirmed company facts, routes, services, technologies, process, portfolio, package prices/features, anti-hallucination rules and multilingual response guidance. Repeated service/package descriptions and the parallel Armenian facts list were consolidated; Armenian comprehension, language-quality rules, terminology, transliteration examples, and useful customer-response examples remain. Pricing examples follow the current language-specific schedules (USD, RUB and AMD) and avoid currency conversion.

| Measurement | Before optimization | Optimized |
|---|---:|---:|
| Prompt characters | 42,100 | 20,827 |
| UTF-8 bytes | 53,263 | 25,865 |
| Token estimate | 53,271 from the old byte counter, including 8 system-message framing tokens; not a real tokenizer count | 11,331, approximate multilingual fallback; no exact compatible tokenizer is installed for the dynamic model |
| Reduction | — | 50.53% in characters; 51.44% in UTF-8 bytes; 78.73% compared with the old byte-counter estimate (not an apples-to-apples tokenizer comparison) |

The currently configured model is `openrouter/free` (also the application default), a dynamic selector whose underlying model/tokenizer may vary. The project has no tokenizer dependency installed. `estimate_input_tokens` therefore returns a clearly marked approximate `TokenEstimate`: a deterministic multilingual heuristic with a 20% safety margin and eight framing tokens per message. Its heuristic rates are 3.4 Latin letters per token (3.0 for code-like text), 1.7 Cyrillic, 1.4 Armenian, 2.0 other Unicode letters, and 2.5 digits/other characters; URLs use 3.0 characters per token and punctuation is counted per character. For a known fixed `openai/<model>` ID, it uses the locally installed optional `tiktoken` package when that package supports the model; content tokenization is then exact, but message framing and the whole request estimate remain approximate with a 10% safety factor. The estimator never downloads files or makes network requests. Successful provider usage remains authoritative.

The server is authoritative for context selection. The browser sends at most the latest 31 history messages and retains at most 30 messages in its API-history array; rendered chat bubbles remain in the visible UI. The API independently validates every supplied message (and rejects any browser-supplied system role), requires the final message to be the current user question, then selects the newest complete user/assistant pairs that fit. It always includes the server system prompt and latest user message, drops oldest pairs first, and never cuts message content or changes a role. It does not summarize or persist conversation content.

Available input is `min(AI_MAX_INPUT_TOKENS, AI_MAX_TOTAL_TOKENS_PER_REQUEST - AI_MAX_OUTPUT_TOKENS)`. The same selected prompt and history estimate must fit that input room; `AI_MAX_OUTPUT_TOKENS` is reserved separately. If even the system prompt and current question do not fit, the server returns HTTP 413 with `AI_CONTEXT_TOO_LARGE` and does not call OpenRouter. A daily visitor/IP/global quota denial remains HTTP 429; context overflow is 413; quota database, concurrency, and upstream provider throttling are temporary 503 responses with separate error codes.

After a successful response, `usage.prompt_tokens`, `usage.completion_tokens`, and `usage.total_tokens` are accepted only when all three are non-negative integers and the total equals the component sum. Missing or malformed usage is charged at the full reservation, never as zero.
## Atomic reservation and accounting policy

PostgreSQL stores one row per global, visitor, and IP daily bucket, plus a single shared concurrency-gate row. A unique constraint creates each bucket once. Reservation uses `INSERT ... ON CONFLICT DO NOTHING`, then conditional `UPDATE`s that atomically increment request/token reservations only if the request and token limits still fit. PostgreSQL row locks serialize concurrent workers on those rows. One transaction reserves the concurrency slot, all three quota scopes, and the usage-request row; any rejected scope rolls back every increment. This avoids an unprotected `SUM` followed by an insert.

The reservation is the input estimate plus the configured maximum output. Provider-reported usage replaces that reservation in all three daily buckets, releasing unused reserved tokens. Provider errors, timeouts, malformed/missing usage, and abandoned reservations are charged the full reservation conservatively; no missing usage is treated as zero. A request attempt counts against daily request quotas even if the provider fails. A crashed worker's in-flight slot is recovered after the lease expires, and its reserved token budget is retained as unknown usage.

Daily usage records contain request UUID, UTC date, HMAC visitor/IP hashes, status, reserved/actual token counts, and timestamps only. The application does not store conversation content, raw IPs, visitor IDs, API keys, or provider error bodies. Exhaustion events are coalesced by UTC day, pseudonymous identities, and error code.

`ai_quota.get_ai_usage_report(SessionLocal)` is the service-level report function for today's request counts, success/failure counts, reported prompt/completion/total usage, conservative charged tokens, remaining global quota, identity-hash groupings, and exhaustion events. It is ready for a future admin integration and is not exposed as a public route.

## Database migration and production steps

The additive, idempotent PostgreSQL DDL is in [`migrations/20261120_ai_quota.sql`](migrations/20261120_ai_quota.sql). Application startup does not run it, and this implementation has not connected to or changed Neon.

Before production deployment:

1. Create a Neon branch or equivalent isolated staging database and point a local/staging `DATABASE_URL` at it.
2. Review the SQL file and apply it to that staging database using the normal reviewed migration procedure. It creates only `ai_quota_buckets`, `ai_usage_requests`, and `ai_quota_events`, with indexes and constraints; it does not modify existing tables or rows.
3. Run the automated tests against temporary SQLite only, then validate the app against staging PostgreSQL and verify a concurrent reservation and UTC rollover there.
4. Back up/branch production, review the same DDL, and have the database owner apply it manually to Neon before deploying code that requires these tables. No production migration is automatic.
5. Set all `AI_*` limits, a stable random `AI_QUOTA_HMAC_SECRET`, the verified `AI_TRUSTED_PROXY_COUNT`, and a real shared `RATELIMIT_STORAGE_URI` in Render. Do not invent a Valkey URL; provision/confirm the service first. Existing Turnstile keys, `SECRET_KEY`, OpenRouter key/model, and `DATABASE_URL` remain deployment-managed secrets.
6. Deploy only after the table creation and required production environment values are confirmed. Check server-side usage reports and quota events after rollout.

Usage/request/event rows are retained for monitoring; schedule a reviewed retention policy before volume grows substantially. Never run the migration from a developer machine whose `DATABASE_URL` target has not been verified.
