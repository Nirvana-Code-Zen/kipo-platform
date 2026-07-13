export const VOUCHER_TYPES = [
  { code: "I", label: "I - Ingreso" },
  { code: "E", label: "E - Egreso" },
  { code: "T", label: "T - Traslado" },
  { code: "N", label: "N - Nómina" },
  { code: "P", label: "P - Complemento de pago" },
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
