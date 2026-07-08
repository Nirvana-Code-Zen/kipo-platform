"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { CustomerApiMapper } from "@/src/customers/core/infrastructure/mappers/CustomerApiMapper"

import type { CustomerApiResponse } from "@/src/customers/core/application/dtos/CustomerApiDTO"
import type { Customer } from "../components/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export function useAddCustomer(onAdded: (customer: Customer) => void) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  async function save(customer: Customer): Promise<string | null> {
    setSaveError(null)
    setIsSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify(CustomerApiMapper.toCreateRequest(customer)),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        const msg = body.error ?? `Error ${res.status}`
        setSaveError(msg)
        return msg
      }

      const raw = await res.json() as CustomerApiResponse
      onAdded(CustomerApiMapper.fromApiResponse(raw))
      return null
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error de red"
      setSaveError(msg)
      return msg
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, saveError }
}
