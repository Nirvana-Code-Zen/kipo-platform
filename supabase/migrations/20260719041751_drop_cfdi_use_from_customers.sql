DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name LIKE 'tenant_%'
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = r.schema_name
              AND table_name   = 'customers'
              AND column_name  = 'cfdi_use'
        ) THEN
            EXECUTE format('ALTER TABLE %I.customers DROP COLUMN cfdi_use', r.schema_name);
        END IF;
    END LOOP;
END;
$$;
