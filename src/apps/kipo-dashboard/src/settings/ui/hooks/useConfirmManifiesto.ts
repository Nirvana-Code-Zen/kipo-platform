"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { useEmisorStore } from "../store/emisorStore"
import { mapFromApi, type EmisorApiResponse } from "./useEmisorInit"

import type { UIFiscalSettings } from "../components/shared/types"

export function useConfirmManifiesto() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm(): Promise<UIFiscalSettings | null> {
    setIsConfirming(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/emisor/manifiesto/confirm`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken ?? ""}` },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        setError(body.error ?? `Error ${res.status}`)
        return null
      }
      const raw = (await res.json()) as EmisorApiResponse
      const result = mapFromApi(raw)
      useEmisorStore.getState().setData(result)
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de red")
      return null
    } finally {
      setIsConfirming(false)
    }
  }

  return { confirm, isConfirming, error }
}
