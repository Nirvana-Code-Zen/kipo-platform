INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('org-logos', 'org-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "org_logos_select" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'org-logos');

CREATE POLICY "org_logos_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'org-logos'
    AND (storage.foldername(name))[1] = (
      SELECT t.schema_name FROM public.tenants t
      JOIN public.tenant_users tu ON tu.tenant_id = t.id
      WHERE tu.user_id = auth.uid() AND tu.role = 'owner'
      LIMIT 1
    )
  );

CREATE POLICY "org_logos_update" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'org-logos'
    AND (storage.foldername(name))[1] = (
      SELECT t.schema_name FROM public.tenants t
      JOIN public.tenant_users tu ON tu.tenant_id = t.id
      WHERE tu.user_id = auth.uid() AND tu.role = 'owner'
      LIMIT 1
    )
  );

CREATE POLICY "org_logos_delete" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'org-logos'
    AND (storage.foldername(name))[1] = (
      SELECT t.schema_name FROM public.tenants t
      JOIN public.tenant_users tu ON tu.tenant_id = t.id
      WHERE tu.user_id = auth.uid() AND tu.role = 'owner'
      LIMIT 1
    )
  );

-- Retroactively adds the logo_path column to every already-provisioned
-- tenant schema's emisor table. provision_schema() only runs once per
-- tenant at signup, so this backfills tenants created before this change.
-- New tenants get this column directly from provision_schema()'s DDL.
DO $$
DECLARE
    tenant_schema TEXT;
BEGIN
    FOR tenant_schema IN SELECT schema_name FROM public.tenants LOOP
        BEGIN
            EXECUTE format(
                'ALTER TABLE %I.emisor ADD COLUMN IF NOT EXISTS logo_path TEXT',
                tenant_schema
            );
        EXCEPTION WHEN undefined_table THEN
            CONTINUE; -- tenant schema has no emisor table yet, skip safely
        END;
    END LOOP;
END;
$$;
