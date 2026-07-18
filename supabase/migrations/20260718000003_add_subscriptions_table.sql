CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID NOT NULL UNIQUE REFERENCES public.tenants(id),
    tier                    TEXT NOT NULL,
    stripe_customer_id      TEXT,
    stripe_subscription_id  TEXT UNIQUE,
    status                  TEXT NOT NULL DEFAULT 'trialing',
    current_period_end      TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx
    ON public.subscriptions (stripe_customer_id);
