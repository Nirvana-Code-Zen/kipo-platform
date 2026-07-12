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
  { id: 20, qty: 20, unitPrice: 3.5, label: 'Starter', featured: false },
  { id: 100, qty: 100, unitPrice: 3.5, label: 'Most popular', featured: true },
  { id: 500, qty: 500, unitPrice: 2.9, label: 'Best price', featured: false },
]
