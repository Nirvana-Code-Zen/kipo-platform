"use client"

import { createPortal } from "react-dom"

import { X, ShieldCheck, FileText, XCircle } from "lucide-react"
import { Badge } from "@kipo/ui-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"
import { useEmisorStore } from "@/src/settings/ui/store/emisorStore"

import type { UIInvoice } from "./types"

interface InvoiceDetailSheetProps {
  invoice: UIInvoice | null
  onClose: () => void
}

const VOUCHER_TYPE_LABEL: Record<string, string> = {
  I: "Ingreso",
  E: "Egreso",
  T: "Traslado",
  N: "Nómina",
  P: "Complemento de pago",
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

export function InvoiceDetailSheet({ invoice, onClose }: InvoiceDetailSheetProps) {
  const { metodoPago, formaPago, regimenFiscal } = useCatalogs()
  const emisor = useEmisorStore((s) => s.data)

  if (!invoice) return null

  const paymentMethodEntry = metodoPago.find((m) => m.code === invoice.paymentMethod)
  const paymentMethodLabel = paymentMethodEntry
    ? `${paymentMethodEntry.code} · ${paymentMethodEntry.description}`
    : invoice.paymentMethod

  const paymentFormEntry = formaPago.find((f) => f.code === invoice.paymentForm)
  const paymentFormLabel = paymentFormEntry
    ? `${paymentFormEntry.code} · ${paymentFormEntry.description}`
    : invoice.paymentForm

  const regimenEntry = regimenFiscal.find((r) => r.code === emisor?.regimenFiscal)
  const regimenLabel = regimenEntry
    ? `${regimenEntry.code} · ${regimenEntry.description}`
    : (emisor?.regimenFiscal ?? "—")

  const voucherTypeLabel = VOUCHER_TYPE_LABEL[invoice.voucherType] ?? invoice.voucherType

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:items-center sm:justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-card shadow-2xl animate-in slide-in-from-bottom-4 duration-300 sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-center pb-1 pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 pb-3 pt-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold">Factura {invoice.folio}</h2>
            <Badge tone={statusTone[invoice.status]}>{statusLabel[invoice.status]}</Badge>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-2xl space-y-4 font-sans text-[13px] leading-snug text-foreground">

            <div className="rounded-md border border-border-strong p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {emisor?.logoUrl ? (
                    <img
                      src={emisor.logoUrl}
                      alt="Logo de la empresa"
                      className="h-12 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-border-strong text-[10px] text-muted-foreground">
                      Sin logo
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold">{emisor?.razonSocial ?? "—"}</p>
                    <p className="text-muted-foreground">RFC: {emisor?.rfc ?? "—"}</p>
                    {regimenLabel && (
                      <p className="text-muted-foreground">Régimen: {regimenLabel}</p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold">Factura {invoice.folio}</p>
                  <p className="text-muted-foreground">Tipo: {voucherTypeLabel}</p>
                  <p className="text-muted-foreground">Fecha: {invoice.issuedAt}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border-subtle p-4">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Receptor
              </p>
              <p className="font-semibold">{invoice.receiverName}</p>
              <p className="text-muted-foreground">RFC: {invoice.receiverTaxId}</p>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-1 rounded-md border border-border-subtle p-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatMXN(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (16%)</span>
                  <span>{formatMXN(invoice.iva)}</span>
                </div>
                <div className="flex justify-between border-t border-border-subtle pt-1 font-bold">
                  <span>Total</span>
                  <span>{formatMXN(invoice.total)} {invoice.currency}</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border-subtle p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pago
              </p>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Método</span>
                  <span className="text-right">{paymentMethodLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Forma</span>
                  <span className="text-right">{paymentFormLabel}</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border-subtle p-3 text-[11px] text-muted-foreground">
              {invoice.status === "stamped" && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
                    <p className="font-semibold uppercase tracking-wide text-foreground">Sello digital</p>
                  </div>
                  <p className="mt-1">
                    Esta factura fue timbrada exitosamente. El folio fiscal (UUID) y los sellos
                    digitales están disponibles en el PDF descargable.
                  </p>
                </div>
              )}
              {invoice.status === "draft" && (
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <p>Borrador — pendiente de timbrar ante el SAT.</p>
                </div>
              )}
              {invoice.status === "cancelled" && (
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5" />
                  <p>Factura cancelada. El folio fiscal original está disponible en el PDF.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="shrink-0 border-t border-border px-5 pb-5 pt-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
