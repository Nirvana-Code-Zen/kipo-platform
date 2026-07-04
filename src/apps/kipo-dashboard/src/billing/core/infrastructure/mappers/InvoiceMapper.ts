import type { Invoice, StampData } from '../../domain/entities/Invoice'
import type { InvoiceConcept, Transfer, Retention } from '../../domain/entities/InvoiceConcept'

export type RawInvoice = {
  id: string
  status: string
  series?: string
  invoice_number?: string
  issued_at: string
  currency: string
  exchange_rate?: number
  voucher_type: string
  payment_method: string
  payment_form: string
  issuer_zip_code: string
  export_type: string
  receiver_id: string
  items: RawItem[]
  subtotal: number
  total_transferred_taxes: number
  total_withheld_taxes: number
  total: number
  stamp?: RawStamp
  created_at: string
  updated_at: string
}

type RawTax = {
  base: number
  tax: string
  factor_type: string
  rate: number
  amount: number
}

type RawItem = {
  id: string
  product_service_code: string
  quantity: number
  unit_code: string
  description: string
  unit_price: number
  amount: number
  tax_object: string
  transfers: RawTax[]
  retentions: RawTax[]
}

type RawStamp = {
  uuid: string
  stamp_date: string
  sat_certificate_number: string
  cfd_seal: string
  sat_seal: string
}

const mapTax = (r: RawTax): Transfer => ({
  base: r.base,
  tax: r.tax,
  factorType: r.factor_type,
  rate: r.rate,
  amount: r.amount,
})

const mapItem = (r: RawItem): InvoiceConcept => ({
  id: r.id,
  productServiceCode: r.product_service_code,
  quantity: r.quantity,
  unitCode: r.unit_code,
  description: r.description,
  unitPrice: r.unit_price,
  amount: r.amount,
  taxObject: r.tax_object,
  transfers: r.transfers.map(mapTax),
  retentions: r.retentions.map(mapTax) as Retention[],
})

const mapStamp = (r: RawStamp): StampData => ({
  uuid: r.uuid,
  stampDate: new Date(r.stamp_date),
  satCertificateNumber: r.sat_certificate_number,
  cfdSeal: r.cfd_seal,
  satSeal: r.sat_seal,
})

export const InvoiceMapper = {
  toDomain: (raw: RawInvoice): Invoice => ({
    id: raw.id as never,
    status: raw.status as never,
    series: raw.series,
    invoiceNumber: raw.invoice_number,
    issuedAt: new Date(raw.issued_at),
    currency: raw.currency,
    exchangeRate: raw.exchange_rate,
    voucherType: raw.voucher_type,
    paymentMethod: raw.payment_method,
    paymentForm: raw.payment_form,
    issuerZipCode: raw.issuer_zip_code,
    exportType: raw.export_type,
    receiverId: raw.receiver_id as never,
    items: raw.items.map(mapItem),
    subtotal: raw.subtotal,
    totalTransferredTaxes: raw.total_transferred_taxes,
    totalWithheldTaxes: raw.total_withheld_taxes,
    total: raw.total,
    stamp: raw.stamp ? mapStamp(raw.stamp) : undefined,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  }),

  toPersistence: (invoice: Invoice): RawInvoice => ({
    id: invoice.id,
    status: invoice.status,
    series: invoice.series,
    invoice_number: invoice.invoiceNumber,
    issued_at: invoice.issuedAt.toISOString(),
    currency: invoice.currency,
    exchange_rate: invoice.exchangeRate,
    voucher_type: invoice.voucherType,
    payment_method: invoice.paymentMethod,
    payment_form: invoice.paymentForm,
    issuer_zip_code: invoice.issuerZipCode,
    export_type: invoice.exportType,
    receiver_id: invoice.receiverId,
    items: invoice.items.map((c) => ({
      id: c.id,
      product_service_code: c.productServiceCode,
      quantity: c.quantity,
      unit_code: c.unitCode,
      description: c.description,
      unit_price: c.unitPrice,
      amount: c.amount,
      tax_object: c.taxObject,
      transfers: c.transfers.map((t) => ({
        base: t.base, tax: t.tax, factor_type: t.factorType, rate: t.rate, amount: t.amount,
      })),
      retentions: c.retentions.map((r) => ({
        base: r.base, tax: r.tax, factor_type: r.factorType, rate: r.rate, amount: r.amount,
      })),
    })),
    subtotal: invoice.subtotal,
    total_transferred_taxes: invoice.totalTransferredTaxes,
    total_withheld_taxes: invoice.totalWithheldTaxes,
    total: invoice.total,
    stamp: invoice.stamp
      ? {
          uuid: invoice.stamp.uuid,
          stamp_date: invoice.stamp.stampDate.toISOString(),
          sat_certificate_number: invoice.stamp.satCertificateNumber,
          cfd_seal: invoice.stamp.cfdSeal,
          sat_seal: invoice.stamp.satSeal,
        }
      : undefined,
    created_at: invoice.createdAt.toISOString(),
    updated_at: invoice.updatedAt.toISOString(),
  }),
}
