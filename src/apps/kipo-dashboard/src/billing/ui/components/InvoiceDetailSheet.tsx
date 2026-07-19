"use client"

import { createPortal } from "react-dom"

import Image from "next/img"
import { X, ShieldCheck, FileText, XCircle } from "lucide-react"
import { Badge } from "@kipo/ui-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"
import { useEmisorStore } from "@/src/settings/ui/store/emisorStore"
import { DEFAULT_DISPLAY_OPTIONS } from "@/src/settings/ui/components/pdfCustomizationConstants"

import { UNIT_CODES } from "../data/catalogs"

import type { UIInvoice, UIInvoiceConcept, InvoiceStatus } from "./types"
import type { UIInvoiceDisplayOptions } from "@/src/settings/ui/components/types"

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

const STATUS_TONE = {
  draft: "neutral",
  stamped: "success",
  cancelled: "danger",
} as const

const STATUS_LABEL = {
  draft: "Borrador",
  stamped: "Timbrada",
  cancelled: "Cancelada",
} as const

const formatMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)

function resolveUnitLabel(code: string): string {
  const entry = UNIT_CODES.find((u) => u.code === code)
  if (!entry) return code
  const parts = entry.label.split(" - ")
  return parts.length > 1 ? parts.slice(1).join(" - ") : entry.label
}

interface EmisorHeaderProps {
  razonSocial: string | undefined
  rfc: string | undefined
  regimenLabel: string
  logoUrl: string | null
  folio: string
  voucherTypeLabel: string
  issuedAt: string
  showExportKey: boolean
}

function EmisorHeader({
  razonSocial,
  rfc,
  regimenLabel,
  logoUrl,
  folio,
  voucherTypeLabel,
  issuedAt,
  showExportKey,
}: EmisorHeaderProps) {
  return (
    <div className="rounded-md border border-border-strong p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {logoUrl ? (
            <Image height={12} width={12} src={logoUrl} alt="Logo de la empresa" className="h-12 w-auto object-contain" />
          ) : (
            <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-border-strong text-[10px] text-muted-foreground">
              Sin logo
            </div>
          )}
          <div>
            <p className="text-sm font-bold">{razonSocial ?? "—"}</p>
            <p className="text-muted-foreground">RFC: {rfc ?? "—"}</p>
            {regimenLabel && <p className="text-muted-foreground">Régimen: {regimenLabel}</p>}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold">Factura {folio}</p>
          <p className="text-muted-foreground">Tipo: {voucherTypeLabel}</p>
          <p className="text-muted-foreground">Fecha: {issuedAt}</p>
          {showExportKey && <p className="text-muted-foreground">Clave exportación: 01</p>}
        </div>
      </div>
    </div>
  )
}

function ReceptorBlock({ name, taxId }: { name: string; taxId: string }) {
  return (
    <div className="rounded-md border border-border-subtle p-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Receptor
      </p>
      <p className="font-semibold">{name}</p>
      <p className="text-muted-foreground">RFC: {taxId}</p>
    </div>
  )
}

interface ConceptsTableProps {
  concepts: UIInvoiceConcept[]
  displayOptions: UIInvoiceDisplayOptions
}

