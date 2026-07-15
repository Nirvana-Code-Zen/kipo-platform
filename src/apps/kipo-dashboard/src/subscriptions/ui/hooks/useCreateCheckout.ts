"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

export function useCreateCheckout() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(false)

  async function checkout(tier: string): Promise<boolean> {
    setIsCreating(true)
    setError(false)
    try {
      const accessToken = useAuthStore.getState().accessToken
      const res = await fetch(`${API_BASE_URL}/api/v1/subscriptions/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify({
          tier,
          success_url: `${window.location.origin}/settings?upgraded=true`,
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
      setIsCreating(false)
    }
  }

  return { checkout, isCreating, error }
}
