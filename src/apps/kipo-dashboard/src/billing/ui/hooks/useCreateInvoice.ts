"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { fromApiResponse } from "../../core/application/dtos/InvoiceApiDTO"

import type { CreateInvoiceApiRequest, InvoiceApiResponse } from "../../core/application/dtos/InvoiceApiDTO"
import type { UIInvoice } from "../components/types"

export function useCreateInvoice(onCreated: (invoice: UIInvoice) => void) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  async function create(request: CreateInvoiceApiRequest): Promise<boolean> {
    setIsSubmitting(true)
    setApiError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify(request),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        setApiError(body.error ?? `Error ${res.status}`)
        return false
      }
      const raw = (await res.json()) as InvoiceApiResponse
      onCreated(fromApiResponse(raw))
      return true
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Error de red")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { create, isSubmitting, apiError, setApiError }
}
