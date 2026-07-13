-- El backend (dashboard.py, invoices/stats.py, invoice/infrastructure/supabase_repository.py)
-- ya lee/decrementa public.tenants.stamps para controlar la cuota de timbrado CFDI por tenant,
-- pero la columna nunca se creó. Tenants nuevos inician en 0 (deben comprar un paquete de
-- timbres antes de timbrar su primera factura).
ALTER TABLE public.tenants
    ADD COLUMN stamps INTEGER NOT NULL DEFAULT 0 CHECK (stamps >= 0);
