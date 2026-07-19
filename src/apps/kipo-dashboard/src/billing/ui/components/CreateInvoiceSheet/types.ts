import type { UIInvoice } from "../shared/types"

export interface CreateInvoiceSheetProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (invoice: UIInvoice) => void
}
