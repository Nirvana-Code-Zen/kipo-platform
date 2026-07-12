-- Catálogos SAT (CFDI 4.0 / Nómina) como tablas de referencia en el schema public.
-- Solo lectura: se pueblan en esta migración y se consultan desde la app para
-- poblar selects/catálogos. Nombres de columna en inglés, contenido en español.

-- ============================================================
-- Forma de pago (c_FormaPago)
-- ============================================================
CREATE TABLE public.sat_forma_pago (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_forma_pago (code, description) VALUES
    ('01', 'Efectivo'),
    ('02', 'Cheque nominativo'),
    ('03', 'Transferencia electrónica de fondos'),
    ('04', 'Tarjeta de crédito'),
    ('05', 'Monedero electrónico'),
    ('06', 'Dinero electrónico'),
    ('08', 'Vales de despensa'),
    ('12', 'Dación en pago'),
    ('13', 'Pago por subrogación'),
    ('14', 'Pago por consignación'),
    ('15', 'Condonación'),
    ('17', 'Compensación'),
    ('23', 'Novación'),
    ('24', 'Confusión'),
    ('25', 'Remisión de deuda'),
    ('26', 'Prescripción o caducidad'),
    ('27', 'A satisfacción del acreedor'),
    ('28', 'Tarjeta de débito'),
    ('29', 'Tarjeta de servicios'),
    ('30', 'Aplicación de anticipos'),
    ('31', 'Intermediario pagos'),
    ('99', 'Por definir');

ALTER TABLE public.sat_forma_pago ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_forma_pago_select" ON public.sat_forma_pago
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Método de pago (c_MetodoPago)
-- ============================================================
CREATE TABLE public.sat_metodo_pago (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_metodo_pago (code, description) VALUES
    ('PUE', 'Pago en una sola exhibición (de contado).'),
    ('PPD', 'Pago en parcialidades o diferido (total o parcialmente a crédito). Requiere expedir un comprobante de pago cuando se reciba un pago subsecuente.');

ALTER TABLE public.sat_metodo_pago ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_metodo_pago_select" ON public.sat_metodo_pago
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Régimen Fiscal (c_RegimenFiscal)
-- ============================================================
CREATE TABLE public.sat_regimen_fiscal (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_regimen_fiscal (code, description) VALUES
    ('601', 'General de Ley Personas Morales'),
    ('603', 'Personas Morales con Fines no Lucrativos'),
    ('605', 'Sueldos y Salarios e Ingresos Asimilados a Salarios'),
    ('606', 'Arrendamiento'),
    ('608', 'Demás ingresos'),
    ('609', 'Consolidación'),
    ('610', 'Residentes en el Extranjero sin Establecimiento Permanente en México'),
    ('611', 'Ingresos por Dividendos (socios y accionistas)'),
    ('612', 'Personas Físicas con Actividades Empresariales y Profesionales'),
    ('614', 'Ingresos por intereses'),
    ('616', 'Sin obligaciones fiscales'),
    ('620', 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos'),
    ('621', 'Incorporación Fiscal'),
    ('622', 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'),
    ('623', 'Opcional para Grupos de Sociedades'),
    ('624', 'Coordinados'),
    ('628', 'Hidrocarburos'),
    ('607', 'Régimen de Enajenación o Adquisición de Bienes'),
    ('629', 'De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales'),
    ('630', 'Enajenación de acciones en bolsa de valores'),
    ('615', 'Régimen de los ingresos por obtención de premios'),
    ('625', 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas'),
    ('626', 'Régimen Simplificado de Confianza');

ALTER TABLE public.sat_regimen_fiscal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_regimen_fiscal_select" ON public.sat_regimen_fiscal
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Uso CFDI (c_UsoCFDI) + Régimen Fiscal aplicable (relación N:M)
-- ============================================================
CREATE TABLE public.sat_uso_cfdi (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_uso_cfdi (code, description) VALUES
    ('G01', 'Adquisición de mercancías.'),
    ('G02', 'Devoluciones, descuentos o bonificaciones.'),
    ('G03', 'Gastos en general.'),
    ('I01', 'Construcciones.'),
    ('I02', 'Mobiliario y equipo de oficina por inversiones.'),
    ('I03', 'Equipo de transporte.'),
    ('I04', 'Equipo de computo y accesorios.'),
    ('I05', 'Dados, troqueles, moldes, matrices y herramental.'),
    ('I06', 'Comunicaciones telefónicas.'),
    ('I07', 'Comunicaciones satelitales.'),
    ('I08', 'Otra maquinaria y equipo.'),
    ('D01', 'Honorarios médicos, dentales y gastos hospitalarios.'),
    ('D02', 'Gastos médicos por incapacidad o discapacidad.'),
    ('D03', 'Gastos funerales.'),
    ('D04', 'Donativos.'),
    ('D05', 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).'),
    ('D06', 'Aportaciones voluntarias al SAR.'),
    ('D07', 'Primas por seguros de gastos médicos.'),
    ('D08', 'Gastos de transportación escolar obligatoria.'),
    ('D09', 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.'),
    ('D10', 'Pagos por servicios educativos (colegiaturas).'),
    ('S01', 'Sin efectos fiscales.'),
    ('CP01', 'Pagos'),
    ('CN01', 'Nómina');

CREATE TABLE public.sat_uso_cfdi_regimen_fiscal (
    uso_cfdi_code       TEXT NOT NULL REFERENCES public.sat_uso_cfdi(code) ON DELETE CASCADE,
    regimen_fiscal_code TEXT NOT NULL REFERENCES public.sat_regimen_fiscal(code) ON DELETE CASCADE,
    PRIMARY KEY (uso_cfdi_code, regimen_fiscal_code)
);

INSERT INTO public.sat_uso_cfdi_regimen_fiscal (uso_cfdi_code, regimen_fiscal_code) VALUES
    ('G01', '601'), ('G01', '603'), ('G01', '606'), ('G01', '612'), ('G01', '620'), ('G01', '621'), ('G01', '622'), ('G01', '623'), ('G01', '624'), ('G01', '625'), ('G01', '626'),
    ('G02', '601'), ('G02', '603'), ('G02', '606'), ('G02', '612'), ('G02', '620'), ('G02', '621'), ('G02', '622'), ('G02', '623'), ('G02', '624'), ('G02', '625'), ('G02', '626'),
    ('G03', '601'), ('G03', '603'), ('G03', '606'), ('G03', '612'), ('G03', '620'), ('G03', '621'), ('G03', '622'), ('G03', '623'), ('G03', '624'), ('G03', '625'), ('G03', '626'),
    ('I01', '601'), ('I01', '603'), ('I01', '606'), ('I01', '612'), ('I01', '620'), ('I01', '621'), ('I01', '622'), ('I01', '623'), ('I01', '624'), ('I01', '625'), ('I01', '626'),
    ('I02', '601'), ('I02', '603'), ('I02', '606'), ('I02', '612'), ('I02', '620'), ('I02', '621'), ('I02', '622'), ('I02', '623'), ('I02', '624'), ('I02', '625'), ('I02', '626'),
    ('I03', '601'), ('I03', '603'), ('I03', '606'), ('I03', '612'), ('I03', '620'), ('I03', '621'), ('I03', '622'), ('I03', '623'), ('I03', '624'), ('I03', '625'), ('I03', '626'),
    ('I04', '601'), ('I04', '603'), ('I04', '606'), ('I04', '612'), ('I04', '620'), ('I04', '621'), ('I04', '622'), ('I04', '623'), ('I04', '624'), ('I04', '625'), ('I04', '626'),
    ('I05', '601'), ('I05', '603'), ('I05', '606'), ('I05', '612'), ('I05', '620'), ('I05', '621'), ('I05', '622'), ('I05', '623'), ('I05', '624'), ('I05', '625'), ('I05', '626'),
    ('I06', '601'), ('I06', '603'), ('I06', '606'), ('I06', '612'), ('I06', '620'), ('I06', '621'), ('I06', '622'), ('I06', '623'), ('I06', '624'), ('I06', '625'), ('I06', '626'),
    ('I07', '601'), ('I07', '603'), ('I07', '606'), ('I07', '612'), ('I07', '620'), ('I07', '621'), ('I07', '622'), ('I07', '623'), ('I07', '624'), ('I07', '625'), ('I07', '626'),
    ('I08', '601'), ('I08', '603'), ('I08', '606'), ('I08', '612'), ('I08', '620'), ('I08', '621'), ('I08', '622'), ('I08', '623'), ('I08', '624'), ('I08', '625'), ('I08', '626'),
    ('D01', '605'), ('D01', '606'), ('D01', '608'), ('D01', '611'), ('D01', '612'), ('D01', '614'), ('D01', '607'), ('D01', '615'), ('D01', '625'),
    ('D02', '605'), ('D02', '606'), ('D02', '608'), ('D02', '611'), ('D02', '612'), ('D02', '614'), ('D02', '607'), ('D02', '615'), ('D02', '625'),
    ('D03', '605'), ('D03', '606'), ('D03', '608'), ('D03', '611'), ('D03', '612'), ('D03', '614'), ('D03', '607'), ('D03', '615'), ('D03', '625'),
    ('D04', '605'), ('D04', '606'), ('D04', '608'), ('D04', '611'), ('D04', '612'), ('D04', '614'), ('D04', '607'), ('D04', '615'), ('D04', '625'),
    ('D05', '605'), ('D05', '606'), ('D05', '608'), ('D05', '611'), ('D05', '612'), ('D05', '614'), ('D05', '607'), ('D05', '615'), ('D05', '625'),
    ('D06', '605'), ('D06', '606'), ('D06', '608'), ('D06', '611'), ('D06', '612'), ('D06', '614'), ('D06', '607'), ('D06', '615'), ('D06', '625'),
    ('D07', '605'), ('D07', '606'), ('D07', '608'), ('D07', '611'), ('D07', '612'), ('D07', '614'), ('D07', '607'), ('D07', '615'), ('D07', '625'),
    ('D08', '605'), ('D08', '606'), ('D08', '608'), ('D08', '611'), ('D08', '612'), ('D08', '614'), ('D08', '607'), ('D08', '615'), ('D08', '625'),
    ('D09', '605'), ('D09', '606'), ('D09', '608'), ('D09', '611'), ('D09', '612'), ('D09', '614'), ('D09', '607'), ('D09', '615'), ('D09', '625'),
    ('D10', '605'), ('D10', '606'), ('D10', '608'), ('D10', '611'), ('D10', '612'), ('D10', '614'), ('D10', '607'), ('D10', '615'), ('D10', '625'),
    ('S01', '601'), ('S01', '603'), ('S01', '605'), ('S01', '606'), ('S01', '608'), ('S01', '610'), ('S01', '611'), ('S01', '612'), ('S01', '614'), ('S01', '616'), ('S01', '620'), ('S01', '621'), ('S01', '622'), ('S01', '623'), ('S01', '624'), ('S01', '607'), ('S01', '615'), ('S01', '625'), ('S01', '626'),
    ('CP01', '601'), ('CP01', '603'), ('CP01', '605'), ('CP01', '606'), ('CP01', '608'), ('CP01', '610'), ('CP01', '611'), ('CP01', '612'), ('CP01', '614'), ('CP01', '616'), ('CP01', '620'), ('CP01', '621'), ('CP01', '622'), ('CP01', '623'), ('CP01', '624'), ('CP01', '607'), ('CP01', '615'), ('CP01', '625'), ('CP01', '626'),
    ('CN01', '605');

ALTER TABLE public.sat_uso_cfdi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_uso_cfdi_select" ON public.sat_uso_cfdi
    FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.sat_uso_cfdi_regimen_fiscal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_uso_cfdi_regimen_fiscal_select" ON public.sat_uso_cfdi_regimen_fiscal
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Catálogos Hidrocarburos Petrolíferos
-- ============================================================
CREATE TABLE public.sat_permiso_hidrocarburos (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_permiso_hidrocarburos (code, description) VALUES
    ('PER01', 'Expendio en estaciones de servicio de petrolíferos'),
    ('PER02', 'Comercialización'),
    ('PER03', 'Distribución por otros medios distintos a ducto'),
    ('PER04', 'Expendio en estaciones de servicio multimodal de petrolíferos'),
    ('PER05', 'Expendio en estaciones de servicio de petrolíferos'),
    ('PER06', 'Comercialización'),
    ('PER07', 'Distribución por otros medios distintos a ducto'),
    ('PER08', 'Expendio en estaciones de servicio multimodal de petrolíferos'),
    ('PER09', 'Comercialización'),
    ('PER10', 'Comercialización'),
    ('PER11', 'Comercialización');

ALTER TABLE public.sat_permiso_hidrocarburos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_permiso_hidrocarburos_select" ON public.sat_permiso_hidrocarburos
    FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.sat_clave_hyp (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_clave_hyp (code, description) VALUES
    ('15101514', 'Gasolina'),
    ('15101515', 'Diesel'),
    ('15101505', 'Combustibles para barco');

ALTER TABLE public.sat_clave_hyp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_clave_hyp_select" ON public.sat_clave_hyp
    FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.sat_subproducto_hyp (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_subproducto_hyp (code, description) VALUES
    ('SP16', 'Gasolina regular menor a 91 octanos'),
    ('SP17', 'Gasolina premium mayor o igual a 91 octanos'),
    ('SP18', 'Diésel automotriz'),
    ('SP19', 'Diésel marino'),
    ('SP22', 'IFO380'),
    ('SP23', 'Diésel industrial'),
    ('SP24', 'Diésel de Ultra Bajo Azufre (DUBA)'),
    ('SP25', 'Diésel agrícola'),
    ('SP48', 'Gasóleo doméstico');

ALTER TABLE public.sat_subproducto_hyp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_subproducto_hyp_select" ON public.sat_subproducto_hyp
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Relación entre facturas (c_TipoRelacion)
-- ============================================================
CREATE TABLE public.sat_relacion_facturas (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_relacion_facturas (code, description) VALUES
    ('01', 'Nota de crédito de los documentos relacionados'),
    ('02', 'Nota de débito de los documentos relacionados'),
    ('03', 'Devolución de mercancía sobre facturas o traslados previos'),
    ('04', 'Sustitución de los CFDI previos'),
    ('05', 'Traslados de mercancias facturados previamente'),
    ('06', 'Factura generada por los traslados previos'),
    ('07', 'CFDI por aplicación de anticipo'),
    ('08', 'Factura generada por pagos en parcialidades'),
    ('09', 'Factura generada por pagos diferidos');

ALTER TABLE public.sat_relacion_facturas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_relacion_facturas_select" ON public.sat_relacion_facturas
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Meses y bimestres
-- ============================================================
CREATE TABLE public.sat_mes (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_mes (code, description) VALUES
    ('01', 'Enero'),
    ('02', 'Febrero'),
    ('03', 'Marzo'),
    ('04', 'Abril'),
    ('05', 'Mayo'),
    ('06', 'Junio'),
    ('07', 'Julio'),
    ('08', 'Agosto'),
    ('09', 'Septiembre'),
    ('10', 'Octubre'),
    ('11', 'Noviembre'),
    ('12', 'Diciembre'),
    ('13', 'Enero-Febrero'),
    ('14', 'Marzo-Abril'),
    ('15', 'Mayo-Junio'),
    ('16', 'Julio-Agosto'),
    ('17', 'Septiembre-Octubre'),
    ('18', 'Noviembre-Diciembre');

ALTER TABLE public.sat_mes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_mes_select" ON public.sat_mes
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Contrato (nómina)
-- ============================================================
CREATE TABLE public.sat_tipo_contrato (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_contrato (code, description) VALUES
    ('01', 'Contrato de trabajo por tiempo indeterminado'),
    ('02', 'Contrato de trabajo para obra determinada'),
    ('03', 'Contrato de trabajo por tiempo determinado'),
    ('04', 'Contrato de trabajo por temporada'),
    ('05', 'Contrato de trabajo sujeto a prueba'),
    ('06', 'Contrato de trabajo con capacitación inicial'),
    ('07', 'Modalidad de contratación por pago de hora laborada'),
    ('08', 'Modalidad de trabajo por comisión laboral'),
    ('09', 'Modalidades de contratación donde no existe relación de trabajo'),
    ('10', 'Jubilación, pensión, retiro.'),
    ('99', 'Otro contrato');

ALTER TABLE public.sat_tipo_contrato ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_contrato_select" ON public.sat_tipo_contrato
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Jornada (nómina)
-- ============================================================
CREATE TABLE public.sat_tipo_jornada (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_jornada (code, description) VALUES
    ('01', 'Diurna'),
    ('02', 'Nocturna'),
    ('03', 'Mixta'),
    ('04', 'Por hora'),
    ('05', 'Reducida'),
    ('06', 'Continuada'),
    ('07', 'Partida'),
    ('08', 'Por turnos'),
    ('99', 'Otra Jornada');

ALTER TABLE public.sat_tipo_jornada ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_jornada_select" ON public.sat_tipo_jornada
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Régimen (nómina) — distinto de sat_regimen_fiscal
-- ============================================================
CREATE TABLE public.sat_tipo_regimen_nomina (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_regimen_nomina (code, description) VALUES
    ('02', 'Sueldos (Incluye ingresos señalados en la fracción I del artículo 94 de LISR)'),
    ('03', 'Jubilados'),
    ('04', 'Pensionados'),
    ('05', 'Asimilados Miembros Sociedades Cooperativas Produccion'),
    ('06', 'Asimilados Integrantes Sociedades Asociaciones Civiles'),
    ('07', 'Asimilados Miembros consejos'),
    ('08', 'Asimilados comisionistas'),
    ('09', 'Asimilados Honorarios'),
    ('10', 'Asimilados acciones'),
    ('11', 'Asimilados otros'),
    ('12', 'Jubilados o Pensionados'),
    ('13', 'Indemnización o Separación'),
    ('99', 'Otro Regimen');

ALTER TABLE public.sat_tipo_regimen_nomina ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_regimen_nomina_select" ON public.sat_tipo_regimen_nomina
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Riesgo del Puesto (nómina)
-- ============================================================
CREATE TABLE public.sat_riesgo_puesto (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_riesgo_puesto (code, description) VALUES
    ('1', 'Clase I'),
    ('2', 'Clase II'),
    ('3', 'Clase III'),
    ('4', 'Clase IV'),
    ('5', 'Clase V'),
    ('99', 'No aplica');

ALTER TABLE public.sat_riesgo_puesto ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_riesgo_puesto_select" ON public.sat_riesgo_puesto
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Periodicidad del Pago (nómina)
-- ============================================================
CREATE TABLE public.sat_periodicidad_pago (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_periodicidad_pago (code, description) VALUES
    ('01', 'Diario'),
    ('02', 'Semanal'),
    ('03', 'Catorcenal'),
    ('04', 'Quincenal'),
    ('05', 'Mensual'),
    ('06', 'Bimestral'),
    ('07', 'Unidad obra'),
    ('08', 'Comisión'),
    ('09', 'Precio alzado'),
    ('10', 'Decenal'),
    ('99', 'Otra Periodicidad');

ALTER TABLE public.sat_periodicidad_pago ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_periodicidad_pago_select" ON public.sat_periodicidad_pago
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Percepción (nómina)
-- ============================================================
CREATE TABLE public.sat_tipo_percepcion (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_percepcion (code, description) VALUES
    ('001', 'Sueldos, Salarios Rayas y Jornales'),
    ('002', 'Gratificación Anual (Aguinaldo)'),
    ('003', 'Participación de los Trabajadores en las Utilidades PTU'),
    ('004', 'Reembolso de Gastos Médicos Dentales y Hospitalarios'),
    ('005', 'Fondo de Ahorro'),
    ('006', 'Caja de ahorro'),
    ('009', 'Contribuciones a Cargo del Trabajador Pagadas por el Patrón'),
    ('010', 'Premios por puntualidad'),
    ('011', 'Prima de Seguro de vida'),
    ('012', 'Seguro de Gastos Médicos Mayores'),
    ('013', 'Cuotas Sindicales Pagadas por el Patrón'),
    ('014', 'Subsidios por incapacidad'),
    ('015', 'Becas para trabajadores y/o hijos'),
    ('019', 'Horas extra'),
    ('020', 'Prima dominical'),
    ('021', 'Prima vacacional'),
    ('022', 'Prima por antigüedad'),
    ('023', 'Pagos por separación'),
    ('024', 'Seguro de retiro'),
    ('025', 'Indemnizaciones'),
    ('026', 'Reembolso por funeral'),
    ('027', 'Cuotas de seguridad social pagadas por el patrón'),
    ('028', 'Comisiones'),
    ('029', 'Vales de despensa'),
    ('030', 'Vales de restaurante'),
    ('031', 'Vales de gasolina'),
    ('032', 'Vales de ropa'),
    ('033', 'Ayuda para renta'),
    ('034', 'Ayuda para artículos escolares'),
    ('035', 'Ayuda para anteojos'),
    ('036', 'Ayuda para transporte'),
    ('037', 'Ayuda para gastos de funeral'),
    ('038', 'Otros ingresos por salarios'),
    ('039', 'Jubilaciones, pensiones o haberes de retiro'),
    ('044', 'Jubilaciones, pensiones o haberes de retiro en parcialidades'),
    ('045', 'Ingresos en acciones o títulos valor que representan bienes'),
    ('046', 'Ingresos asimilados a salarios'),
    ('047', 'Alimentación diferentes a los establecidos en el Art 94 último párrafo LISR'),
    ('048', 'Habitación'),
    ('049', 'Premios por asistencia'),
    ('050', 'Viáticos'),
    ('051', 'Pagos por gratificaciones, primas, compensaciones, recompensas u otros en parcialidades'),
    ('052', 'Pagos por jubilación en parcialidades derivados de una resolución judicial'),
    ('053', 'Pagos por jubilación en una sola exhibición derivados de la ejecución de una resolución judicial');

ALTER TABLE public.sat_tipo_percepcion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_percepcion_select" ON public.sat_tipo_percepcion
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Horas (nómina)
-- ============================================================
CREATE TABLE public.sat_tipo_horas (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_horas (code, description) VALUES
    ('01', 'Dobles'),
    ('02', 'Triples'),
    ('03', 'Simples');

ALTER TABLE public.sat_tipo_horas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_horas_select" ON public.sat_tipo_horas
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Deducción (nómina)
-- ============================================================
CREATE TABLE public.sat_tipo_deduccion (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_deduccion (code, description) VALUES
    ('001', 'Seguridad social'),
    ('002', 'ISR'),
    ('003', 'Aportaciones a retiro, cesantía en edad avanzada y vejez.'),
    ('004', 'Otros'),
    ('005', 'Aportaciones a Fondo de vivienda'),
    ('006', 'Descuento por incapacidad'),
    ('007', 'Pensión alimenticia'),
    ('008', 'Renta'),
    ('009', 'Préstamos provenientes del Fondo Nacional de la Vivienda para los Trabajadores'),
    ('010', 'Pago por crédito de vivienda'),
    ('011', 'Pago de abonos INFONACOT'),
    ('012', 'Anticipo de salarios'),
    ('013', 'Pagos hechos con exceso al trabajador'),
    ('014', 'Errores'),
    ('015', 'Pérdidas'),
    ('016', 'Averías'),
    ('017', 'Adquisición de artículos producidos por la empresa o establecimiento'),
    ('018', 'Cuotas para la constitución y fomento de sociedades cooperativas y de cajas de ahorro'),
    ('019', 'Cuotas sindicales'),
    ('020', 'Ausencia (Ausentismo)'),
    ('021', 'Cuotas obrero patronales'),
    ('022', 'Impuestos Locales'),
    ('023', 'Aportaciones voluntarias'),
    ('024', 'Ajuste en Gratificación Anual (Aguinaldo) Exento'),
    ('025', 'Ajuste en Gratificación Anual (Aguinaldo) Gravado'),
    ('026', 'Ajuste en Participación de los Trabajadores en las Utilidades PTU Exento'),
    ('027', 'Ajuste en Participación de los Trabajadores en las Utilidades PTU Gravado'),
    ('028', 'Ajuste en Reembolso de Gastos Médicos Dentales y Hospitalarios Exento'),
    ('029', 'Ajuste en Fondo de ahorro Exento'),
    ('030', 'Ajuste en Caja de ahorro Exento'),
    ('031', 'Ajuste en Contribuciones a Cargo del Trabajador Pagadas por el Patrón Exento'),
    ('032', 'Ajuste en Premios por puntualidad Gravado'),
    ('033', 'Ajuste en Prima de Seguro de vida Exento'),
    ('034', 'Ajuste en Seguro de Gastos Médicos Mayores Exento'),
    ('035', 'Ajuste en Cuotas Sindicales Pagadas por el Patrón Exento'),
    ('036', 'Ajuste en Subsidios por incapacidad Exento'),
    ('037', 'Ajuste en Becas para trabajadores y/o hijos Exento'),
    ('038', 'Ajuste en Horas extra Exento'),
    ('039', 'Ajuste en Horas extra Gravado'),
    ('040', 'Ajuste en Prima dominical Exento'),
    ('041', 'Ajuste en Prima dominical Gravado'),
    ('042', 'Ajuste en Prima vacacional Exento'),
    ('043', 'Ajuste en Prima vacacional Gravado'),
    ('044', 'Ajuste en Prima por antigüedad Exento'),
    ('045', 'Ajuste en Prima por antigüedad Gravado'),
    ('046', 'Ajuste en Pagos por separación Exento'),
    ('047', 'Ajuste en Pagos por separación Gravado'),
    ('048', 'Ajuste en Seguro de retiro Exento'),
    ('049', 'Ajuste en Indemnizaciones Exento'),
    ('050', 'Ajuste en Indemnizaciones Gravado'),
    ('051', 'Ajuste en Reembolso por funeral Exento'),
    ('052', 'Ajuste en Cuotas de seguridad social pagadas por el patrón Exento'),
    ('053', 'Ajuste en Comisiones Gravado'),
    ('054', 'Ajuste en Vales de despensa Exento'),
    ('055', 'Ajuste en Vales de restaurante Exento'),
    ('056', 'Ajuste en Vales de gasolina Exento'),
    ('057', 'Ajuste en Vales de ropa Exento'),
    ('058', 'Ajuste en Ayuda para renta Exento'),
    ('059', 'Ajuste en Ayuda para artículos escolares Exento'),
    ('060', 'Ajuste en Ayuda para anteojos Exento'),
    ('061', 'Ajuste en Ayuda para transporte Exento'),
    ('062', 'Ajuste en Ayuda para gastos de funeral Exento'),
    ('063', 'Ajuste en Otros ingresos por salarios Exento'),
    ('064', 'Ajuste en Otros ingresos por salarios Gravado'),
    ('065', 'Ajuste en Jubilaciones, pensiones o haberes de retiro en una sola exhibición Exento'),
    ('066', 'Ajuste en Jubilaciones, pensiones o haberes de retiro en una sola exhibición Gravado'),
    ('067', 'Ajuste en Pagos por separación Acumulable'),
    ('068', 'Ajuste en Pagos por separación No acumulable'),
    ('069', 'Ajuste en Jubilaciones, pensiones o haberes de retiro en parcialidades Exento'),
    ('070', 'Ajuste en Jubilaciones, pensiones o haberes de retiro en parcialidades Gravado'),
    ('071', 'Ajuste en Subsidio para el empleo (efectivamente entregado al trabajador)'),
    ('072', 'Ajuste en Ingresos en acciones o títulos valor que representan bienes Exento'),
    ('073', 'Ajuste en Ingresos en acciones o títulos valor que representan bienes Gravado'),
    ('074', 'Ajuste en Alimentación Exento'),
    ('075', 'Ajuste en Alimentación Gravado'),
    ('076', 'Ajuste en Habitación Exento'),
    ('077', 'Ajuste en Habitación Gravado'),
    ('078', 'Ajuste en Premios por asistencia'),
    ('079', 'Ajuste en Pagos distintos a los listados'),
    ('080', 'Ajuste en Viáticos gravados'),
    ('081', 'Ajuste en Viáticos (entregados al trabajador)'),
    ('082', 'Ajuste en Fondo de ahorro Gravado'),
    ('083', 'Ajuste en Caja de ahorro Gravado'),
    ('084', 'Ajuste en Prima de Seguro de vida Gravado'),
    ('085', 'Ajuste en Seguro de Gastos Médicos Mayores Gravado'),
    ('086', 'Ajuste en Subsidios por incapacidad Gravado'),
    ('087', 'Ajuste en Becas para trabajadores y/o hijos Gravado'),
    ('088', 'Ajuste en Seguro de retiro Gravado'),
    ('089', 'Ajuste en Vales de despensa Gravado'),
    ('090', 'Ajuste en Vales de restaurante Gravado'),
    ('091', 'Ajuste en Vales de gasolina Gravado'),
    ('092', 'Ajuste en Vales de ropa Gravado'),
    ('093', 'Ajuste en Ayuda para renta Gravado'),
    ('094', 'Ajuste en Ayuda para artículos escolares Gravado'),
    ('095', 'Ajuste en Ayuda para anteojos Gravado'),
    ('096', 'Ajuste en Ayuda para transporte Gravado'),
    ('097', 'Ajuste en Ayuda para gastos de funeral Gravado'),
    ('098', 'Ajuste a ingresos asimilados a salarios gravados'),
    ('099', 'Ajuste a ingresos por sueldos y salarios gravados'),
    ('100', 'Ajuste en Viáticos exentos'),
    ('101', 'ISR Retenido de ejercicio anterior'),
    ('102', 'Ajuste a pagos por gratificaciones, primas, compensaciones, recompensas u otros'),
    ('103', 'Ajuste a pagos en parcialidades derivados de una resolución judicial gravados'),
    ('104', 'Ajuste a pagos en parcialidades derivados de una resolución judicial exentos'),
    ('105', 'Ajuste a pagos en una sola exhibición derivados de una resolución judicial gravados'),
    ('106', 'Ajuste a pagos en una sola exhibición derivados de una resolución judicial exentos'),
    ('107', 'Ajuste al Subsidio Causado');

ALTER TABLE public.sat_tipo_deduccion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_deduccion_select" ON public.sat_tipo_deduccion
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Otro Pago (nómina)
-- ============================================================
CREATE TABLE public.sat_tipo_otro_pago (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_otro_pago (code, description) VALUES
    ('001', 'Reintegro de ISR pagado en exceso.'),
    ('002', 'Subsidio para el empleo (efectivamente entregado al trabajador).'),
    ('003', 'Viáticos (entregados al trabajador).'),
    ('004', 'Aplicación de saldo a favor por compensación anual.'),
    ('005', 'Reintegro de ISR retenido en exceso de ejercicio anterior'),
    ('006', 'Alimentos en bienes (Servicios de comedor y comida).'),
    ('007', 'ISR ajustado por subsidio.'),
    ('008', 'Subsidio efectivamente entregado que no correspondía.'),
    ('009', 'Reembolso de descuentos efectuados para el crédito de vivienda.'),
    ('999', 'Pagos distintos a los listados.');

ALTER TABLE public.sat_tipo_otro_pago ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_otro_pago_select" ON public.sat_tipo_otro_pago
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Tipo de Incapacidad (nómina)
-- ============================================================
CREATE TABLE public.sat_tipo_incapacidad (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_tipo_incapacidad (code, description) VALUES
    ('01', 'Riesgo de trabajo.'),
    ('02', 'Enfermedad en general.'),
    ('03', 'Maternidad.'),
    ('04', 'Licencia por cuidados médicos de hijos diagnosticados con cáncer.');

ALTER TABLE public.sat_tipo_incapacidad ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_tipo_incapacidad_select" ON public.sat_tipo_incapacidad
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Clave de retención
-- ============================================================
CREATE TABLE public.sat_clave_retencion (
    code        TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.sat_clave_retencion (code, description) VALUES
    ('01', 'Servicios profesionales.'),
    ('02', 'Regalías por derechos de autor.'),
    ('03', 'Autotransporte terrestre de carga.'),
    ('04', 'Servicios prestados por comisionistas.'),
    ('05', 'Arrendamiento.'),
    ('06', 'Enajenación de acciones.'),
    ('07', 'Enajenación de bienes objeto de la LIEPS, a través de mediadores, agentes, representantes, corredores, consignatarios o distribuidores.'),
    ('08', 'Enajenación de bienes inmuebles consignada en escritura pública.'),
    ('09', 'Enajenación de otros bienes, no consignada en escritura pública.'),
    ('10', 'Adquisición de desperdicios industriales.'),
    ('11', 'Adquisición de bienes consignada en escritura pública.'),
    ('12', 'Adquisición de otros bienes, no consignada en escritura pública.'),
    ('13', 'Otros retiros de AFORE.'),
    ('14', 'Dividendos o utilidades distribuidas.'),
    ('15', 'Remanente distribuible.'),
    ('16', 'Intereses.'),
    ('17', 'Arrendamiento en fideicomiso.'),
    ('18', 'Pagos realizados a favor de residentes en el extranjero.'),
    ('19', 'Enajenación de acciones u operaciones en bolsa de valores.'),
    ('20', 'Obtención de premios.'),
    ('21', 'Fideicomisos que no realizan actividades empresariales.'),
    ('22', 'Planes personales de retiro.'),
    ('23', 'Intereses reales deducibles por créditos hipotecarios.'),
    ('24', 'Operaciones Financieras Derivadas de Capital.'),
    ('25', 'Otro tipo de retenciones.'),
    ('26', 'Servicios mediante Plataformas Tecnológicas');

ALTER TABLE public.sat_clave_retencion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_clave_retencion_select" ON public.sat_clave_retencion
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Validez de obligaciones (matriz Validez x IVA/Tasas)
-- ============================================================
CREATE TABLE public.sat_validez_obligaciones (
    validity_code       TEXT PRIMARY KEY,
    iva_exempt          BOOLEAN,
    rate_0              BOOLEAN,
    rate_8_border_north BOOLEAN,
    rate_8_border_south BOOLEAN,
    rate_16             BOOLEAN,
    notes               TEXT
);

INSERT INTO public.sat_validez_obligaciones (validity_code, iva_exempt, rate_0, rate_8_border_north, rate_8_border_south, rate_16, notes) VALUES
    ('0', NULL, NULL, NULL, NULL, NULL, 'El contribuyente no está autorizado para emitir facturas'),
    ('1', true, true, false, false, true, NULL),
    ('2', true, true, true, false, true, NULL),
    ('3', true, true, false, true, true, NULL),
    ('4', true, true, true, true, true, NULL);

ALTER TABLE public.sat_validez_obligaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_validez_obligaciones_select" ON public.sat_validez_obligaciones
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- Situación del contribuyente (EFOS)
-- ============================================================
CREATE TABLE public.sat_situacion_contribuyente (
    value       TEXT PRIMARY KEY,
    explanation TEXT NOT NULL
);

INSERT INTO public.sat_situacion_contribuyente (value, explanation) VALUES
    ('Previsto', 'Vía buzón tributario o notificaciones por estrados, el contribuyente recibe un oficio en el que se establece su situación y se le solicita que demuestre la materialidad de las operaciones facturadas.'),
    ('Presunto', 'El contribuyente notificado se considera presunto cuando, en su página web, la autoridad emite sus datos dentro de la relación de los EFOS, es decir, en las listas negras del SAT.'),
    ('Desvirtuado', 'En este caso, el contribuyente acusado de operaciones inexistentes ya aportó a la autoridad la documentación e información pertinente para desvirtuar los hechos que llevaron a notificarlo.'),
    ('Definitivo', 'En este caso, el EFO no atendió el llamado de la autoridad en el plazo de 15 días, a partir de la última notificación; o bien, no pudo desvirtuar los hechos imputados.'),
    ('Sentencia favorable', 'Los contribuyentes EFOS "definitivos" que se inconforman e interponen algún medio de defensa, el cual concluye a su favor, son clasificados en la lista de "sentencia favorable".'),
    ('EFOS de información suprimida', 'En esta categoría, se encuentran los EFOS "presuntos" y "definitivos" que presentaron algún medio de defensa (amparo, juicio de nulidad) y, por lo tanto, un juez ordenó suprimir sus datos de la lista, sin ser eliminados.');

ALTER TABLE public.sat_situacion_contribuyente ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sat_situacion_contribuyente_select" ON public.sat_situacion_contribuyente
    FOR SELECT TO anon, authenticated USING (true);
