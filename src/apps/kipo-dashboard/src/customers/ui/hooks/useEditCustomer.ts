"use client"

import { useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { CustomerApiMapper } from "@/src/customers/core/infrastructure/mappers/CustomerApiMapper"

import type { CustomerApiResponse } from "@/src/customers/core/application/dtos/CustomerApiDTO"
import type { Customer } from "../components/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export function useEditCustomer(onUpdated: (customer: Customer) => void) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [isSaving, setIsSaving] = useState(false)

  async function save(customerId: string, customer: Customer): Promise<string | null> {
    setIsSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify(CustomerApiMapper.toUpdateRequest(customer)),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
        return body.error ?? `Error ${res.status}`
      }

      const raw = await res.json() as CustomerApiResponse
      onUpdated(CustomerApiMapper.fromApiResponse(raw))
      return null
    } catch (e) {
      return e instanceof Error ? e.message : "Error de red"
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving }
}
