"use client"

import { useState } from "react"

import type { StampPackId } from "../../core/domain/value-objects/StampPackId"

export function useStampPackSelection(initial: StampPackId | null = null) {
  const [selectedPackId, setSelectedPackId] = useState<StampPackId | null>(initial)
  return { selectedPackId, setSelectedPackId }
}
