"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"

import { fromApiResponse } from "../../core/application/dtos/InvoiceApiDTO"

import type { Dispatch, SetStateAction } from "react"
import type { InvoiceApiResponse } from "../../core/application/dtos/InvoiceApiDTO"
import type { UIInvoice } from "../components/types"

export type { Dispatch, SetStateAction }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const PAGE_SIZE = 20

export type InvoiceListState = {
  invoices: UIInvoice[]
  setInvoices: Dispatch<SetStateAction<UIInvoice[]>>
  isLoading: boolean
  selectedInvoice: UIInvoice | null
  setSelectedInvoice: Dispatch<SetStateAction<UIInvoice | null>>
}

export function useInvoiceList(): InvoiceListState {
  const [invoices, setInvoices] = useState<UIInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<UIInvoice | null>(null)

  const loadInvoices = useCallback(async () => {
    try {
      const token = useAuthStore.getState().accessToken
      const res = await fetch(
        `${API_BASE_URL}/api/v1/invoices?limit=${PAGE_SIZE}&offset=0`,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      )

      if (!res.ok) return

      const raw = (await res.json()) as InvoiceApiResponse[]
      setInvoices(raw.map(fromApiResponse))
    } catch {
      // keep empty list on failure
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInvoices()
  }, [loadInvoices])

  return { invoices, setInvoices, isLoading, selectedInvoice, setSelectedInvoice }
}