function ConceptsTable({ concepts, displayOptions }: ConceptsTableProps) {
  if (concepts.length === 0) return null
  return (
    <div className="overflow-hidden rounded-md border border-border-subtle">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-subtle bg-muted text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            {displayOptions.showProductKey && <th className="px-2 py-2 font-semibold">Clave</th>}
            <th className="px-2 py-2 font-semibold">Descripción</th>
            <th className="px-2 py-2 font-semibold">Unidad</th>
            <th className="px-2 py-2 text-right font-semibold">Cant.</th>
            <th className="px-2 py-2 text-right font-semibold">P. unit.</th>
            {displayOptions.showTaxBreakdown && <th className="px-2 py-2 text-right font-semibold">IVA</th>}
            <th className="px-2 py-2 text-right font-semibold">Importe</th>
          </tr>
        </thead>
        <tbody>
          {concepts.map((c, i) => {
            const label = resolveUnitLabel(c.unitCode)
            const unitCell = displayOptions.showCatalogCodes ? `${c.unitCode} ${label}` : label
            const unitPriceStr = displayOptions.roundUnitPrice
              ? c.unitPrice.toFixed(2)
              : c.unitPrice.toFixed(4)
            return (
              <tr key={i} className="border-b border-border-subtle last:border-b-0">
                {displayOptions.showProductKey && (
                  <td className="px-2 py-2 align-top font-mono text-[11px] text-muted-foreground">
                    {c.productServiceCode}
                  </td>
                )}
                <td className="px-2 py-2 align-top">{c.description}</td>
                <td className="px-2 py-2 align-top text-muted-foreground">{unitCell}</td>
                <td className="px-2 py-2 text-right align-top">{c.quantity}</td>
                <td className="px-2 py-2 text-right align-top">{formatMXN(parseFloat(unitPriceStr))}</td>
                {displayOptions.showTaxBreakdown && (
                  <td className="px-2 py-2 text-right align-top text-muted-foreground">
                    {formatMXN(c.ivaAmount)}
                  </td>
                )}
                <td className="px-2 py-2 text-right align-top font-medium">{formatMXN(c.amount)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function TotalsBlock({ subtotal, iva, total, currency }: { subtotal: number; iva: number; total: number; currency: string }) {
  return (
    <div className="flex justify-end">
      <div className="w-full max-w-xs space-y-1 rounded-md border border-border-subtle p-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatMXN(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">IVA (16%)</span>
          <span>{formatMXN(iva)}</span>
        </div>
        <div className="flex justify-between border-t border-border-subtle pt-1 font-bold">
          <span>Total</span>
          <span>{formatMXN(total)} {currency}</span>
        </div>
      </div>
    </div>
  )
}

function PaymentBlock({ methodLabel, formLabel }: { methodLabel: string; formLabel: string }) {
  return (
    <div className="rounded-md border border-border-subtle p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Pago
      </p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Método</span>
          <span className="text-right">{methodLabel}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Forma</span>
          <span className="text-right">{formLabel}</span>
        </div>
      </div>
    </div>
  )
}

function CustomEmisorSection({ html }: { html: string }) {
  return (
    <div
      className="rounded-md border border-border-subtle p-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border-subtle [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border-subtle [&_th]:px-2 [&_th]:py-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function StampStatusBlock({ status }: { status: InvoiceStatus }) {
  return (
    <div className="rounded-md border border-border-subtle p-3 text-[11px] text-muted-foreground">
      {status === "stamped" && (
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
      {status === "draft" && (
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <p>Borrador — pendiente de timbrar ante el SAT.</p>
        </div>
      )}
      {status === "cancelled" && (
        <div className="flex items-center gap-1.5">
          <XCircle className="h-3.5 w-3.5" />
          <p>Factura cancelada. El folio fiscal original está disponible en el PDF.</p>
        </div>
      )}
    </div>
  )
}

export function InvoiceDetailSheet({ invoice, onClose }: InvoiceDetailSheetProps) {
  const { metodoPago, formaPago, regimenFiscal } = useCatalogs()
  const emisorData = useEmisorStore((s) => s.data)

  const displayOptions = emisorData?.displayOptions ?? DEFAULT_DISPLAY_OPTIONS
  const customSectionHtml = emisorData?.customSectionHtml ?? null
  const logoUrl = emisorData?.logoUrl ?? null

  if (!invoice) return null

  const paymentMethodEntry = metodoPago.find((m) => m.code === invoice.paymentMethod)
  const paymentMethodLabel = paymentMethodEntry
    ? `${paymentMethodEntry.code} · ${paymentMethodEntry.description}`
    : invoice.paymentMethod

  const paymentFormEntry = formaPago.find((f) => f.code === invoice.paymentForm)
  const paymentFormLabel = paymentFormEntry
    ? `${paymentFormEntry.code} · ${paymentFormEntry.description}`
    : invoice.paymentForm

  const regimenEntry = regimenFiscal.find((r) => r.code === emisorData?.regimenFiscal)
  const regimenLabel = regimenEntry
    ? `${regimenEntry.code} · ${regimenEntry.description}`
    : (emisorData?.regimenFiscal ?? "—")

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
            <Badge tone={STATUS_TONE[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
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
            <EmisorHeader
              razonSocial={emisorData?.razonSocial}
              rfc={emisorData?.rfc}
              regimenLabel={regimenLabel}
              logoUrl={logoUrl}
              folio={invoice.folio}
              voucherTypeLabel={voucherTypeLabel}
              issuedAt={invoice.issuedAt}
              showExportKey={displayOptions.showExportKey}
            />
            <ReceptorBlock name={invoice.receiverName} taxId={invoice.receiverTaxId} />
            <ConceptsTable concepts={invoice.concepts} displayOptions={displayOptions} />
            <TotalsBlock
              subtotal={invoice.subtotal}
              iva={invoice.iva}
              total={invoice.total}
              currency={invoice.currency}
            />
            <PaymentBlock methodLabel={paymentMethodLabel} formLabel={paymentFormLabel} />
            {customSectionHtml && <CustomEmisorSection html={customSectionHtml} />}
            <StampStatusBlock status={invoice.status} />
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
