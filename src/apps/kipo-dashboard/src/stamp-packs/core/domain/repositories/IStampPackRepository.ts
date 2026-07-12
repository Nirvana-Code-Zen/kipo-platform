import type { Result } from '@/src/shared/domain/result'
import type { StampPack } from '../entities/StampPack'
import type { StampPackId } from '../value-objects/StampPackId'
import type { StampPackError } from '../exceptions/stampPack.errors'

export type StampPackPurchase = Readonly<{
  packId: StampPackId
  purchasedQty: number
  purchasedAt: Date
}>

export type IStampPackRepository = {
  findAll: () => Promise<Result<StampPack[], StampPackError>>
  purchase: (packId: StampPackId) => Promise<Result<StampPackPurchase, StampPackError>>
}
