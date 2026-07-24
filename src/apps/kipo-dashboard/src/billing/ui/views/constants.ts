import type { StatusFilter } from '../hooks/useInvoiceFilters'

export const VALID_STATUSES: StatusFilter[] = ["all", "stamped", "draft", "cancelled"]
