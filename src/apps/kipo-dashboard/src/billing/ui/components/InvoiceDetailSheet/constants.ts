import { UNIT_CODES } from "../../data/catalogs"

export const VOUCHER_TYPE_LABEL: Record<string, string> = {
  I: "Ingreso",
  E: "Egreso",
  T: "Traslado",
  N: "Nómina",
  P: "Complemento de pago",
}

export const STATUS_TONE = {
  draft: "neutral",
  stamped: "success",
  cancelled: "danger",
} as const

export const STATUS_LABEL = {
  draft: "Borrador",
  stamped: "Timbrada",
  cancelled: "Cancelada",
} as const

export const formatMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)

export function resolveUnitLabel(code: string): string {
  const entry = UNIT_CODES.find((u) => u.code === code)
  if (!entry) return code
  const parts = entry.label.split(" - ")
  return parts.length > 1 ? parts.slice(1).join(" - ") : entry.label
}
