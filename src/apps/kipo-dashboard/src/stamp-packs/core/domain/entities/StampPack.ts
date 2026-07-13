import type { StampPackId } from '../value-objects/StampPackId'

export type StampPack = Readonly<{
  id: StampPackId
  qty: number
  unitPrice: number
  label: string
  featured: boolean
}>

export const totalPrice = (pack: StampPack): number => pack.qty * pack.unitPrice

export const STAMP_PACKS: readonly StampPack[] = [
  { id: 25, qty: 25, unitPrice: 3.16, label: '', featured: false },
  { id: 100, qty: 100, unitPrice: 2.49, label: 'Mas Popular', featured: true },
  { id: 200, qty: 200, unitPrice: 2.25, label: 'Mejor Precio', featured: false },
]
