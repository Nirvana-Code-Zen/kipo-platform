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

-- INSERT en tenants y tenant_users solo ocurre desde el backend (service_role)
-- El backend valida email confirmation a nivel aplicación antes de insertar
-- No se necesitan políticas INSERT — service_role bypasea RLS
