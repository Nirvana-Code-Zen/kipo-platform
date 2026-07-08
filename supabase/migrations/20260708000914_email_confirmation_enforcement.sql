-- Schema interno: no expuesto al Data API
CREATE SCHEMA IF NOT EXISTS internal;
REVOKE ALL ON SCHEMA internal FROM PUBLIC, anon, authenticated;

-- Función que verifica email confirmado vía auth.users
-- SECURITY DEFINER necesario: authenticated no puede leer auth.users directamente
CREATE OR REPLACE FUNCTION internal.is_email_confirmed()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = (SELECT auth.uid())
          AND email_confirmed_at IS NOT NULL
    );
$$;

-- Solo el rol autenticado puede ejecutarla, nadie más
REVOKE ALL ON FUNCTION internal.is_email_confirmed() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION internal.is_email_confirmed() TO authenticated;

-- RLS INSERT: solo usuarios con email confirmado pueden crear tenants
CREATE POLICY "tenants_insert_confirmed" ON public.tenants
    FOR INSERT TO authenticated
    WITH CHECK (internal.is_email_confirmed());

-- RLS INSERT: solo usuarios con email confirmado pueden vincularse a un tenant
CREATE POLICY "tenant_users_insert_confirmed" ON public.tenant_users
    FOR INSERT TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = user_id
        AND internal.is_email_confirmed()
    );
