"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import type { StampPackId } from "../../core/domain/value-objects/StampPackId"

export function useBuyStampPack() {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState(false)

  async function buy(packId: StampPackId): Promise<boolean> {
    setIsPurchasing(true)
    setError(false)
    try {
      const accessToken = useAuthStore.getState().accessToken
      const res = await fetch(`${API_BASE_URL}/api/v1/stamp-packs/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify({
          pack_id: String(packId),
          success_url: `${window.location.origin}/settings?stamps_purchased=true`,
          cancel_url: `${window.location.origin}/settings`,
        }),
      })
      if (!res.ok) {
        setError(true)
        return false
      }
      const data = (await res.json()) as { checkout_url: string }
      window.location.href = data.checkout_url
      return true
    } catch {
      setError(true)
      return false
    } finally {
      setIsPurchasing(false)
    }
  }

  return { buy, isPurchasing, error }
}
