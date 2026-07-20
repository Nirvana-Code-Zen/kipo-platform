"use client"

import { forwardRef, useImperativeHandle } from "react"

import { Card } from "@kipo/ui-react"

import { InvoicesListSkeleton } from "@/src/shared/ui/components/dashboard/skeletons"

import { InvoiceRow } from "../InvoiceRow"
import { InvoiceDetailSheet } from "../InvoiceDetailSheet"
import { InvoiceFilters } from "../InvoiceFilters"
import { useInvoiceList } from "../../hooks/useInvoiceList"
import { useAddInvoice } from "../../hooks/useAddInvoice"
import { useCancelInvoice } from "../../hooks/useCancelInvoice"
import { useDeleteInvoice } from "../../hooks/useDeleteInvoice"
import { useInvoiceFilters } from "../../hooks/useInvoiceFilters"

import type { UIInvoice } from "../shared/types"
import type { StatusFilter } from "../../hooks/useInvoiceFilters"

export interface InvoicesHandle {
  addInvoice: (invoice: UIInvoice) => void
}

export const Invoices = forwardRef<InvoicesHandle, { initialStatus?: StatusFilter }>(function Invoices({ initialStatus = "all" }, ref) {
  const { invoices, setInvoices, isLoading, selectedInvoice, setSelectedInvoice } = useInvoiceList()

  const addInvoice    = useAddInvoice(setInvoices)
  const cancelInvoice = useCancelInvoice(setInvoices)
  const deleteInvoice = useDeleteInvoice(setInvoices)

  const filters = useInvoiceFilters(invoices, initialStatus)

  useImperativeHandle(ref, () => ({ addInvoice }))

  if (isLoading) return <InvoicesListSkeleton />

  return (
    <div className="space-y-4 animate-fade-in">
      <InvoiceFilters
        statusFilter={filters.statusFilter}
        onStatusChange={filters.setStatusFilter}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onDateFromChange={filters.setDateFrom}
        onDateToChange={filters.setDateTo}
        searchQuery={filters.searchQuery}
        onSearchQueryChange={filters.setSearchQuery}
        activeFilterCount={filters.activeFilterCount}
        onClearAll={filters.clearAll}
        totalCount={invoices.length}
        filteredCount={filters.filtered.length}
      />

      {filters.filtered.length === 0 ? (
        <Card className="p-12 flex flex-col items-center gap-3 text-center">
          <p className="text-muted-foreground text-sm">
            {invoices.length === 0
              ? "No hay facturas aún."
              : "Ninguna factura coincide con los filtros."}
          </p>
          {invoices.length > 0 && (
            <button
              type="button"
              onClick={filters.clearAll}
              className="text-xs font-semibold underline underline-offset-2 text-[var(--brand)] bg-transparent border-0 cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border">
            <div className="w-8 flex-shrink-0" />
            <span className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Folio</span>
            <span className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Folio Fiscal</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:block w-24 text-right">Fecha</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28 text-right">Total</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:block w-20">Estado</span>
            <div className="w-7 flex-shrink-0" />
          </div>

          <div className="divide-y divide-border/50 px-2 py-1">
            {filters.filtered.map((invoice, index) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                index={index}
                onViewDetails={setSelectedInvoice}
                onCancel={cancelInvoice}
                onDelete={deleteInvoice}
              />
            ))}
          </div>
        </Card>
      )}

      <InvoiceDetailSheet
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  )
})
