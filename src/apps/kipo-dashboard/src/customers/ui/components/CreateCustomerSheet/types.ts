import type { Customer } from "../shared/types"

export interface CreateCustomerSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (customer: Customer) => Promise<string | null>
}
