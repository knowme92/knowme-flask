-- Additive Start Project configurator fields.
-- Apply manually to the verified KNOWME production database after backup/branching.
-- Existing project requests are preserved and receive safe defaults.

ALTER TABLE project_requests
    ADD COLUMN IF NOT EXISTS layout_style VARCHAR(40) NOT NULL DEFAULT 'balanced',
    ADD COLUMN IF NOT EXISTS font_style VARCHAR(40) NOT NULL DEFAULT 'modern',
    ADD COLUMN IF NOT EXISTS animation_level VARCHAR(20) NOT NULL DEFAULT 'subtle',
    ADD COLUMN IF NOT EXISTS preferred_domain VARCHAR(253) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS security_requirements JSON NOT NULL DEFAULT '[]'::json;
