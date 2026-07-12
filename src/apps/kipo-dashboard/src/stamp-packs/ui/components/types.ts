import type { StampPackId } from '../../core/domain/value-objects/StampPackId'

export interface UIStampPack {
  id: StampPackId
  qty: number
  unitPrice: number
  label: string
  featured: boolean
}
