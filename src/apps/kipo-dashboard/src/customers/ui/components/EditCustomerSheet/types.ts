import type { Customer } from "../shared/types"

export interface EditCustomerSheetProps {
  customer: Customer | null
  onClose: () => void
  onSave: (customerId: string, customer: Customer) => Promise<string | null>
}
