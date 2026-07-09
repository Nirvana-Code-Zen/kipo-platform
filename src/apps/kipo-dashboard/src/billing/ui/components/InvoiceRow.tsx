"use client"

import { useState } from "react"

import { Badge } from "@kipo/ui-react"
import { MoreHorizontal } from "lucide-react"

import { InvoiceRowMenu } from "./InvoiceRowMenu"

import type { UIInvoice } from "./types"

interface InvoiceRowProps {
  invoice: UIInvoice
  index: number
  onViewDetails: (invoice: UIInvoice) => void
  onCancel: (id: string) => void
  onDelete: (id: string) => void
}

const VOUCHER_TYPE_LABEL: Record<string, string> = {
  I: "Ingreso",
  E: "Egreso",
  T: "Traslado",
  N: "Nómina",
  P: "Pago",
}

const statusTone = {
  draft: "neutral",
  stamped: "success",
  cancelled: "danger",
} as const

const statusLabel = {
  draft: "Borrador",
  stamped: "Timbrada",
  cancelled: "Cancelada",
} as const

const formatMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)

export function InvoiceRow({ invoice, index, onViewDetails, onCancel, onDelete }: InvoiceRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors rounded-xl animate-slide-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
        style={{ background: "var(--kipo-red-50)", color: "var(--kipo-red-dark)" }}
      >
        {invoice.voucherType}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{invoice.folio}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {VOUCHER_TYPE_LABEL[invoice.voucherType] ?? invoice.voucherType}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{invoice.receiverName}</p>
      </div>

      <span className="text-xs text-muted-foreground hidden md:block">
        {invoice.id}
      </span>

      <span className="text-xs text-muted-foreground flex-shrink-0 hidden md:block w-24 text-right">
        {invoice.issuedAt}
      </span>

      <span className="font-semibold text-sm flex-shrink-0 tabular-nums w-28 text-right">
        {formatMXN(invoice.total)}
      </span>

      <div className="flex-shrink-0 hidden sm:block">
        <Badge tone={statusTone[invoice.status]}>{statusLabel[invoice.status]}</Badge>
      </div>

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`p-1.5 rounded-lg transition-colors ${menuOpen ? "bg-muted" : "hover:bg-muted"}`}
        >
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
        <InvoiceRowMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          status={invoice.status}
          onViewDetails={() => onViewDetails(invoice)}
          onCancel={() => onCancel(invoice.id)}
          onDelete={() => onDelete(invoice.id)}
        />
      </div>
    </div>
  )
}
