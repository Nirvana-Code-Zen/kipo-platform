-- Enums
CREATE TYPE public.plan_type AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE public.tenant_status AS ENUM ('active', 'suspended_billing', 'trial', 'inactive');
CREATE TYPE public.tenant_role AS ENUM ('owner', 'employee');

-- Tenants
CREATE TABLE public.tenants (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_name         TEXT        NOT NULL UNIQUE,
    name                TEXT        NOT NULL,
    plan_type           public.plan_type        NOT NULL DEFAULT 'free',
    status              public.tenant_status    NOT NULL DEFAULT 'trial',
    features_enabled    TEXT[]      NOT NULL DEFAULT '{}',
    timezone            TEXT        NOT NULL DEFAULT 'America/Mexico_City',
    currency            TEXT        NOT NULL DEFAULT 'MXN',
    storage_quota_bytes BIGINT      NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant users (bridge)
CREATE TABLE public.tenant_users (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role        public.tenant_role NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, user_id)
);

-- Indexes
CREATE INDEX idx_tenant_users_user_id   ON public.tenant_users (user_id);
CREATE INDEX idx_tenant_users_tenant_id ON public.tenant_users (tenant_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.tenants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

-- tenants: solo ve los tenants a los que pertenece
CREATE POLICY "tenants_select" ON public.tenants
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tenant_users tu
            WHERE tu.tenant_id = tenants.id
              AND tu.user_id = (SELECT auth.uid())
        )
    );

-- tenant_users: solo ve sus propias membresías
CREATE POLICY "tenant_users_select" ON public.tenant_users
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = user_id);
