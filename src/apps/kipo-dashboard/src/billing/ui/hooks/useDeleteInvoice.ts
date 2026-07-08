"use client"

import { useCallback } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"

import type { Dispatch, SetStateAction } from "react"
import type { UIInvoice } from "../components/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

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
