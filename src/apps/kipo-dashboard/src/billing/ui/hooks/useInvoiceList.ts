"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { fromApiResponse } from "../../core/application/dtos/InvoiceApiDTO"

import type { Dispatch, SetStateAction } from "react"
import type { InvoiceApiResponse } from "../../core/application/dtos/InvoiceApiDTO"
import type { UIInvoice } from "../components/shared/types"

export type { Dispatch, SetStateAction }

const PAGE_SIZE = 50

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
    loadInvoices()
  }, [loadInvoices])

  return { invoices, setInvoices, isLoading, selectedInvoice, setSelectedInvoice }
}
