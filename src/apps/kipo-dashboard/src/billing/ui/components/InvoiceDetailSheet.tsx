"use client"

import { createPortal } from "react-dom"

import { Badge } from "@kipo/ui-react"
import { X, Hash, Calendar, User, FileText, CreditCard, DollarSign } from "lucide-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"

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
  const { metodoPago, formaPago } = useCatalogs()

  if (!invoice) return null

  const paymentMethod = metodoPago.find((m) => m.code === invoice.paymentMethod)
  const paymentMethodLabel = paymentMethod
    ? `${paymentMethod.code} - ${paymentMethod.description}`
    : invoice.paymentMethod

  const paymentForm = formaPago.find((f) => f.code === invoice.paymentForm)
  const paymentFormLabel = paymentForm
    ? `${paymentForm.code} - ${paymentForm.description}`
    : invoice.paymentForm

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <h2 className="font-semibold text-base">Factura {invoice.folio}</h2>
            <Badge tone={statusTone[invoice.status]}>{statusLabel[invoice.status]}</Badge>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-3">
          <DetailRow icon={<Hash className="w-4 h-4" />} label="Folio" value={invoice.folio} />
          <DetailRow icon={<Calendar className="w-4 h-4" />} label="Fecha de emisión" value={invoice.issuedAt} />
          <DetailRow icon={<User className="w-4 h-4" />} label="Receptor" value={invoice.receiverName} />
          <DetailRow icon={<FileText className="w-4 h-4" />} label="RFC receptor" value={invoice.receiverTaxId} />
          <DetailRow
            icon={<FileText className="w-4 h-4" />}
            label="Tipo de comprobante"
            value={VOUCHER_TYPE_LABEL[invoice.voucherType] ?? invoice.voucherType}
          />
          <DetailRow
            icon={<CreditCard className="w-4 h-4" />}
            label="Método de pago"
            value={paymentMethodLabel}
          />
          <DetailRow
            icon={<CreditCard className="w-4 h-4" />}
            label="Forma de pago"
            value={paymentFormLabel}
          />
          <DetailRow
            icon={<DollarSign className="w-4 h-4" />}
            label="Total"
            value={`${formatMXN(invoice.total)} ${invoice.currency}`}
          />
        </div>

        <div className="px-5 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium break-all">{value}</p>
      </div>
    </div>
  )
}
