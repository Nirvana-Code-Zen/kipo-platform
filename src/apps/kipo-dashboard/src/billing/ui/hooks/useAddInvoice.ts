"use client"

import { useCallback } from "react"

import type { Dispatch, SetStateAction } from "react"
import type { UIInvoice } from "../components/shared/types"

export function useAddInvoice(setInvoices: Dispatch<SetStateAction<UIInvoice[]>>) {
  return useCallback(
    (invoice: UIInvoice) => setInvoices((prev) => [invoice, ...prev]),
    [setInvoices]
  )
}
