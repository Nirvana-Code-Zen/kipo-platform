"use client"

import { useState, useMemo } from "react"

import type { UIInvoice, InvoiceStatus } from "../components/types"

export type StatusFilter = "all" | InvoiceStatus

export function useInvoiceFilters(invoices: UIInvoice[]) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [receiverQuery, setReceiverQuery] = useState("")

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false
      if (dateFrom && inv.issuedAtISO < dateFrom) return false
      if (dateTo && inv.issuedAtISO > dateTo) return false
      if (receiverQuery.trim()) {
        const q = receiverQuery.toLowerCase()
        const matchesName = inv.receiverName.toLowerCase().includes(q)
        const matchesTaxId = inv.receiverTaxId.toLowerCase().includes(q)
        if (!matchesName && !matchesTaxId) return false
      }
      return true
    })
  }, [invoices, statusFilter, dateFrom, dateTo, receiverQuery])

  const activeFilterCount = [
    statusFilter !== "all",
    !!(dateFrom || dateTo),
    !!receiverQuery.trim(),
  ].filter(Boolean).length

  const clearAll = () => {
    setStatusFilter("all")
    setDateFrom("")
    setDateTo("")
    setReceiverQuery("")
  }

  return {
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    receiverQuery, setReceiverQuery,
    filtered,
    activeFilterCount,
    clearAll,
  }
}
