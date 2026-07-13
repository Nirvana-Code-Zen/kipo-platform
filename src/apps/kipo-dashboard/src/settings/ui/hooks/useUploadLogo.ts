"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { useEmisorStore } from "../store/emisorStore"
import { mapFromApi, type EmisorApiResponse } from "./useEmisorInit"

import type { UIFiscalSettings } from "../components/types"

const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function useUploadLogo() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File): Promise<UIFiscalSettings | null> {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setError("Formato no soportado. Usa PNG, JPG o WEBP.")
      return null
    }

    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(`${API_BASE_URL}/api/v1/emisor/logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken ?? ""}` },
        body: formData,
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
      setIsUploading(false)
    }
  }

  return { upload, isUploading, error }
}
