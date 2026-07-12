import { ok } from '@/src/shared/domain/result'

import { STAMP_PACKS } from '../../domain/entities/StampPack'

import type { IStampPackRepository } from '../../domain/repositories/IStampPackRepository'
import type { StampPackId } from '../../domain/value-objects/StampPackId'

// No purchase API exists yet — swap for a createHttpStampPackRepository once one does.
const MOCK_DELAY_MS = 1200

export const createMockStampPackRepository = (): IStampPackRepository => ({
  findAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
    return ok([...STAMP_PACKS])
  },

  purchase: async (packId: StampPackId) => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
    const pack = STAMP_PACKS.find((p) => p.id === packId)!
    return ok({ packId, purchasedQty: pack.qty, purchasedAt: new Date() })
  },
})
