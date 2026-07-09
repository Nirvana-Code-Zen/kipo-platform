export const TAX_REGIMES = [
  { code: "605", label: "Sueldos y Salarios" },
  { code: "606", label: "Arrendamiento" },
  { code: "612", label: "Actividades Empresariales y Profesionales" },
  { code: "621", label: "Incorporación Fiscal" },
  { code: "625", label: "Plataformas Tecnológicas" },
  { code: "626", label: "Régimen Simplificado de Confianza" },
  { code: "601", label: "General de Ley Personas Morales" },
  { code: "603", label: "Personas Morales sin Fines de Lucro" },
  { code: "616", label: "Sin Obligaciones Fiscales" },
] as const

export const REGIMEN_FISCAL_LABELS: Record<string, string> = {
  "605": "Sueldos y Salarios",
  "606": "Arrendamiento",
  "612": "Actividades Empresariales y Profesionales",
  "621": "Incorporación Fiscal",
  "625": "Plataformas Tecnológicas",
  "626": "Régimen Simplificado de Confianza",
  "601": "General de Ley Personas Morales",
  "603": "Personas Morales sin Fines de Lucro",
  "616": "Sin Obligaciones Fiscales",
}
