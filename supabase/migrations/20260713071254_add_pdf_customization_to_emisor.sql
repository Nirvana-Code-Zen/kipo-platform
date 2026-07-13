-- Retroactively adds PDF customization columns to every already-provisioned
-- tenant schema's emisor table. provision_schema() only runs once per
-- tenant at signup, so this backfills tenants created before this change.
-- New tenants get these columns directly from provision_schema()'s DDL.
--
-- display_options is stored as a single JSONB column (not flat boolean
-- columns like csd_configured) because these 9 toggles are a cohesive
-- group that is always read/written together as a whole (never queried
-- individually in a WHERE clause, unlike csd_configured which gates
-- business logic elsewhere). JSONB also makes it easier to extend the
-- option set later without another migration touching every tenant schema.
DO $$
DECLARE
    tenant_schema TEXT;
BEGIN
    FOR tenant_schema IN SELECT schema_name FROM public.tenants LOOP
        BEGIN
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS custom_section_html TEXT',
                tenant_schema
            );
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS display_options JSONB NOT NULL DEFAULT ''{}''::jsonb',
                tenant_schema
            );
        EXCEPTION WHEN undefined_table THEN
            CONTINUE; -- tenant schema has no emisor table yet, skip safely
        END;
    END LOOP;
END;
$$;
