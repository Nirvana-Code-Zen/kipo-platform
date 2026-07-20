import type { CustomerStatus } from "../shared/types"

export interface CustomerCardMenuProps {
  isOpen: boolean
  onClose: () => void
  status: CustomerStatus
  onViewDetails: () => void
  onEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
}
