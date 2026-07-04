import { calcImporte, calcImpuesto, roundSat } from '../value-objects/Money'

export type Transfer = Readonly<{
  base: number
  tax: string       // '001' ISR | '002' IVA | '003' IEPS
  factorType: string // 'Tasa' | 'Cuota' | 'Exento'
  rate: number
  amount: number
}>

export type Retention = Readonly<{
  base: number
  tax: string
  factorType: string
  rate: number
  amount: number
}>

export type InvoiceConcept = Readonly<{
  id: string
  productServiceCode: string
  quantity: number
  unitCode: string
  description: string
  unitPrice: number
  amount: number
  taxObject: string
  transfers: readonly Transfer[]
  retentions: readonly Retention[]
}>

export type ConceptInput = {
  productServiceCode: string
  quantity: number
  unitCode: string
  description: string
  unitPrice: number
  taxObject: string
  transfers?: Array<{ tax: string; factorType: string; rate: number }>
  retentions?: Array<{ tax: string; factorType: string; rate: number }>
}

// Calculates amounts locally for form preview — backend recalculates before stamping
export const createInvoiceConcept = (input: ConceptInput): InvoiceConcept => {
  const amount = calcImporte(input.quantity, input.unitPrice)

  const transfers: Transfer[] = (input.transfers ?? []).map((t) => ({
    base: amount,
    tax: t.tax,
    factorType: t.factorType,
    rate: roundSat(t.rate),
    amount: t.factorType === 'Exento' ? 0 : calcImpuesto(amount, t.rate),
  }))

  const retentions: Retention[] = (input.retentions ?? []).map((r) => ({
    base: amount,
    tax: r.tax,
    factorType: r.factorType,
    rate: roundSat(r.rate),
    amount: calcImpuesto(amount, r.rate),
  }))

  return {
    id: crypto.randomUUID(),
    productServiceCode: input.productServiceCode,
    quantity: input.quantity,
    unitCode: input.unitCode,
    description: input.description,
    unitPrice: roundSat(input.unitPrice),
    amount,
    taxObject: input.taxObject,
    transfers,
    retentions,
  }
}

export const conceptTotalTransferred = (c: InvoiceConcept): number =>
  c.transfers.reduce((acc, t) => acc + t.amount, 0)

export const conceptTotalRetained = (c: InvoiceConcept): number =>
  c.retentions.reduce((acc, r) => acc + r.amount, 0)
