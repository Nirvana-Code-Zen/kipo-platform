CREATE TABLE IF NOT EXISTS public.stamp_purchases (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                   UUID NOT NULL REFERENCES public.tenants(id),
    pack_id                     TEXT NOT NULL,
    qty                         INTEGER NOT NULL,
    amount_cents                INTEGER NOT NULL,
    stripe_checkout_session_id  TEXT NOT NULL UNIQUE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stamp_purchases_tenant_id_idx
    ON public.stamp_purchases (tenant_id);
