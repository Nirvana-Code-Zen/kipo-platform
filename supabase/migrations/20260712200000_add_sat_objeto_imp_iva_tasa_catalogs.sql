-- Catálogos SAT: Objeto de impuesto (c_ObjetoImp) y Tasa de IVA para conceptos de CFDI.
-- Mismo patrón que 20260712184207_add_sat_catalogs.sql: solo lectura, se pueblan aquí
-- y se consultan desde la app para poblar selects.

-- ============================================================
-- Objeto de impuesto (c_ObjetoImp)
-- ============================================================
CREATE TABLE public.sat_objeto_imp (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_objeto_imp (code, description) VALUES
    ('01', 'No objeto de impuesto'),
    ('02', 'Sí objeto de impuesto'),
    ('03', 'Sí objeto de impuesto y no obligado al desglose'),
    ('04', 'Sí objeto de impuesto y no causa impuesto');

ALTER TABLE public.sat_objeto_imp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_objeto_imp_select" ON public.sat_objeto_imp
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tasa de IVA (deriva de c_Impuesto '002' + c_TipoFactor, aplicado a conceptos)
-- `code` conserva los valores usados históricamente en el frontend ("16", "8", "0",
-- "exento") para no romper el contrato de cálculo/envío existente en useInvoiceForm.ts.
-- `tax_code`/`factor_type`/`rate` se agregan para uso futuro en timbrado CFDI.
-- ============================================================
CREATE TABLE public.sat_iva_tasa (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    tax_code    TEXT NOT NULL,
    factor_type TEXT NOT NULL,
    rate        NUMERIC(6,4)
);

INSERT INTO public.sat_iva_tasa (code, description, tax_code, factor_type, rate) VALUES
    ('16',     'IVA 16%', '002', 'Tasa',   0.160000),
    ('8',      'IVA 8%',  '002', 'Tasa',   0.080000),
    ('0',      'IVA 0%',  '002', 'Tasa',   0.000000),
    ('exento', 'Exento',  '002', 'Exento', NULL);

ALTER TABLE public.sat_iva_tasa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_iva_tasa_select" ON public.sat_iva_tasa
    FOR SELECT TO anon, authenticated USING (true);
