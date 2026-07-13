-- Dedicated role for kipo-platform's direct Postgres connection (admin_connection()
-- in shared/db_admin.py). Previously the backend connected as the `postgres`
-- superuser, whose credential leaking would mean full cluster compromise
-- (DROP DATABASE, ALTER SYSTEM, CREATE ROLE, read auth.users password hashes,
-- etc). This role can only do what the backend actually needs.
--
-- BYPASSRLS is intentional, not an oversight: it mirrors the existing design
-- already described in 20260708000914_email_confirmation_enforcement.sql
-- ("service_role bypasea RLS" for tenants/tenant_users inserts) and is
-- required for provision_schema() to freely create/alter objects inside each
-- new tenant schema. RLS-enforcing this role would mean rewriting every
-- policy in this migration set — a separate authorization redesign, not a
-- connection-hardening change.
--
-- Password is NOT set here — never commit secrets to a migration file.
-- After this runs against a project, set it once via the Supabase SQL editor:
--   ALTER ROLE kipo_backend WITH PASSWORD '<generate a long random secret>';
-- then put the resulting DATABASE_URL only in Vercel's encrypted, server-side
-- environment variables (never a NEXT_PUBLIC_ var).
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'kipo_backend') THEN
        CREATE ROLE kipo_backend WITH
            LOGIN
            NOSUPERUSER
            NOCREATEROLE
            NOCREATEDB
            NOREPLICATION
            BYPASSRLS;
    END IF;
END
$$;

-- Needed for provision_schema()'s `CREATE SCHEMA IF NOT EXISTS <tenant>`.
-- Schemas it creates are owned by it, so it automatically gets full rights
-- on the customers/emisor/invoices/invoice_concepts tables inside them —
-- no extra grants needed per tenant schema.
GRANT CREATE ON DATABASE postgres TO kipo_backend;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO kipo_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_users TO kipo_backend;

-- Read-only reference data (SAT catalogs) — covers existing sat_* tables and
-- anything else already in public at migration time.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO kipo_backend;

-- Keep future public tables/catalogs readable by kipo_backend without a
-- follow-up migration every time one is added.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO kipo_backend;
