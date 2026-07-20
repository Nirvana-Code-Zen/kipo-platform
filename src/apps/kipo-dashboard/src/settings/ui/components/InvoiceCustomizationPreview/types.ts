import type { UIInvoiceDisplayOptions } from "../shared/types"

export interface InvoiceCustomizationPreviewProps {
  customSectionHtml: string
  displayOptions: UIInvoiceDisplayOptions
  logoUrl?: string | null
}

export interface MockLineItem {
  productKey: string
  description: string
  unitKey: string
  unitLabel: string
  quantity: number
  unitPrice: number
  iva: number
  ieps: number
}
