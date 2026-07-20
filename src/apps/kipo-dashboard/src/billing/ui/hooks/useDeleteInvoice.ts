"use client"

import { useCallback } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import type { Dispatch, SetStateAction } from "react"
import type { UIInvoice } from "../components/shared/types"

export function useDeleteInvoice(setInvoices: Dispatch<SetStateAction<UIInvoice[]>>) {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useCallback(
    async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/invoices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken ?? ""}` },
      })
      if (!res.ok) return
      setInvoices((prev) => prev.filter((inv) => inv.id !== id))
    },
    [setInvoices, accessToken]
  )
}
