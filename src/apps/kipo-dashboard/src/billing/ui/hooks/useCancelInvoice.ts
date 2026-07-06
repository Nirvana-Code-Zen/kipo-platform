"use client"

import { useCallback } from "react"

import type { Dispatch, SetStateAction } from "react"
import type { UIInvoice } from "../components/types"

export function useCancelInvoice(setInvoices: Dispatch<SetStateAction<UIInvoice[]>>) {
  return useCallback(
    (id: string) =>
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: "cancelled" as const } : inv
        )
      ),
    [setInvoices]
  )
}
