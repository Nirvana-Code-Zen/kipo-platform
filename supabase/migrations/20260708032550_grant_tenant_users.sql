-- Grant table-level privileges so RLS policies can take effect
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_users TO service_role;
