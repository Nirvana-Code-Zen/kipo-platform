"use client"

import { useState } from "react"

import { Badge } from "@kipo/ui-react"
import { MoreHorizontal } from "lucide-react"

import { InvoiceRowMenu } from "../InvoiceRowMenu"
import { VOUCHER_TYPE_LABEL, INVOICE_STATUS_TONE, INVOICE_STATUS_LABEL, formatMXN } from "./constants"

import type { InvoiceRowProps } from "./types"

export function InvoiceRow({ invoice, index, onViewDetails, onCancel, onDelete }: InvoiceRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors rounded-xl animate-slide-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-[var(--kipo-red-50)] text-[var(--kipo-red-dark)]">
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
        <Badge tone={INVOICE_STATUS_TONE[invoice.status]}>{INVOICE_STATUS_LABEL[invoice.status]}</Badge>
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
