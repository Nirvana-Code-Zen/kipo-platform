export type RfcType = "natural" | "legal" | "general" | "foreign" | "invalid" | "empty"

export const RFC_TYPE_LABEL: Record<RfcType, string | null> = {
  natural: "Persona Física",
  legal:   "Persona Moral",
  general: "Público General",
  foreign: "Extranjero",
  invalid: "RFC inválido",
  empty:   null,
}

const RFC_GENERAL = "XAXX010101000"
const RFC_FOREIGN = "XEXX010101000"
const RFC_LEGAL_RE   = /^[A-ZÑ&]{3}\d{6}[A-Z\d]{3}$/
const RFC_NATURAL_RE = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/

export function detectRfcType(rfc: string): RfcType {
  const v = rfc.trim().toUpperCase()
  if (!v) return "empty"
  if (v === RFC_GENERAL) return "general"
  if (v === RFC_FOREIGN) return "foreign"
  if (v.length === 12 && RFC_LEGAL_RE.test(v))   return "legal"
  if (v.length === 13 && RFC_NATURAL_RE.test(v))  return "natural"
  if (v.length < 12) return "empty"
  return "invalid"
}
