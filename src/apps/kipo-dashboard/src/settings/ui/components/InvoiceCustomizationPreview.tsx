"use client"

import { useMemo } from "react"

import { ShieldCheck } from "lucide-react"

import { sanitizeHtmlPreview } from "./sanitizeHtmlPreview"

import type { UIInvoiceDisplayOptions } from "./types"

interface InvoiceCustomizationPreviewProps {
  customSectionHtml: string
  displayOptions: UIInvoiceDisplayOptions
  logoUrl?: string | null
}

interface MockLineItem {
  productKey: string
  description: string
  unitKey: string
  unitLabel: string
  quantity: number
  unitPrice: number
  iva: number
  ieps: number
}

const MOCK_LINE_ITEMS: MockLineItem[] = [
  {
    productKey: "01010101",
    description: "Servicio de consultoría administrativa",
    unitKey: "E48",
    unitLabel: "Unidad de servicio",
    quantity: 1,
    unitPrice: 1500.5,
    iva: 240.08,
    ieps: 0,
  },
  {
    productKey: "43211500",
    description: "Licencia de software anual",
    unitKey: "H87",
    unitLabel: "Pieza",
    quantity: 2,
    unitPrice: 899.25,
    iva: 287.76,
    ieps: 89.93,
  },
  {
    productKey: "81112501",
    description: "Soporte técnico remoto",
    unitKey: "E48",
    unitLabel: "Unidad de servicio",
    quantity: 3,
    unitPrice: 350.0,
    iva: 168.0,
    ieps: 0,
  },
]

const MOCK_UUID = "3F2A9C1E-7B4D-4E8A-9C2F-1D5E6A7B8C9D"
const MOCK_SEAL_CFDI =
  "kJ8sX2mQ9pL4vN6rT1wY3zA5bC7dE0fG2hI4jK6lM8nO0pQ2rS4tU6vW8xY0zA2b=="
const MOCK_SEAL_SAT =
  "aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7aB9cD1eF3gH5iJ7kL9mN1oP3q=="
const MOCK_CERT_NUMBER = "00001000000504654321"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}

function formatUnitPrice(amount: number, roundUnitPrice: boolean): string {
  return amount.toFixed(roundUnitPrice ? 2 : 4)
}

