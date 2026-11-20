-- Additive KNOWME AI quota schema. Review and apply manually after staging validation.
-- This file is intentionally not run by application startup or automated tests.

CREATE TABLE IF NOT EXISTS ai_quota_buckets (
    id BIGSERIAL PRIMARY KEY,
    scope VARCHAR(16) NOT NULL,
    quota_date DATE NOT NULL,
    subject_hash VARCHAR(64) NOT NULL DEFAULT '',
    request_count BIGINT NOT NULL DEFAULT 0 CHECK (request_count >= 0),
    used_tokens BIGINT NOT NULL DEFAULT 0 CHECK (used_tokens >= 0),
    reserved_tokens BIGINT NOT NULL DEFAULT 0 CHECK (reserved_tokens >= 0),
    current_concurrent INTEGER NOT NULL DEFAULT 0 CHECK (current_concurrent >= 0),
    CONSTRAINT uq_ai_quota_bucket_identity UNIQUE (scope, quota_date, subject_hash)
);

CREATE INDEX IF NOT EXISTS ix_ai_quota_bucket_day_scope
    ON ai_quota_buckets (quota_date, scope);

CREATE TABLE IF NOT EXISTS ai_usage_requests (
    request_id VARCHAR(36) PRIMARY KEY,
    quota_date DATE NOT NULL,
    visitor_hash VARCHAR(64) NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    reserved_tokens BIGINT NOT NULL CHECK (reserved_tokens >= 0),
    prompt_tokens BIGINT NULL,
    completion_tokens BIGINT NULL,
    actual_total_tokens BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    reservation_expires_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS ix_ai_usage_request_day_status
    ON ai_usage_requests (quota_date, status);
CREATE INDEX IF NOT EXISTS ix_ai_usage_request_expiry
    ON ai_usage_requests (status, reservation_expires_at);
CREATE INDEX IF NOT EXISTS ix_ai_usage_request_visitor_day
    ON ai_usage_requests (visitor_hash, quota_date);
CREATE INDEX IF NOT EXISTS ix_ai_usage_request_ip_day
    ON ai_usage_requests (ip_hash, quota_date);

CREATE TABLE IF NOT EXISTS ai_quota_events (
    id BIGSERIAL PRIMARY KEY,
    quota_date DATE NOT NULL,
    scope VARCHAR(16) NOT NULL,
    error_code VARCHAR(48) NOT NULL,
    visitor_hash VARCHAR(64) NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    event_count BIGINT NOT NULL DEFAULT 1,
    first_seen_at TIMESTAMPTZ NOT NULL,
    last_seen_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_ai_quota_event_day_scope_code_identity
        UNIQUE (quota_date, scope, error_code, visitor_hash, ip_hash)
);

CREATE INDEX IF NOT EXISTS ix_ai_quota_event_day
    ON ai_quota_events (quota_date);
