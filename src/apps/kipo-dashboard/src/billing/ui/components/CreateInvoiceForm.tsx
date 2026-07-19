"use client"

import { useRef } from "react"

import { Button, Input } from "@kipo/ui-react"
import { CheckCircle2, Plus, Trash2, Search, X, User } from "lucide-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"
import { useClickOutside } from "@/src/shared/ui/hooks/useClickOutside"

import { useReceiverSearch } from "../hooks/useReceiverSearch"
import { useProductServiceSearch } from "../hooks/useProductServiceSearch"
import {
  VOUCHER_TYPES,
  CURRENCIES,
  EXPORT_TYPES,
  UNIT_CODES,
} from "../data/catalogs"
import { MOCK_PRODUCT_SERVICE_CODES } from "../data/mockProductServiceCodes"

import type { useInvoiceForm } from "../hooks/useInvoiceForm"
import type { ReceiverSuggestion } from "../hooks/useReceiverSearch"

interface StyledSelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: ReadonlyArray<{ code: string; label: string }>
  error?: string
  placeholder?: string
  hint?: string
}

function StyledSelect({ label, value, onChange, options, error, placeholder = "Seleccionar...", hint }: StyledSelectProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "var(--text-strong)" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            appearance: "none",
            background: "var(--surface-card)",
            border: `1.5px solid ${error ? "var(--kipo-danger)" : "var(--border-strong)"}`,
            borderRadius: "var(--radius-md)",
            padding: "12px 40px 12px 14px",
            fontSize: 15,
            fontFamily: "var(--font-body)",
            color: value ? "var(--text-strong)" : "var(--text-muted)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="" disabled style={{ color: "var(--text-muted)" }}>{placeholder}</option>
          {options.map((o) => (
            <option key={o.code} value={o.code}>{o.label}</option>
          ))}
        </select>
        <span style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: "var(--text-muted)", fontSize: 12,
        }}>▾</span>
      </div>
      {(error ?? hint) && (
        <span style={{ fontSize: 12, color: error ? "var(--kipo-danger)" : "var(--text-muted)" }}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13,
        color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--border-soft)" }} />
    </div>
  )
}

const formatMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)

// ─── Receiver search ─────────────────────────────────────────────────────────

interface ReceiverSearchProps {
  receiverTaxId: string
  receiverName: string
  receiverZip: string
  isCustomerSelected: boolean
  errorTaxId?: string
  errorName?: string
  errorZip?: string
  onSelectCustomer: (suggestion: ReceiverSuggestion) => void
  onChangeTaxId: (v: string) => void
  onChangeName: (v: string) => void
  onChangeZip: (v: string) => void
  onClear: () => void
}

