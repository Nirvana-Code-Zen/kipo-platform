-- Catálogos SAT adicionales para Carta Porte (Complemento Carta Porte 3.1)
-- como tablas de referencia en el schema public. Solo lectura: se pueblan en
-- esta migración y se consultan desde la app para poblar selects/catálogos.
-- Nombres de columna en inglés, contenido en español.

-- ============================================================
-- Motivo de traslado (c_MotivoTraslado)
-- ============================================================
CREATE TABLE public.sat_motivo_traslado (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_motivo_traslado (code, description) VALUES
    ('01', 'Envío de mercancías facturadas con anterioridad'),
    ('02', 'Reubicación de mercancías propias'),
    ('03', 'Envío de mercancías objeto de contrato de consignación'),
    ('04', 'Envío de mercancías para posterior enajenación'),
    ('05', 'Envío de mercancías propiedad de terceros'),
    ('99', 'Otros');

ALTER TABLE public.sat_motivo_traslado ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_motivo_traslado_select" ON public.sat_motivo_traslado
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Incoterm (c_INCOTERM)
-- ============================================================
CREATE TABLE public.sat_incoterm (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_incoterm (code, description) VALUES
    ('CFR', 'Coste y flete (puerto de destino convenido).'),
    ('CIF', 'Coste, seguro y flete (puerto de destino convenido).'),
    ('CPT', 'Transporte pagado hasta (el lugar de destino convenido).'),
    ('CIP', 'Transporte y seguro pagados hasta (lugar de destino convenido).'),
    ('DAP', 'Entregada en lugar.'),
    ('DDP', 'Entregada derechos pagados (lugar de destino convenido).'),
    ('DPU', 'Entregada y descargada en lugar acordado.'),
    ('EXW', 'En fabrica (lugar convenido).'),
    ('FCA', 'Franco transportista (lugar designado).'),
    ('FAS', 'Franco al costado del buque (puerto de carga convenido).'),
    ('FOB', 'Franco a bordo (puerto de carga convenido).');

ALTER TABLE public.sat_incoterm ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_incoterm_select" ON public.sat_incoterm
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Unidad de Aduana (c_UnidadAduana)
-- ============================================================
CREATE TABLE public.sat_unidad_aduana (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_unidad_aduana (code, description) VALUES
    ('01', 'KILO'),
    ('02', 'GRAMO'),
    ('03', 'METRO LINEAL'),
    ('04', 'METRO CUADRADO'),
    ('05', 'METRO CUBICO'),
    ('06', 'PIEZA'),
    ('07', 'CABEZA'),
    ('08', 'LITRO'),
    ('09', 'PAR'),
    ('10', 'KILOWATT'),
    ('11', 'MILLAR'),
    ('12', 'JUEGO'),
    ('13', 'KILOWATT/HORA'),
    ('14', 'TONELADA'),
    ('15', 'BARRIL'),
    ('16', 'GRAMO NETO'),
    ('17', 'DECENAS'),
    ('18', 'CIENTOS'),
    ('19', 'DOCENAS'),
    ('20', 'CAJA'),
    ('21', 'BOTELLA'),
    ('22', 'CARAT'),
    ('99', 'SERVICIO');

ALTER TABLE public.sat_unidad_aduana ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_unidad_aduana_select" ON public.sat_unidad_aduana
    FOR SELECT TO anon, authenticated USING (true);
