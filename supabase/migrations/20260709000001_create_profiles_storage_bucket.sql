INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "profiles_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "profiles_select" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'profiles');

CREATE POLICY "profiles_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "profiles_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );
