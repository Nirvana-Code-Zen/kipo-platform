export const VOUCHER_TYPES = [
  { code: "I", label: "I - Ingreso" },
  { code: "E", label: "E - Egreso" },
  { code: "T", label: "T - Traslado" },
  { code: "N", label: "N - Nómina" },
  { code: "P", label: "P - Complemento de pago" },
] as const

export const PAYMENT_METHODS = [
  { code: "PUE", label: "PUE - Pago en una sola exhibición" },
  { code: "PPD", label: "PPD - Pago en parcialidades o diferido" },
] as const

export const PAYMENT_FORMS = [
  { code: "01", label: "01 - Efectivo" },
  { code: "02", label: "02 - Cheque nominativo" },
  { code: "03", label: "03 - Transferencia electrónica" },
  { code: "04", label: "04 - Tarjeta de crédito" },
  { code: "28", label: "28 - Tarjeta de débito" },
  { code: "99", label: "99 - Por definir" },
] as const

export const CURRENCIES = [
  { code: "MXN", label: "MXN - Peso Mexicano" },
  { code: "USD", label: "USD - Dólar Americano" },
  { code: "EUR", label: "EUR - Euro" },
] as const

export const EXPORT_TYPES = [
  { code: "01", label: "01 - No aplica" },
  { code: "02", label: "02 - Definitiva" },
  { code: "03", label: "03 - Temporal" },
  { code: "04", label: "04 - Retorno de bienes" },
] as const

export const UNIT_CODES = [
  { code: "E48", label: "E48 - Unidad de servicio" },
  { code: "H87", label: "H87 - Pieza" },
  { code: "ACT", label: "ACT - Actividad" },
  { code: "KGM", label: "KGM - Kilogramo" },
  { code: "MTR", label: "MTR - Metro" },
  { code: "SET", label: "SET - Conjunto" },
  { code: "XBX", label: "XBX - Caja" },
] as const

export const TAX_OBJECTS = [
  { code: "01", label: "01 - No objeto de impuesto" },
  { code: "02", label: "02 - Sí objeto de impuesto" },
  { code: "03", label: "03 - No obligado al desglose" },
] as const

export const IVA_RATES = [
  { code: "16", label: "IVA 16%" },
  { code: "8",  label: "IVA 8%" },
  { code: "0",  label: "IVA 0%" },
  { code: "exento", label: "Exento" },
] as const
