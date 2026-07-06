"use client"

import { useRef } from "react"

import { Button, Input } from "@kipo/ui-react"
import { CheckCircle2, Plus, Trash2, Search, X, User } from "lucide-react"

import { useClickOutside } from "@/src/shared/ui/hooks/useClickOutside"

import { useInvoiceForm } from "../hooks/useInvoiceForm"
import { useReceiverSearch } from "../hooks/useReceiverSearch"
import {
  VOUCHER_TYPES,
  PAYMENT_METHODS,
  PAYMENT_FORMS,
  CURRENCIES,
  EXPORT_TYPES,
  UNIT_CODES,
  TAX_OBJECTS,
  IVA_RATES,
} from "../data/catalogs"

import type { UIInvoice } from "./types"
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
  errorTaxId?: string
  errorName?: string
  onSelect: (suggestion: ReceiverSuggestion) => void
  onChangeTaxId: (v: string) => void
  onChangeName: (v: string) => void
  onClear: () => void
}

function ReceiverSearch({
  receiverTaxId,
  receiverName,
  errorTaxId,
  errorName,
  onSelect,
  onChangeTaxId,
  onChangeName,
  onClear,
}: ReceiverSearchProps) {
  const search = useReceiverSearch()
  const dropdownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropdownRef, () => search.setIsOpen(false))

  const isSelected = !!(receiverTaxId && receiverName)

  if (isSelected) {
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
            {receiverTaxId}
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

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "var(--text-strong)" }}>
          Buscar receptor
        </label>
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
      </div>

      {search.isOpen && search.suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
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
              onClick={() => {
                onSelect(s)
                onChangeTaxId(s.taxId)
                onChangeName(s.name)
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <Input
          label="RFC receptor"
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
      </div>
    </div>
  )
}


interface CreateInvoiceFormProps {
  onSubmit: (invoice: UIInvoice) => void
  onCancel: () => void
}

export function CreateInvoiceForm({ onSubmit, onCancel }: CreateInvoiceFormProps) {
  const form = useInvoiceForm()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.validate()) return
    onSubmit(form.buildInvoice())
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ── Sección 1: Datos del comprobante ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionTitle>Datos del comprobante</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StyledSelect
              label="Tipo de comprobante"
              value={form.voucherType}
              onChange={form.setVoucherType}
              options={VOUCHER_TYPES}
              error={form.errors.voucherType}
            />
            <Input
              label="Serie"
              placeholder="A"
              value={form.series}
              onChange={(e) => form.setSeries(e.target.value.toUpperCase().slice(0, 10))}
              hint="Opcional"
              mono
              autoComplete="off"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StyledSelect
              label="Método de pago"
              value={form.paymentMethod}
              onChange={form.setPaymentMethod}
              options={PAYMENT_METHODS}
              error={form.errors.paymentMethod}
            />
            {form.paymentMethod === "PUE" ? (
              <StyledSelect
                label="Forma de pago"
                value={form.paymentForm}
                onChange={form.setPaymentForm}
                options={PAYMENT_FORMS}
                error={form.errors.paymentForm}
              />
            ) : (
              <StyledSelect
                label="Forma de pago"
                value="99"
                onChange={() => {}}
                options={[{ code: "99", label: "99 - Por definir" }]}
                hint="Automático para PPD"
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
              label="CP emisor"
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

        {/* ── Sección 2: Receptor ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionTitle>Receptor</SectionTitle>

          <ReceiverSearch
            receiverTaxId={form.receiverTaxId}
            receiverName={form.receiverName}
            errorTaxId={form.errors.receiverTaxId}
            errorName={form.errors.receiverName}
            onSelect={() => {}}
            onChangeTaxId={form.setReceiverTaxId}
            onChangeName={form.setReceiverName}
            onClear={() => {
              form.setReceiverTaxId("")
              form.setReceiverName("")
            }}
          />
        </section>

        {/* ── Sección 3: Conceptos ── */}
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

                  <Input
                    label="Descripción"
                    placeholder="Servicio de desarrollo de software"
                    value={concept.description}
                    onChange={(e) => form.updateConcept(concept.id, "description", e.target.value)}
                    error={itemErr.description}
                    autoComplete="off"
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
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input
                      label="Clave producto/servicio"
                      placeholder="78101800"
                      value={concept.productServiceCode}
                      onChange={(e) => form.updateConcept(concept.id, "productServiceCode", e.target.value)}
                      error={itemErr.productServiceCode}
                      mono
                      hint="Catálogo SAT c_ClaveProdServ"
                    />
                    <StyledSelect
                      label="Clave unidad"
                      value={concept.unitCode}
                      onChange={(v) => form.updateConcept(concept.id, "unitCode", v)}
                      options={UNIT_CODES}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <StyledSelect
                      label="Objeto de impuesto"
                      value={concept.taxObject}
                      onChange={(v) => form.updateConcept(concept.id, "taxObject", v)}
                      options={TAX_OBJECTS}
                    />
                    {concept.taxObject === "02" && (
                      <StyledSelect
                        label="IVA"
                        value={concept.ivaRate}
                        onChange={(v) => form.updateConcept(concept.id, "ivaRate", v)}
                        options={IVA_RATES}
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
          <Button type="submit" variant="primary" size="md" full>
            <CheckCircle2 size={15} />
            Crear borrador
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
