-- Catálogos SAT para Carta Porte (Complemento Carta Porte 3.1) como tablas de
-- referencia en el schema public. Solo lectura: se pueblan en esta migración
-- y se consultan desde la app para poblar selects/catálogos. Nombres de
-- columna en inglés, contenido en español.

-- ============================================================
-- Régimenes Aduaneros (c_RegimenAduanero)
-- ============================================================
CREATE TABLE public.sat_regimen_aduanero (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_regimen_aduanero (code, description) VALUES
    ('IMD', 'Importación definitiva'),
    ('EXD', 'Exportación definitiva'),
    ('ITR', 'Tránsito interno de mercancías'),
    ('ITE', 'Tránsito interno de mercancías para exportación'),
    ('ETR', 'Tránsito externo de mercancías'),
    ('ETE', 'Tránsito externo de mercancías para exportación'),
    ('DFI', 'Depósito fiscal'),
    ('RFE', 'Recinto fiscalizado estratégico'),
    ('RFS', 'Recinto fiscalizado'),
    ('TRA', 'Tránsito aduanero');

ALTER TABLE public.sat_regimen_aduanero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_regimen_aduanero_select" ON public.sat_regimen_aduanero
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Medio de Transporte (c_MedioTransporte)
-- ============================================================
CREATE TABLE public.sat_medio_transporte (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_medio_transporte (code, description) VALUES
    ('01', 'Autotransporte'),
    ('02', 'Transporte Marítimo'),
    ('03', 'Transporte Aéreo'),
    ('04', 'Transporte Ferroviario'),
    ('05', 'Otro');

ALTER TABLE public.sat_medio_transporte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_medio_transporte_select" ON public.sat_medio_transporte
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Estación (c_TipoEstacion)
-- ============================================================
CREATE TABLE public.sat_tipo_estacion (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_estacion (code, description) VALUES
    ('01', 'Origen Nacional'),
    ('02', 'Intermedia'),
    ('03', 'Destino Final Nacional');

ALTER TABLE public.sat_tipo_estacion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_estacion_select" ON public.sat_tipo_estacion
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Permisos SCT (c_PermisoSCT)
-- ============================================================
CREATE TABLE public.sat_permiso_sct (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_permiso_sct (code, description) VALUES
    ('TPAF01', 'Autotransporte Federal de carga general'),
    ('TPAF02', 'Transporte privado de carga'),
    ('TPAF03', 'Autotransporte Federal de Carga Especializada de materiales y residuos peligrosos'),
    ('TPAF04', 'Transporte de automóviles sin rodar en vehículo tipo góndola'),
    ('TPAF05', 'Transporte de carga de gran peso y/o volumen de hasta 90 toneladas'),
    ('TPAF06', 'Transporte de carga especializada de gran peso y/o volumen de más 90 toneladas'),
    ('TPAF07', 'Transporte Privado de materiales y residuos peligrosos'),
    ('TPAF08', 'Autotransporte internacional de carga de largo recorrido'),
    ('TPAF09', 'Autotransporte internacional de carga especializada de materiales y residuos peligrosos de largo recorrido'),
    ('TPAF10', 'Autotransporte Federal de Carga General cuyo ámbito de aplicación comprende la franja fronteriza con Estados Unidos'),
    ('TPAF11', 'Autotransporte Federal de Carga Especializada cuyo ámbito de aplicación comprende la franja fronteriza con Estados Unidos'),
    ('TPAF12', 'Servicio auxiliar de arrastre en las vías generales de comunicación'),
    ('TPAF13', 'Servicio auxiliar de arrastre, arrastre y salvamento, y depósito de vehículos'),
    ('TPAF14', 'Servicio de paquetería y mensajería en las vías generales de comunicación'),
    ('TPAF15', 'Transporte especial para tránsito de grúas industriales hasta 90 toneladas'),
    ('TPAF16', 'Servicio federal para empresas arrendadoras servicio público federal'),
    ('TPAF17', 'Empresas trasladistas de vehículos nuevos'),
    ('TPAF18', 'Empresas fabricantes o distribuidoras de vehículos nuevos'),
    ('TPAF19', 'Autorización para circular con tractocamión doblemente articulado'),
    ('TPAF20', 'Autotransporte Federal de Carga Especializada de fondos y valores'),
    ('TPTM01', 'Permiso temporal para navegación de cabotaje'),
    ('TPTA01', 'Concesión/ autorización servicio regular nacional/internacional (empresas mexicanas)'),
    ('TPTA02', 'Permiso servicio aéreo regular empresas extranjeras'),
    ('TPTA03', 'Permiso servicio no regular de fletamento nacional/internacional'),
    ('TPTA04', 'Permiso servicio no regular de taxi aéreo nacional/internacional'),
    ('TPXX00', 'Permiso no contemplado en el catálogo');

ALTER TABLE public.sat_permiso_sct ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_permiso_sct_select" ON public.sat_permiso_sct
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Sector COFEPRIS (c_SectorCOFEPRIS)
-- ============================================================
CREATE TABLE public.sat_sector_cofepris (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_sector_cofepris (code, description) VALUES
    ('01', 'Medicamento'),
    ('02', 'Precursores y químicos de uso dual'),
    ('03', 'Psicotrópicos y estupefacientes'),
    ('04', 'Sustancias tóxicas'),
    ('05', 'Plaguicidas y fertilizantes');

ALTER TABLE public.sat_sector_cofepris ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_sector_cofepris_select" ON public.sat_sector_cofepris
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Forma Farmacéutica (c_FormaFarmacéutica)
-- ============================================================
CREATE TABLE public.sat_forma_farmaceutica (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_forma_farmaceutica (code, description) VALUES
    ('01', 'Tableta'),
    ('02', 'Cápsulas'),
    ('03', 'Comprimidos'),
    ('04', 'Grageas'),
    ('05', 'Suspensión'),
    ('06', 'Solución'),
    ('07', 'Emulsión'),
    ('08', 'Jarabe'),
    ('09', 'Inyectable'),
    ('10', 'Crema'),
    ('11', 'Ungüento'),
    ('12', 'Aerosol'),
    ('13', 'Gas medicinal'),
    ('14', 'Gel'),
    ('15', 'Implante'),
    ('16', 'Óvulo'),
    ('17', 'Parche'),
    ('18', 'Pasta'),
    ('19', 'Polvo'),
    ('20', 'Supositorio');

ALTER TABLE public.sat_forma_farmaceutica ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_forma_farmaceutica_select" ON public.sat_forma_farmaceutica
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Condiciones Especiales (c_CondicionesEspeciales)
-- ============================================================
CREATE TABLE public.sat_condiciones_especiales (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_condiciones_especiales (code, description) VALUES
    ('01', 'Congelados'),
    ('02', 'Refrigerados'),
    ('03', 'Temperatura controlada'),
    ('04', 'Temperatura ambiente');

ALTER TABLE public.sat_condiciones_especiales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_condiciones_especiales_select" ON public.sat_condiciones_especiales
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Materia (c_TipoMateria)
-- ============================================================
CREATE TABLE public.sat_tipo_materia (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_materia (code, description) VALUES
    ('01', 'Materia prima'),
    ('02', 'Materia procesada'),
    ('03', 'Materia terminada (producto terminado)'),
    ('04', 'Materia para la industria manufacturera'),
    ('05', 'Otra');

ALTER TABLE public.sat_tipo_materia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_materia_select" ON public.sat_tipo_materia
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Documento de Aduana (c_TipoDocumentoAduanero)
-- ============================================================
CREATE TABLE public.sat_tipo_documento_aduanero (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_documento_aduanero (code, description) VALUES
    ('01', 'Pedimento'),
    ('02', 'Autorización de importación temporal'),
    ('03', 'Autorización de importación temporal de embarcaciones'),
    ('04', 'Autorización de importación temporal de mercancías para mantenimiento/reparación'),
    ('05', 'Autorización para importación de vehículos especializados'),
    ('06', 'Aviso de exportación temporal'),
    ('07', 'Aviso traslado (IMMEX/RFE/Operador Económico Autorizado)'),
    ('08', 'Aviso traslado autopartes franja fronteriza'),
    ('09', 'Constancia importación/retorno/transferencia contenedores'),
    ('10', 'Constancia de transferencia de mercancías'),
    ('11', 'Autorización de donación de mercancías (extranjero)'),
    ('12', 'Cuaderno ATA'),
    ('13', 'Listas de intercambio'),
    ('14', 'Permiso de Importación Temporal'),
    ('15', 'Permiso importación temporal casa rodante'),
    ('16', 'Permiso importación temporal embarcaciones'),
    ('17', 'Solicitud donación (emergencias/desastres)'),
    ('18', 'Aviso de consolidado'),
    ('19', 'Aviso de cruce de mercancias'),
    ('20', 'Otro');

ALTER TABLE public.sat_tipo_documento_aduanero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_documento_aduanero_select" ON public.sat_tipo_documento_aduanero
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Transporte (c_ParteTransporte)
-- ============================================================
CREATE TABLE public.sat_parte_transporte (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_parte_transporte (code, description) VALUES
    ('PT01', 'Camión unitario'),
    ('PT02', 'Camión'),
    ('PT03', 'Tractocamión'),
    ('PT04', 'Remolque'),
    ('PT05', 'Semirremolque'),
    ('PT06', 'Vehículo ligero de carga'),
    ('PT07', 'Grúa'),
    ('PT08', 'Aeronave'),
    ('PT09', 'Barco o buque'),
    ('PT10', 'Carro o vagón'),
    ('PT11', 'Contenedor'),
    ('PT12', 'Locomotora');

ALTER TABLE public.sat_parte_transporte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_parte_transporte_select" ON public.sat_parte_transporte
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Figuras de Transporte (c_FiguraTransporte)
-- ============================================================
CREATE TABLE public.sat_figura_transporte (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_figura_transporte (code, description) VALUES
    ('01', 'Operador'),
    ('02', 'Propietario'),
    ('03', 'Arrendador'),
    ('04', 'Notificado'),
    ('05', 'Integrante de Coordinados');

ALTER TABLE public.sat_figura_transporte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_figura_transporte_select" ON public.sat_figura_transporte
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Registro ISTMO (c_RegistroISTMO)
-- ============================================================
CREATE TABLE public.sat_registro_istmo (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_registro_istmo (code, description) VALUES
    ('01', 'Coatzacoalcos I'),
    ('02', 'Coatzacoalcos II'),
    ('03', 'Texistepec'),
    ('04', 'San Juan Evangelista'),
    ('05', 'Salina Cruz'),
    ('06', 'San Blas Atempa');

ALTER TABLE public.sat_registro_istmo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_registro_istmo_select" ON public.sat_registro_istmo
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Clave de Tipo de Carga (c_ClaveTipoCarga)
-- ============================================================
CREATE TABLE public.sat_clave_tipo_carga (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_clave_tipo_carga (code, description) VALUES
    ('CGS', 'Carga General Suelta'),
    ('CGC', 'Carga General Contenerizada'),
    ('GMN', 'Gran Mineral'),
    ('GAG', 'Granel Agrícola'),
    ('OFL', 'Otros Fluidos'),
    ('PYD', 'Petróleo y Derivados');

ALTER TABLE public.sat_clave_tipo_carga ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_clave_tipo_carga_select" ON public.sat_clave_tipo_carga
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Configuración Marítima (c_ConfiguracionMaritima)
-- ============================================================
CREATE TABLE public.sat_configuracion_maritima (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_configuracion_maritima (code, description) VALUES
    ('B01', 'Abastecedor'),
    ('B02', 'Barcaza'),
    ('B03', 'Granelero'),
    ('B04', 'Porta Contenedor'),
    ('B05', 'Draga'),
    ('B06', 'Pesquero'),
    ('B07', 'Carga General'),
    ('B08', 'Quimiqueros'),
    ('B09', 'Transbordadores'),
    ('B10', 'Carga RoRo'),
    ('B11', 'Investigación'),
    ('B12', 'Tanquero'),
    ('B13', 'Gasero'),
    ('B14', 'Remolcador'),
    ('B15', 'Extraordinaria especialización');

ALTER TABLE public.sat_configuracion_maritima ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_configuracion_maritima_select" ON public.sat_configuracion_maritima
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Tráfico Ferroviario (c_TraficoFerroviario)
-- ============================================================
CREATE TABLE public.sat_trafico_ferroviario (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_trafico_ferroviario (code, description) VALUES
    ('TT01', 'Tráfico local'),
    ('TT02', 'Tráfico interlineal remitido'),
    ('TT03', 'Tráfico interlineal recibido'),
    ('TT04', 'Tráfico interlineal en tránsito');

ALTER TABLE public.sat_trafico_ferroviario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_trafico_ferroviario_select" ON public.sat_trafico_ferroviario
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Contenedor (c_TipoContenedor)
-- ============================================================
CREATE TABLE public.sat_tipo_contenedor (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_contenedor (code, description) VALUES
    ('TC01', 'Contenedor de 6.1 Mts de longitud'),
    ('TC02', 'Contenedor de 12.2 Mts de longitud'),
    ('TC03', 'Contenedor de 13.7 Mts de longitud'),
    ('TC04', 'Contenedor de 14.6 Mts de longitud'),
    ('TC05', 'Contenedor de 16.1 Mts de longitud');

ALTER TABLE public.sat_tipo_contenedor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_contenedor_select" ON public.sat_tipo_contenedor
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Contenedor Marítimo (c_TipoContenedorMaritimo)
-- ============================================================
CREATE TABLE public.sat_tipo_contenedor_maritimo (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_contenedor_maritimo (code, description) VALUES
    ('CM001', 'Contenedores refrigerados de 20FT'),
    ('CM002', 'Contenedores refrigerados de 40FT'),
    ('CM003', 'Contenedores estándar de 8FT'),
    ('CM004', 'Contenedores estándar de 10FT'),
    ('CM005', 'Contenedores estándar de 20FT'),
    ('CM006', 'Contenedores estándar de 40FT'),
    ('CM007', 'Contenedores Open Side'),
    ('CM008', 'Contenedor Isotanque'),
    ('CM009', 'Contenedor flat racks'),
    ('CM010', 'Buque tanque'),
    ('CM011', 'Ferri'),
    ('CM012', 'Ferri – Turístico y vacíos');

ALTER TABLE public.sat_tipo_contenedor_maritimo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_contenedor_maritimo_select" ON public.sat_tipo_contenedor_maritimo
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Carro Ferroviario (c_TipoCarroFerroviario)
-- ============================================================
CREATE TABLE public.sat_tipo_carro_ferroviario (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_carro_ferroviario (code, description) VALUES
    ('TC01', 'Furgón'),
    ('TC02', 'Góndola'),
    ('TC03', 'Tolva'),
    ('TC04', 'Tanque'),
    ('TC05', 'Plataforma Intermodal'),
    ('TC06', 'Plataforma de Uso General'),
    ('TC07', 'Plataforma Automotriz'),
    ('TC08', 'Locomotora'),
    ('TC09', 'Carro Especial'),
    ('TC10', 'Pasajeros'),
    ('TC11', 'Mantenimiento de Vía');

ALTER TABLE public.sat_tipo_carro_ferroviario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_carro_ferroviario_select" ON public.sat_tipo_carro_ferroviario
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Servicio Ferroviario (c_TipoServicioFerroviario)
-- ============================================================
CREATE TABLE public.sat_tipo_servicio_ferroviario (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_servicio_ferroviario (code, description) VALUES
    ('TS01', 'Carros Ferroviarios'),
    ('TS02', 'Carros Ferroviarios intermodal'),
    ('TS03', 'Tren unitario de carros ferroviarios'),
    ('TS04', 'Tren unitario Intermodal');

ALTER TABLE public.sat_tipo_servicio_ferroviario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_servicio_ferroviario_select" ON public.sat_tipo_servicio_ferroviario
    FOR SELECT TO anon, authenticated USING (true);
