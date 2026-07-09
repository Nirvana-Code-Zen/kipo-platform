'use client'

import { useEffect } from 'react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'

import { useEmisorStore } from '../store/emisorStore'

import type { UIFiscalSettings } from '../components/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

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

export function mapFromApi(raw: EmisorApiResponse): UIFiscalSettings {
  return {
    rfc: raw.rfc,
    razonSocial: raw.razon_social,
    regimenFiscal: raw.regimen_fiscal,
    codigoPostal: raw.codigo_postal,
    series: raw.series ?? '',
    folioSiguiente: raw.folio_siguiente,
  }
}

export function useEmisorInit() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { isLoaded, setData, reset } = useEmisorStore()

  useEffect(() => {
    if (!accessToken) { reset(); return }
    if (isLoaded) return
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/emisor`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (cancelled) return
        if (res.status === 204) setData(null)
        else if (res.ok) {
          const raw = await res.json() as EmisorApiResponse
          if (!cancelled) setData(mapFromApi(raw))
        } else {
          setData(null)
        }
      } catch {
        if (!cancelled) setData(null)
      }
    }

    load()
    return () => { cancelled = true }
  }, [accessToken, isLoaded])
}

export type { EmisorApiResponse }
