import type { StatusFilter } from "../../hooks/useInvoiceFilters"

export interface InvoiceFiltersProps {
  statusFilter: StatusFilter
  onStatusChange: (s: StatusFilter) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  searchQuery: string
  onSearchQueryChange: (v: string) => void
  activeFilterCount: number
  onClearAll: () => void
  totalCount: number
  filteredCount: number
}
