import { err } from '@/src/shared/domain/result'

import { isStampPackId } from '../../domain/value-objects/StampPackId'
import { stampPackError } from '../../domain/exceptions/stampPack.errors'

import type { Result } from '@/src/shared/domain/result'
import type { IStampPackRepository, StampPackPurchase } from '../../domain/repositories/IStampPackRepository'
import type { BuyStampPackDTO } from '../dtos/BuyStampPackDTO'
import type { StampPackError } from '../../domain/exceptions/stampPack.errors'

type Deps = { stampPackRepo: IStampPackRepository }

export const buyStampPackUseCase =
  (deps: Deps) =>
    async (dto: BuyStampPackDTO): Promise<Result<StampPackPurchase, StampPackError>> => {
      if (!isStampPackId(dto.packId)) {
        return err(stampPackError.notFound(dto.packId))
      }

      return deps.stampPackRepo.purchase(dto.packId)
    }
