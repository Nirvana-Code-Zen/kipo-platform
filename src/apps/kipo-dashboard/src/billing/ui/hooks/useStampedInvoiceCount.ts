"use client"

import { useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

export function useStampedInvoiceCount() {
  const [stamped, setStamped] = useState<number | null>(null)
  const [draft, setDraft] = useState<number | null>(null)
  const [availableStamps, setAvailableStamps] = useState<number | null>(null)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    fetch(`${API_BASE_URL}/api/v1/invoices/stats`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setStamped(data.stamped as number)
          setDraft(data.draft as number)
          setAvailableStamps(data.available_stamps as number)
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [accessToken])

  function addAvailableStamps(qty: number) {
    setAvailableStamps((prev) => (prev ?? 0) + qty)
  }

  return { stamped, draft, availableStamps, addAvailableStamps }
}
