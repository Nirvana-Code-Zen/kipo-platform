-- Short-lived, single-use exchange codes for handing off an authenticated
-- session across a cross-origin redirect (root domain -> tenant subdomain
-- after login). The httpOnly kipo_refresh_token cookie is not reliably sent
-- back cross-subdomain from a JS fetch, so the origin page mints one of
-- these codes tied to the caller's current refresh token, the destination
-- subdomain exchanges it once for a fresh session, and the raw refresh
-- token itself never appears in a URL or reaches browser JS.
--
-- Only ever touched via admin_connection() (kipo_backend) — never through
-- the Supabase client/PostgREST — so RLS is intentionally not enabled here.
CREATE TABLE public.auth_exchange_codes (
    code            TEXT        PRIMARY KEY,
    refresh_token   TEXT        NOT NULL,
    user_id         UUID        NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL
);

-- Supports the lazy expired-row cleanup sweep run on each create().
CREATE INDEX idx_auth_exchange_codes_expires_at ON public.auth_exchange_codes (expires_at);

GRANT SELECT, INSERT, DELETE ON public.auth_exchange_codes TO kipo_backend;
