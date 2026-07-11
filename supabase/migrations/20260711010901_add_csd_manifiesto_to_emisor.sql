-- Retroactively adds CSD/manifiesto columns to every already-provisioned
-- tenant schema's emisor table. provision_schema() only runs once per
-- tenant at signup, so this backfills tenants created before this change.
-- New tenants get these columns directly from provision_schema()'s DDL.
DO $$
DECLARE
    tenant_schema TEXT;
BEGIN
    FOR tenant_schema IN SELECT schema_name FROM public.tenants LOOP
        BEGIN
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS facturapi_organization_id TEXT',
                tenant_schema
            );
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS csd_configured BOOLEAN NOT NULL DEFAULT FALSE',
                tenant_schema
            );
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS csd_configured_at TIMESTAMPTZ',
                tenant_schema
            );
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS manifiesto_signed BOOLEAN NOT NULL DEFAULT FALSE',
                tenant_schema
            );
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS manifiesto_signed_at TIMESTAMPTZ',
                tenant_schema
            );
        EXCEPTION WHEN undefined_table THEN
            CONTINUE; -- tenant schema has no emisor table yet, skip safely
        END;
    END LOOP;
END;
$$;
