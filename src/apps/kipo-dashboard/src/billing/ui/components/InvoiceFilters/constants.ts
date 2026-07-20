import type { StatusFilter } from "../../hooks/useInvoiceFilters"

export const STATUS_PILLS: { value: StatusFilter; label: string }[] = [
  { value: "all",       label: "Todas" },
  { value: "stamped",   label: "Timbradas" },
  { value: "draft",     label: "Borradores" },
  { value: "cancelled", label: "Canceladas" },
]
