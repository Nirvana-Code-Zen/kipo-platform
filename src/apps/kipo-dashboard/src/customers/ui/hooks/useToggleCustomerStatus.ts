"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export function useToggleCustomerStatus(onToggled: (id: string) => void) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isToggling, setIsToggling] = useState(false)

  async function toggle(customerId: string, currentStatus: "active" | "inactive"): Promise<string | null> {
    setIsToggling(true)
    try {
      const isActive = currentStatus === "active"
      const url = isActive
        ? `${API_BASE_URL}/api/v1/customers/${customerId}/deactivate`
        : `${API_BASE_URL}/api/v1/customers/${customerId}/activate`

      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken ?? ""}` },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        return body.error ?? `Error ${res.status}`
      }

      onToggled(customerId)
      return null
    } catch (e) {
      return e instanceof Error ? e.message : "Error de red"
    } finally {
      setIsToggling(false)
    }
  }

  return { toggle, isToggling }
}
