import type { Customer } from "../shared/types"

export interface CustomerDetailSheetProps {
  customer: Customer | null
  onClose: () => void
}

export interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: string
  extra?: React.ReactNode
}
