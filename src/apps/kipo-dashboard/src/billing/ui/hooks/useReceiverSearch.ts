"use client"

import { useCallback, useMemo, useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

type CustomerRaw = {
  id: string
  tax_id: string
  legal_name: string
  zip: string
  tax_regime: string
  is_active: boolean
}

export type ReceiverSuggestion = {
  id: string
  taxId: string
  name: string
  zip: string
  taxRegime?: string
}

export function useReceiverSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [receivers, setReceivers] = useState<ReceiverSuggestion[]>([])

  const loadReceivers = useCallback(async () => {
    try {
      const token = useAuthStore.getState().accessToken
      const res = await fetch(`${API_BASE_URL}/api/v1/customers?limit=50&offset=0`, {
        headers: { Authorization: `Bearer ${token ?? ""}` },
      })
      if (!res.ok) return
      const raw = (await res.json()) as CustomerRaw[]
      setReceivers(
        raw
          .filter((c) => c.is_active)
          .map((c) => ({
            id: c.id,
            taxId: c.tax_id,
            name: c.legal_name,
            zip: c.zip,
            taxRegime: c.tax_regime,
          }))
      )
    } catch {
      // keep empty on failure
    }
  }, [])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return receivers
      .filter((r) => r.taxId.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
      .slice(0, 5)
  }, [query, receivers])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReceivers()
  }, [loadReceivers])

  const clear = () => {
    setQuery("")
    setIsOpen(false)
  }

  return { query, setQuery, isOpen, setIsOpen, suggestions, clear }
}
