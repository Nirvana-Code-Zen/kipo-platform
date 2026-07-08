"use client"

import { useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { TAX_REGIMES } from "@/src/customers/ui/data/catalogs"

import type { Customer as UICustomer } from "@/src/customers/ui/components/types"

type CustomerRaw = {
  id: string; tax_id: string; legal_name: string; tax_regime: string
  zip: string; cfdi_use: string; email: string; is_active: boolean; avatar_url: string | null
}

function fromRaw(raw: CustomerRaw): UICustomer {
  const initials = raw.legal_name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("")
  const taxRegime = TAX_REGIMES.find((r) => r.code === raw.tax_regime)?.label ?? raw.tax_regime
  return {
    id: raw.id, taxId: raw.tax_id, legalName: raw.legal_name, email: raw.email,
    taxRegime, taxRegimeCode: raw.tax_regime, zipCode: raw.zip, cfdiUsage: raw.cfdi_use,
    status: raw.is_active ? "active" : "inactive", avatar: raw.avatar_url ?? "", initials,
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export function useLatestClients() {
  const [clients, setClients] = useState<UICustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetch_() {
      setIsLoading(true)
      try {
        const token = useAuthStore.getState().accessToken
        const res = await fetch(`${API_BASE_URL}/api/v1/customers?limit=4&offset=0`, {
          headers: { Authorization: `Bearer ${token ?? ""}` },
        })
        if (!res.ok || cancelled) return
        const raw = (await res.json()) as CustomerRaw[]
        if (!cancelled) setClients(raw.map(fromRaw))
      } catch {
        // silently fail — dashboard card is non-critical
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetch_()
    return () => { cancelled = true }
  }, [])

  return { clients, isLoading }
}
