"use client"

import { Card } from "@kipo/ui-react"

import { InvoicesListSkeleton } from "@/src/shared/ui/components/dashboard/skeletons"

import { InvoiceRow } from "./InvoiceRow"
import { InvoiceDetailSheet } from "./InvoiceDetailSheet"
import { useInvoiceList } from "../hooks/useInvoiceList"

export function Invoices() {
  const {
    invoices,
    isLoading,
    selectedInvoice,
    setSelectedInvoice,
    cancelInvoice,
    deleteInvoice,
  } = useInvoiceList()

  if (isLoading) return <InvoicesListSkeleton />

  if (invoices.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center gap-3 text-center animate-fade-in">
        <p className="text-muted-foreground text-sm">No hay facturas aún.</p>
        <p className="text-xs text-muted-foreground">Crea tu primera factura con el botón de arriba.</p>
      </Card>
    )
  }

  return (
    <>
      <Card className="overflow-hidden animate-fade-in">
        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border">
          <div className="w-8 flex-shrink-0" />
          <span className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Folio</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:block w-24 text-right">Fecha</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28 text-right">Total</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:block w-20">Estado</span>
          <div className="w-7 flex-shrink-0" />
        </div>

        <div className="divide-y divide-border/50 px-2 py-1">
          {invoices.map((invoice, index) => (
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

      <InvoiceDetailSheet
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </>
  )
}
