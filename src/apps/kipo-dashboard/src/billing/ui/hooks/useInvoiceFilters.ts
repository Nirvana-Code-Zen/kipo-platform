"use client"

import { useState, useMemo } from "react"

import type { UIInvoice, InvoiceStatus } from "../components/shared/types"

export type StatusFilter = "all" | InvoiceStatus

export function useInvoiceFilters(invoices: UIInvoice[], initialStatus: StatusFilter = "all") {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false
      if (dateFrom && inv.issuedAtISO < dateFrom) return false
      if (dateTo && inv.issuedAtISO > dateTo) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          inv.receiverName.toLowerCase().includes(q) ||
          inv.receiverTaxId.toLowerCase().includes(q) ||
          inv.folio.toLowerCase().includes(q) ||
          inv.id.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })
  }, [invoices, statusFilter, dateFrom, dateTo, searchQuery])

  const activeFilterCount = [
    statusFilter !== "all",
    !!(dateFrom || dateTo),
    !!searchQuery.trim(),
  ].filter(Boolean).length

  const clearAll = () => {
    setStatusFilter("all")
    setDateFrom("")
    setDateTo("")
    setSearchQuery("")
  }

  return {
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    searchQuery, setSearchQuery,
    filtered,
    activeFilterCount,
    clearAll,
  }
}
