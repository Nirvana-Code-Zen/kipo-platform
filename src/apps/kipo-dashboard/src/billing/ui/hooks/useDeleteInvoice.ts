"use client"

import { useCallback } from "react"

import type { Dispatch, SetStateAction } from "react"
import type { UIInvoice } from "../components/types"

export function useDeleteInvoice(setInvoices: Dispatch<SetStateAction<UIInvoice[]>>) {
  return useCallback(
    (id: string) =>
      setInvoices((prev) => prev.filter((inv) => inv.id !== id)),
    [setInvoices]
  )
}
