-- Make bucket private — files served via signed URLs only
UPDATE storage.buckets SET public = false WHERE id = 'profiles';

-- Drop old userId-scoped policies from first migration
DROP POLICY IF EXISTS "profiles_insert" ON storage.objects;
DROP POLICY IF EXISTS "profiles_select" ON storage.objects;
DROP POLICY IF EXISTS "profiles_update" ON storage.objects;
DROP POLICY IF EXISTS "profiles_delete" ON storage.objects;

-- Path structure: profiles/{schema_name}/{userId}/{filename}
-- folder[1] = tenant schema_name (slug), folder[2] = userId
-- All policies verify user belongs to the tenant with that schema_name

CREATE POLICY "profiles_tenant_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profiles'
    AND EXISTS (
      SELECT 1 FROM public.tenant_users tu
      JOIN public.tenants t ON t.id = tu.tenant_id
      WHERE t.schema_name = (storage.foldername(objects.name))[1]
        AND tu.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "profiles_tenant_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'profiles'
    AND EXISTS (
      SELECT 1 FROM public.tenant_users tu
      JOIN public.tenants t ON t.id = tu.tenant_id
      WHERE t.schema_name = (storage.foldername(objects.name))[1]
        AND tu.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "profiles_tenant_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'profiles'
    AND EXISTS (
      SELECT 1 FROM public.tenant_users tu
      JOIN public.tenants t ON t.id = tu.tenant_id
      WHERE t.schema_name = (storage.foldername(objects.name))[1]
        AND tu.user_id = (SELECT auth.uid())
    )
    AND (storage.foldername(objects.name))[2] = (SELECT auth.uid()::text)
  );

CREATE POLICY "profiles_tenant_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'profiles'
    AND EXISTS (
      SELECT 1 FROM public.tenant_users tu
      JOIN public.tenants t ON t.id = tu.tenant_id
      WHERE t.schema_name = (storage.foldername(objects.name))[1]
        AND tu.user_id = (SELECT auth.uid())
    )
    AND (storage.foldername(objects.name))[2] = (SELECT auth.uid()::text)
  );
