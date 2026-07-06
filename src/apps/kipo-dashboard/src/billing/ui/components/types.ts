export type InvoiceStatus = 'draft' | 'stamped' | 'cancelled'

export type VoucherType = 'I' | 'E' | 'T' | 'N' | 'P'

export interface UIInvoice {
  id: string
  folio: string
  status: InvoiceStatus
  issuedAt: string     // display: "01 jul 2026"
  issuedAtISO: string  // filter/sort: "2026-07-01"
  receiverName: string
  receiverTaxId: string
  total: number
  currency: string
  voucherType: VoucherType
  paymentMethod: string
}
