export type ConceptItemDTO = {
  productServiceCode: string
  quantity: number
  unitCode: string
  description: string
  unitPrice: number
  taxObject: string
  transfers?: Array<{ tax: string; factorType: string; rate: number }>
  retentions?: Array<{ tax: string; factorType: string; rate: number }>
}

export type CreateInvoiceDTO = {
  series?: string
  currency: string
  exchangeRate?: number
  voucherType: string
  paymentMethod: string
  paymentForm: string
  issuerZipCode: string
  exportType: string
  receiverId: string
  items: ConceptItemDTO[]
}
