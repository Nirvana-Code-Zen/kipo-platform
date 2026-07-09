CREATE TABLE IF NOT EXISTS refresh_token_families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    supabase_refresh_token TEXT,
    user_id UUID NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS refresh_token_families_family_id_idx
    ON refresh_token_families (family_id);
CREATE INDEX IF NOT EXISTS refresh_token_families_token_hash_idx
    ON refresh_token_families (token_hash);
CREATE INDEX IF NOT EXISTS refresh_token_families_user_id_idx
    ON refresh_token_families (user_id);
