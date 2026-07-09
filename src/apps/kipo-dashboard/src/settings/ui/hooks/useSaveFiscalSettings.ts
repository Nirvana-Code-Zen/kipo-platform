"use client"

import { useState } from "react"

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

export function useSaveFiscalSettings() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save(data: UIFiscalSettings): Promise<UIFiscalSettings | null> {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/emisor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify({
          rfc: data.rfc,
          razon_social: data.razonSocial,
          regimen_fiscal: data.regimenFiscal,
          codigo_postal: data.codigoPostal,
          series: data.series || null,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        setError(body.error ?? `Error ${res.status}`)
        return null
      }
      const raw = (await res.json()) as EmisorApiResponse
      return mapFromApi(raw)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de red")
      return null
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, error }
}
