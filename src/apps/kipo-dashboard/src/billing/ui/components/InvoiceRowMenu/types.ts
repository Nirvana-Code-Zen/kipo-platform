import type { InvoiceStatus } from "../shared/types"

export interface InvoiceRowMenuProps {
  isOpen: boolean
  onClose: () => void
  status: InvoiceStatus
  onViewDetails: () => void
  onCancel: () => void
  onDelete: () => void
}

export interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  tone?: "warning" | "danger"
}