function ReceiverSearch({
  receiverTaxId,
  receiverName,
  receiverZip,
  isCustomerSelected,
  errorTaxId,
  errorName,
  errorZip,
  onSelectCustomer,
  onChangeTaxId,
  onChangeName,
  onChangeZip,
  onClear,
}: ReceiverSearchProps) {
  const search = useReceiverSearch()
  const dropdownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropdownRef, () => search.setIsOpen(false))

  if (isCustomerSelected) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", borderRadius: "var(--radius-md)",
        border: "1.5px solid var(--border-strong)",
        background: "var(--surface-muted)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "var(--radius-circle)",
          background: "var(--surface-brand-soft)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <User size={16} style={{ color: "var(--brand)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", margin: 0, lineHeight: 1.3 }}>
            {receiverName}
          </p>
          <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "2px 0 0" }}>
            {receiverTaxId}{receiverZip ? ` · CP ${receiverZip}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { onClear(); search.clear() }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: "var(--radius-sm)",
            border: "none", background: "transparent", cursor: "pointer",
            color: "var(--text-muted)",
          }}
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  const showNoResults = search.isOpen && search.query.trim().length >= 2 && search.suggestions.length === 0

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "var(--text-strong)" }}>
        Buscar Cliente
      </label>
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <div style={{ position: "relative" }}>
          <Search size={15} style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-muted)", pointerEvents: "none",
          }} />
          <input
            type="text"
            placeholder="Nombre o RFC del cliente..."
            value={search.query}
            onChange={(e) => {
              search.setQuery(e.target.value)
              search.setIsOpen(true)
            }}
            onFocus={() => search.setIsOpen(true)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "var(--surface-card)",
              border: "1.5px solid var(--border-strong)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px 12px 40px",
              fontSize: 15, fontFamily: "var(--font-body)",
              color: "var(--text-strong)",
              outline: "none",
            }}
          />
        </div>

        {search.isOpen && search.suggestions.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
            background: "var(--surface-card)",
            border: "1.5px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
          }}>
            {search.suggestions.map((s) => (
              <button
                key={s.taxId}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelectCustomer(s)
                  search.clear()
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "10px 14px",
                  background: "transparent",
                  border: "none", borderBottom: "1px solid var(--border-soft)",
                  cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "var(--radius-circle)",
                  background: "var(--surface-brand-soft)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <User size={14} style={{ color: "var(--brand)" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", margin: 0, lineHeight: 1.3 }}>
                    {s.name}
                  </p>
                  <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "2px 0 0" }}>
                    {s.taxId}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {showNoResults && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
            background: "var(--surface-card)",
            border: "1.5px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "12px 14px",
          }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              No se encontraron clientes. Llena los datos manualmente o crea el cliente primero.
            </p>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <Input
          label="RFC"
          placeholder="XAXX010101000"
          value={receiverTaxId}
          onChange={(e) => onChangeTaxId(e.target.value.toUpperCase())}
          error={errorTaxId}
          mono
          maxLength={13}
          autoComplete="off"
        />
        <Input
          label="Nombre / Razón social"
          placeholder="Como en la CSF"
          value={receiverName}
          onChange={(e) => onChangeName(e.target.value)}
          error={errorName}
          autoComplete="off"
        />
        <Input
          label="C.P. Receptor"
          placeholder="00000"
          value={receiverZip}
          onChange={(e) => onChangeZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          error={errorZip}
          mono
          maxLength={5}
        />
      </div>
    </div>
  )
}


// ─── Product/service code search (MOCK — replace with PAC lookup) ──────────

interface ProductServiceSearchProps {
  description: string
  productServiceCode: string
  errorDescription?: string
  errorCode?: string
  onChangeDescription: (v: string) => void
  onSelectCode: (code: string) => void
  onClearCode: () => void
}

function ProductServiceSearch({
  description,
  productServiceCode,
  errorDescription,
  errorCode,
  onChangeDescription,
  onSelectCode,
  onClearCode,
}: ProductServiceSearchProps) {
  const search = useProductServiceSearch(description)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropdownRef, () => search.setIsOpen(false))

  const selected = MOCK_PRODUCT_SERVICE_CODES.find((p) => p.code === productServiceCode)
  const isSelected = !!productServiceCode

  return (
    <div className="grid grid-cols-2 gap-3">
      <div ref={dropdownRef} className="relative">
        <Input
          label="Descripción"
          placeholder="Servicio de desarrollo de software"
          value={description}
          onChange={(e) => {
            onChangeDescription(e.target.value)
            search.setIsOpen(true)
          }}
          onFocus={() => search.setIsOpen(true)}
          error={errorDescription}
          autoComplete="off"
        />

        {search.isOpen && search.suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 overflow-hidden rounded-md border-[1.5px] border-input bg-card shadow-lg">
            {search.suggestions.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  onSelectCode(s.code)
                  onChangeDescription(s.description)
                  search.setIsOpen(false)
                }}
                className="flex w-full flex-col gap-0.5 border-0 border-b border-border-subtle bg-transparent px-3.5 py-2.5 text-left cursor-pointer hover:bg-muted"
              >
                <span className="text-[13px] font-semibold text-foreground">
                  {s.description}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {s.code}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isSelected ? (
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[13px] font-semibold text-foreground">
            Clave producto/servicio
          </label>
          <div className="flex items-center gap-2.5 rounded-md border-[1.5px] border-input bg-muted px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[13px] font-semibold text-foreground">
                {productServiceCode}
              </p>
              {selected && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {selected.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClearCode}
              className="flex h-6 w-6 items-center justify-center rounded-sm border-0 bg-transparent cursor-pointer text-muted-foreground"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[13px] font-semibold text-foreground">
            Clave producto/servicio
          </label>
          <div
            className={`box-border w-full rounded-md border-[1.5px] bg-muted px-3.5 py-3 font-sans text-[13px] text-muted-foreground ${
              errorCode ? "border-destructive" : "border-border-subtle"
            }`}
          >
            Escribe la descripción para elegir la clave SAT
          </div>
          {errorCode && (
            <span className="text-xs text-destructive">{errorCode}</span>
          )}
        </div>
      )}
    </div>
  )
}

interface CreateInvoiceFormProps {
  form: ReturnType<typeof useInvoiceForm>
  onFormSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function CreateInvoiceForm({ form, onFormSubmit, onCancel, isSubmitting, submitLabel = "Crear borrador" }: CreateInvoiceFormProps) {
  const { metodoPago, formaPago, objetoImp, ivaTasa } = useCatalogs()

  return (
    <form onSubmit={onFormSubmit} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ── Sección 1: Datos del comprobante ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionTitle>Datos del comprobante</SectionTitle>

          <StyledSelect
            label="Tipo de comprobante"
            value={form.voucherType}
            onChange={form.setVoucherType}
            options={VOUCHER_TYPES}
            error={form.errors.voucherType}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StyledSelect
              label="Método de pago"
              value={form.paymentMethod}
              onChange={form.setPaymentMethod}
              options={metodoPago.map((m) => ({ code: m.code, label: `${m.code} - ${m.description}` }))}
              error={form.errors.paymentMethod}
            />
            {form.paymentMethod === "PPD" ? (
              <StyledSelect
                label="Forma de pago"
                value="99"
                onChange={() => {}}
                options={formaPago
                  .filter((f) => f.code === "99")
                  .map((f) => ({ code: f.code, label: `${f.code} - ${f.description}` }))}
                hint="Automático para PPD"
              />
            ) : (
              <StyledSelect
                label="Forma de pago"
                value={form.paymentForm}
                onChange={form.setPaymentForm}
                options={formaPago.map((f) => ({ code: f.code, label: `${f.code} - ${f.description}` }))}
                error={form.errors.paymentForm}
              />
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StyledSelect
              label="Moneda"
              value={form.currency}
              onChange={form.setCurrency}
              options={CURRENCIES}
              error={form.errors.currency}
            />
            <Input
              label="C.P. Emisor"
              placeholder="00000"
              value={form.issuerZipCode}
              onChange={(e) => form.setIssuerZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              error={form.errors.issuerZipCode}
              mono
              maxLength={5}
            />
          </div>

          <StyledSelect
            label="Tipo de exportación"
            value={form.exportType}
            onChange={form.setExportType}
            options={EXPORT_TYPES}
          />
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionTitle>Receptor</SectionTitle>

          <ReceiverSearch
            receiverTaxId={form.receiverTaxId}
            receiverName={form.receiverName}
            receiverZip={form.receiverZip}
            isCustomerSelected={!!form.customerId}
            errorTaxId={form.errors.receiverTaxId}
            errorName={form.errors.receiverName}
            errorZip={form.errors.receiverZip}
            onSelectCustomer={(s) => {
              form.setCustomerId(s.id)
              form.setReceiverTaxId(s.taxId)
              form.setReceiverName(s.name)
              form.setReceiverZip(s.zip ?? "")
            }}
            onChangeTaxId={form.setReceiverTaxId}
            onChangeName={form.setReceiverName}
            onChangeZip={form.setReceiverZip}
            onClear={() => {
              form.setReceiverTaxId("")
              form.setReceiverName("")
              form.setReceiverZip("")
              form.setCustomerId(null)
            }}
          />
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionTitle>Conceptos</SectionTitle>

          {form.errors.concepts && (
            <span style={{ fontSize: 12, color: "var(--kipo-danger)" }}>{form.errors.concepts}</span>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {form.concepts.map((concept, idx) => {
              const itemErr = form.errors.items?.[idx] ?? {}
              const qty = parseFloat(concept.quantity) || 0
              const price = parseFloat(concept.unitPrice) || 0
              const amount = Math.round(qty * price * 100) / 100

              return (
                <div
                  key={concept.id}
                  style={{
                    border: "1.5px solid var(--border-soft)",
                    borderRadius: "var(--radius-md)",
                    padding: 16,
                    background: "var(--surface-muted)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Concepto {idx + 1}
                    </span>
                    {form.concepts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => form.removeConcept(concept.id)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: 28, height: 28, borderRadius: "var(--radius-sm)",
                          border: "none", background: "transparent", cursor: "pointer",
                          color: "var(--kipo-danger)",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <ProductServiceSearch
                    description={concept.description}
                    productServiceCode={concept.productServiceCode}
                    errorDescription={itemErr.description}
                    errorCode={itemErr.productServiceCode}
                    onChangeDescription={(v) => form.updateConcept(concept.id, "description", v)}
                    onSelectCode={(code) => form.updateConcept(concept.id, "productServiceCode", code)}
                    onClearCode={() => form.updateConcept(concept.id, "productServiceCode", "")}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input
                      label="Cantidad"
                      type="number"
                      placeholder="1"
                      value={concept.quantity}
                      onChange={(e) => form.updateConcept(concept.id, "quantity", e.target.value)}
                      error={itemErr.quantity}
                      mono
                      min="0.001"
                    />
                    <Input
                      label="Precio unitario"
                      type="number"
                      placeholder="0.00"
                      value={concept.unitPrice}
                      onChange={(e) => form.updateConcept(concept.id, "unitPrice", e.target.value)}
                      error={itemErr.unitPrice}
                      mono
                      prefix="$"
                      min="0"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <StyledSelect
                    label="Clave unidad"
                    value={concept.unitCode}
                    onChange={(v) => form.updateConcept(concept.id, "unitCode", v)}
                    options={UNIT_CODES}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <StyledSelect
                      label="Objeto de impuesto"
                      value={concept.taxObject}
                      onChange={(v) => form.updateConcept(concept.id, "taxObject", v)}
                      options={objetoImp.map((o) => ({ code: o.code, label: `${o.code} - ${o.description}` }))}
                    />
                    {concept.taxObject === "02" && (
                      <StyledSelect
                        label="IVA"
                        value={concept.ivaRate}
                        onChange={(v) => form.updateConcept(concept.id, "ivaRate", v)}
                        options={ivaTasa.map((i) => ({ code: i.code, label: i.description }))}
                      />
                    )}
                  </div>

                  {amount > 0 && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--text-strong)" }}>
                        Importe: {formatMXN(amount)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={form.addConcept}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "10px 0",
              border: "1.5px dashed var(--border-strong)", borderRadius: "var(--radius-md)",
              background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: "var(--brand)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Plus size={14} />
            Agregar concepto
          </button>
        </section>

        <div style={{
          borderRadius: "var(--radius-md)",
          border: "1.5px solid var(--border-soft)",
          overflow: "hidden",
        }}>
          <TotalRow label="Subtotal" value={formatMXN(form.totals.subtotal)} />
          <TotalRow label="IVA"      value={formatMXN(form.totals.iva)} />
          <TotalRow label="Total"    value={formatMXN(form.totals.total)} bold />
        </div>

        <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
          <Button type="button" variant="secondary" size="md" full onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" full disabled={isSubmitting}>
            <CheckCircle2 size={15} />
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </div>

      </div>
    </form>
  )
}

function TotalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 16px",
      background: bold ? "var(--surface-brand-soft)" : "var(--surface-muted)",
      borderTop: "1px solid var(--border-soft)",
    }}>
      <span style={{
        fontSize: 13, fontFamily: "var(--font-body)",
        fontWeight: bold ? 700 : 500,
        color: bold ? "var(--brand)" : "var(--text-body)",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: bold ? 16 : 13, fontFamily: "var(--font-mono)",
        fontWeight: bold ? 700 : 500,
        color: bold ? "var(--brand)" : "var(--text-strong)",
        letterSpacing: "-0.02em",
      }}>
        {value}
      </span>
    </div>
  )
}
