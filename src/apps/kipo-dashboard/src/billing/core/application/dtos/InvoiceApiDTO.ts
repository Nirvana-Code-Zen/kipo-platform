import type { UIInvoice } from "../../../ui/components/types"

export type InvoiceConceptApiPayload = {
  product_service_code: string
  unit_code: string
  description: string
  quantity: number
  unit_price: number
  tax_object: string
  iva_rate: number | null
}

export type ReceiverPayload = {
  tax_id: string
  name: string
  zip: string
}

export type CreateInvoiceApiRequest = {
  voucher_type: string
  series?: string | null
  payment_method: string
  payment_form: string
  currency: string
  export_type: string
  issuer_zip: string
  customer_id: string | null
  receiver: ReceiverPayload
  concepts: InvoiceConceptApiPayload[]
}

export type InvoiceConceptApiResponse = {
  id: string
  product_service_code: string
  unit_code: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  tax_object: string
  iva_rate: number | null
  iva_amount: number
}

export type InvoiceApiResponse = {
  id: string
  folio: string
  voucher_type: string
  payment_method: string
  payment_form: string
  currency: string
  series: string | null
  status: string
  customer_id: string | null
  receiver: ReceiverPayload
  subtotal: number
  iva: number
  total: number
  created_at: string
  concepts: InvoiceConceptApiResponse[]
}

export function fromApiResponse(raw: InvoiceApiResponse): UIInvoice {
  const date = new Date(raw.created_at)
  const issuedAt = date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
  return {
    id: raw.id,
    folio: raw.folio,
    status: raw.status as UIInvoice["status"],
    issuedAt,
    issuedAtISO: raw.created_at.slice(0, 10),
    receiverName: raw.receiver.name,
    receiverTaxId: raw.receiver.tax_id,
    subtotal: raw.subtotal,
    iva: raw.iva,
    total: raw.total,
    currency: raw.currency,
    voucherType: raw.voucher_type as UIInvoice["voucherType"],
    paymentMethod: raw.payment_method,
    paymentForm: raw.payment_form,
    concepts: (raw.concepts ?? []).map((c) => ({
      productServiceCode: c.product_service_code,
      unitCode: c.unit_code,
      description: c.description,
      quantity: c.quantity,
      unitPrice: c.unit_price,
      amount: c.amount,
      taxObject: c.tax_object,
      ivaRate: c.iva_rate,
      ivaAmount: c.iva_amount,
    })),
  }
}