export function InvoiceCustomizationPreview({
  customSectionHtml,
  displayOptions,
  logoUrl,
}: InvoiceCustomizationPreviewProps) {
  const sanitizedCustomSectionHtml = useMemo(
    () => sanitizeHtmlPreview(customSectionHtml),
    [customSectionHtml]
  )

  const subtotal = MOCK_LINE_ITEMS.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const ivaTotal = MOCK_LINE_ITEMS.reduce((sum, item) => sum + item.iva, 0)
  const iepsTotal = MOCK_LINE_ITEMS.reduce((sum, item) => sum + item.ieps, 0)

  const showIeps = displayOptions.showIepsBreakdown
  const combineIeps = showIeps && displayOptions.combineIepsWithSubtotal

  const subtotalLineAmount = combineIeps ? subtotal + iepsTotal : subtotal
  const subtotalLineLabel = combineIeps ? "Subtotal (incluye IEPS)" : "Subtotal"

  const total = subtotal + ivaTotal + (showIeps ? iepsTotal : 0)

  return (
    <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-border-strong bg-card p-4 text-foreground">
      <div className="mx-auto max-w-2xl space-y-4 font-sans text-[13px] leading-snug">

        <div className="rounded-md border border-border-strong p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo de la empresa" className="h-12 w-auto object-contain" />
              ) : (
                <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-border-strong text-[10px] text-muted-foreground">
                  Tu logo aquí
                </div>
              )}
              <div>
                <p className="text-sm font-bold">Kipo Emisor Demo S.A. de C.V.</p>
                <p className="text-muted-foreground">RFC: KED010101ABC</p>
                <p className="text-muted-foreground">Régimen fiscal: 601 · General de Ley Personas Morales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">Factura A-0001</p>
              <p className="text-muted-foreground">Tipo: Ingreso</p>
              <p className="text-muted-foreground">Fecha: 2026-07-13T10:15:00</p>
            </div>
          </div>

          {displayOptions.showExportKey && (
            <p className="mt-2 text-muted-foreground">Clave de exportación: 01</p>
          )}
        </div>

        <div className="rounded-md border border-border-subtle p-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Receptor
          </p>
          <p className="font-semibold">Cliente de Ejemplo S.A. de C.V.</p>
          <p className="text-muted-foreground">RFC: XAXX010101000</p>
          <p className="text-muted-foreground">
            Uso CFDI: G03 · Gastos en general
          </p>
          <p className="text-muted-foreground">
            Av. Ejemplo 123, Col. Centro, Ciudad de México
            {displayOptions.showAddressCodes && (
              <span> (MX-CMX, MEX)</span>
            )}
          </p>
        </div>

        <div className="overflow-hidden rounded-md border border-border-subtle">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-muted text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                {displayOptions.showProductKey && <th className="px-2 py-2 font-semibold">Clave prod/serv</th>}
                <th className="px-2 py-2 font-semibold">Descripción</th>
                <th className="px-2 py-2 font-semibold">Unidad</th>
                <th className="px-2 py-2 text-right font-semibold">Cant.</th>
                <th className="px-2 py-2 text-right font-semibold">P. unitario</th>
                {displayOptions.showTaxBreakdown && <th className="px-2 py-2 text-right font-semibold">IVA</th>}
                <th className="px-2 py-2 text-right font-semibold">Importe</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LINE_ITEMS.map((item) => (
                <tr key={item.productKey} className="border-b border-border-subtle last:border-b-0">
                  {displayOptions.showProductKey && (
                    <td className="px-2 py-2 align-top text-muted-foreground">{item.productKey}</td>
                  )}
                  <td className="px-2 py-2 align-top">{item.description}</td>
                  <td className="px-2 py-2 align-top text-muted-foreground">
                    {displayOptions.showCatalogCodes ? `${item.unitKey} ${item.unitLabel}` : item.unitLabel}
                  </td>
                  <td className="px-2 py-2 text-right align-top">{item.quantity}</td>
                  <td className="px-2 py-2 text-right align-top">
                    {formatCurrency(Number(formatUnitPrice(item.unitPrice, displayOptions.roundUnitPrice)))}
                  </td>
                  {displayOptions.showTaxBreakdown && (
                    <td className="px-2 py-2 text-right align-top text-muted-foreground">
                      {formatCurrency(item.iva)}
                    </td>
                  )}
                  <td className="px-2 py-2 text-right align-top font-medium">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-1 rounded-md border border-border-subtle p-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{subtotalLineLabel}</span>
              <span>{formatCurrency(subtotalLineAmount)}</span>
            </div>
            {showIeps && !combineIeps && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">IEPS</span>
                <span>{formatCurrency(iepsTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (16%)</span>
              <span>{formatCurrency(ivaTotal)}</span>
            </div>
            <div className="flex justify-between border-t border-border-subtle pt-1 font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {sanitizedCustomSectionHtml && (
          <div
            className="rounded-md border border-border-subtle p-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border-subtle [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border-subtle [&_th]:px-2 [&_th]:py-1"
            dangerouslySetInnerHTML={{ __html: sanitizedCustomSectionHtml }}
          />
        )}

        <div className="rounded-md border border-border-subtle p-3 text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold uppercase tracking-wide">Sello digital</p>
            {displayOptions.repeatSignatureEachPage && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border-strong px-2 py-0.5 text-[10px] font-medium">
                <ShieldCheck className="h-3 w-3" />
                Se repetirá en cada página
              </span>
            )}
          </div>
          <p className="mt-1 break-all">UUID: {MOCK_UUID}</p>
          <p className="mt-1 break-all">Sello digital del CFDI: {MOCK_SEAL_CFDI}</p>
          <p className="mt-1 break-all">Sello digital del SAT: {MOCK_SEAL_SAT}</p>
          <p className="mt-1">Número de serie del certificado del SAT: {MOCK_CERT_NUMBER}</p>
        </div>

      </div>
    </div>
  )
}
