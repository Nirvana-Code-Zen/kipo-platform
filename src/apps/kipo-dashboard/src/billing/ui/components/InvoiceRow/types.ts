import type { UIInvoice } from "../shared/types"

export interface InvoiceRowProps {
  invoice: UIInvoice
  index: number
  onViewDetails: (invoice: UIInvoice) => void
  onCancel: (id: string) => void
  onDelete: (id: string) => void
}
