import type { UIInvoice, UIInvoiceConcept } from "../shared/types"
import type { UIInvoiceDisplayOptions } from "@/src/settings/ui/components/shared/types"

export interface InvoiceDetailSheetProps {
  invoice: UIInvoice | null
  onClose: () => void
}

export interface EmisorHeaderProps {
  razonSocial: string | undefined
  rfc: string | undefined
  regimenLabel: string
  logoUrl: string | null
  folio: string
  voucherTypeLabel: string
  issuedAt: string
  showExportKey: boolean
}

export interface ConceptsTableProps {
  concepts: UIInvoiceConcept[]
  displayOptions: UIInvoiceDisplayOptions
}
