"use client"

import { useState, useEffect } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"

import type { UIFiscalSettings } from "../components/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

interface EmisorApiResponse {
  id: string
  rfc: string
  razon_social: string
  regimen_fiscal: string
  codigo_postal: string
  series: string | null
  folio_siguiente: number
  created_at: string
  updated_at: string
}

function mapFromApi(raw: EmisorApiResponse): UIFiscalSettings {
  return {
    rfc: raw.rfc,
    razonSocial: raw.razon_social,
    regimenFiscal: raw.regimen_fiscal,
    codigoPostal: raw.codigo_postal,
    series: raw.series ?? "",
    folioSiguiente: raw.folio_siguiente,
  }
}

export function useFiscalSettings() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [data, setData] = useState<UIFiscalSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/emisor`, {
          headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
          },
        })
        if (cancelled) return
        if (res.status === 204) {
          setData(null)
        } else if (res.ok) {
          const raw = (await res.json()) as EmisorApiResponse
          if (!cancelled) setData(mapFromApi(raw))
        }
      } catch {
        if (!cancelled) setData(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [accessToken])

  return { data, isLoading, setData }
}
