import { generateInvoiceId } from '../value-objects/InvoiceId'
import { calcSubtotal, calcTotal } from '../value-objects/Money'
import { conceptTotalTransferred, conceptTotalRetained } from './InvoiceConcept'

import type { InvoiceId } from '../value-objects/InvoiceId'
import type { ReceiverId } from '../value-objects/ReceiverId'
import type { InvoiceConcept } from './InvoiceConcept'

export type InvoiceStatus = 'draft' | 'stamped' | 'cancelled'

// Stamp data received from backend after PAC processing
export type StampData = Readonly<{
  uuid: string
  stampDate: Date
  satCertificateNumber: string
  cfdSeal: string
  satSeal: string
}>

// Catalog fields are plain strings — backend owns the valid values
export type Invoice = Readonly<{
  id: InvoiceId
  status: InvoiceStatus

  series?: string
  invoiceNumber?: string
  issuedAt: Date
  currency: string
  exchangeRate?: number
  voucherType: string
  paymentMethod: string
  paymentForm: string
  issuerZipCode: string
  exportType: string

  receiverId: ReceiverId

  items: readonly InvoiceConcept[]

  subtotal: number
  totalTransferredTaxes: number
  totalWithheldTaxes: number
  total: number

  stamp?: StampData

  createdAt: Date
  updatedAt: Date
}>

export type InvoiceInput = {
  series?: string
  issuedAt: Date
  currency: string
  exchangeRate?: number
  voucherType: string
  paymentMethod: string
  paymentForm: string
  issuerZipCode: string
  exportType: string
  receiverId: ReceiverId
  items: readonly InvoiceConcept[]
}

// Factory — calculates totals for local preview before sending to backend
export const createInvoice = (input: InvoiceInput): Invoice => {
  const subtotal = calcSubtotal(input.items.map((c) => c.amount))
  const totalTransferredTaxes = calcSubtotal(input.items.map(conceptTotalTransferred))
  const totalWithheldTaxes = calcSubtotal(input.items.map(conceptTotalRetained))
  const total = calcTotal(subtotal, totalTransferredTaxes, totalWithheldTaxes)

  return {
    id: generateInvoiceId(),
    status: 'draft',
    ...input,
    subtotal,
    totalTransferredTaxes,
    totalWithheldTaxes,
    total,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export const applyStamp = (invoice: Invoice, stamp: StampData): Invoice => ({
  ...invoice,
  status: 'stamped',
  stamp,
  updatedAt: new Date(),
})

export const cancelInvoice = (invoice: Invoice): Invoice => ({
  ...invoice,
  status: 'cancelled',
  updatedAt: new Date(),
})

export const isStamped = (
  invoice: Invoice
): invoice is Invoice & { stamp: StampData } =>
  invoice.status === 'stamped' && invoice.stamp !== undefined

export const isCancellable = (invoice: Invoice): boolean =>
  invoice.status === 'stamped'
