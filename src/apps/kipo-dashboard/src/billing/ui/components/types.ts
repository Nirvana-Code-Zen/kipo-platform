export type InvoiceStatus = 'draft' | 'stamped' | 'cancelled'

export type VoucherType = 'I' | 'E' | 'T' | 'N' | 'P'

export interface UIInvoice {
  id: string
  folio: string
  status: InvoiceStatus
  issuedAt: string
  receiverName: string
  receiverTaxId: string
  total: number
  currency: string
  voucherType: VoucherType
  paymentMethod: string
}
