ALTER TABLE public.tenants
    ADD COLUMN IF NOT EXISTS stamped JSONB NOT NULL DEFAULT '{"drafts": 0, "stamped": 0, "cancelled": 0}'::jsonb;
