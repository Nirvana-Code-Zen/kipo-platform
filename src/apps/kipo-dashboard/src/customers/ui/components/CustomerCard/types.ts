import type { Customer } from "../shared/types"

export interface CustomerCardProps {
  customer: Customer
  index: number
  onToggleStatus: () => void
  onDelete: (customer: Customer) => void
  onViewDetails: (customer: Customer) => void
  onEdit: (customer: Customer) => void
}
