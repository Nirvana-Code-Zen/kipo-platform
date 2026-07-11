"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

export function useDeleteCustomer(onDeleted: (customerId: string) => void) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isDeleting, setIsDeleting] = useState(false)

  async function remove(customerId: string): Promise<string | null> {
    setIsDeleting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/customers/${customerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken ?? ""}` },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        return body.error ?? `Error ${res.status}`
      }

      onDeleted(customerId)
      return null
    } catch (e) {
      return e instanceof Error ? e.message : "Error de red"
    } finally {
      setIsDeleting(false)
    }
  }

  return { remove, isDeleting }
}
