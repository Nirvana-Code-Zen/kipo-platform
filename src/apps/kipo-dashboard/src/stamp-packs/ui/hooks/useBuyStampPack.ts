"use client"

import { useState } from "react"

import { isErr } from "@/src/shared/domain/result"

import { createMockStampPackRepository } from "../../core/infrastructure/repositories/MockStampPackRepository"
import { buyStampPackUseCase } from "../../core/application/use-cases/buyStampPackUseCase"

import type { StampPackId } from "../../core/domain/value-objects/StampPackId"
import type { StampPackError } from "../../core/domain/exceptions/stampPack.errors"

const stampPackRepo = createMockStampPackRepository()

export function useBuyStampPack(onPurchased: (purchasedQty: number) => void) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<StampPackError | null>(null)

  async function buy(packId: StampPackId): Promise<boolean> {
    setIsPurchasing(true)
    setError(null)
    const result = await buyStampPackUseCase({ stampPackRepo })({ packId })
    setIsPurchasing(false)
    if (isErr(result)) {
      setError(result.error)
      return false
    }
    onPurchased(result.value.purchasedQty)
    return true
  }

  return { buy, isPurchasing, error }
}
