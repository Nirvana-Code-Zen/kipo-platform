"use client"

import { Button, Input, Switch } from "@kipo/ui-react"
import { CheckCircle2, AlertCircle, Building2, User } from "lucide-react"

import { useCustomerForm, RFC_TYPE_LABEL } from "../hooks/useCustomerForm"
import { TAX_REGIMES, AVATARS } from "../data/catalogs"

import type { Customer as UICustomer } from "./types"

interface StyledSelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: ReadonlyArray<{ code: string; label: string }>
  error?: string
  placeholder?: string
}

function StyledSelect({ label, value, onChange, options, error, placeholder = "Seleccionar..." }: StyledSelectProps) {
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
      {error && <span style={{ fontSize: 12, color: "var(--kipo-danger)" }}>{error}</span>}
    </div>
  )
}

interface AvatarPickerProps {
  selected: string | null
  initials: string
  onChange: (url: string | null) => void
}

function AvatarPicker({ selected, initials, onChange }: AvatarPickerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "var(--text-strong)" }}>
        Avatar <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span>
      </span>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onChange(null)}
          style={{
            width: 56, height: 56, borderRadius: "var(--radius-circle)",
            border: `2px solid ${selected === null ? "var(--brand)" : "var(--border-strong)"}`,
            background: selected === null ? "var(--surface-brand-soft)" : "var(--surface-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
            boxShadow: selected === null ? "0 0 0 3px var(--focus-ring)" : "none",
            transition: "all var(--dur-fast) var(--ease-out)",
          }}
        >
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
            color: selected === null ? "var(--brand)" : "var(--text-muted)",
            letterSpacing: "-0.02em",
          }}>
            {initials || "?"}
          </span>
        </button>

        {AVATARS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onChange(url)}
            style={{
              width: 56, height: 56, borderRadius: "var(--radius-circle)",
              border: `2px solid ${selected === url ? "var(--brand)" : "transparent"}`,
              padding: 2, cursor: "pointer", flexShrink: 0,
              boxShadow: selected === url ? "0 0 0 3px var(--focus-ring)" : "none",
              transition: "all var(--dur-fast) var(--ease-out)",
              background: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Avatar"
              style={{ width: "100%", height: "100%", borderRadius: "var(--radius-circle)", objectFit: "cover", display: "block" }}
            />
          </button>
        ))}
      </div>
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

interface CreateCustomerFormProps {
  onSubmit: (customer: UICustomer) => void
  onCancel: () => void
  initialValues?: UICustomer
  submitLabel?: string
}

export function CreateCustomerForm({ onSubmit, onCancel, initialValues, submitLabel }: CreateCustomerFormProps) {
  const form = useCustomerForm({ initialValues })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.validate()) return
    onSubmit(form.buildCustomer())
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        <AvatarPicker
          selected={form.avatarUrl}
          initials={form.initials}
          onChange={form.setAvatarUrl}
        />

        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionTitle>Datos generales</SectionTitle>

          <Input
            label="Nombre o razón social"
            placeholder="Como aparece en la Constancia de Situación Fiscal"
            value={form.legalName}
            onChange={(e) => form.setLegalName(e.target.value)}
            error={form.errors.legalName}
            autoComplete="off"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input
              label="Correo"
              type="email"
              placeholder="correo@empresa.com"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              error={form.errors.email}
              autoComplete="email"
            />
            <Input
              label="Teléfono"
              type="tel"
              placeholder="+52 55 0000 0000"
              value={form.phone}
              onChange={(e) => form.setPhone(e.target.value)}
              hint="Opcional"
              autoComplete="tel"
            />
          </div>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionTitle>Datos fiscales</SectionTitle>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Input
              label="RFC"
              placeholder="XXXX000000XX"
              value={form.taxId}
              onChange={(e) => form.setTaxId(e.target.value.toUpperCase())}
              error={form.errors.taxId}
              mono
              maxLength={13}
              autoComplete="off"
            />
            {form.rfcType !== "empty" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {form.rfcType === "invalid"
                  ? <AlertCircle size={13} style={{ color: "var(--kipo-danger)", flexShrink: 0 }} />
                  : form.rfcType === "natural"
                    ? <User size={13} style={{ color: "var(--brand)", flexShrink: 0 }} />
                    : <Building2 size={13} style={{ color: "var(--brand)", flexShrink: 0 }} />
                }
                <span style={{
                  fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 600,
                  color: form.rfcType === "invalid" ? "var(--kipo-danger)" : "var(--brand)",
                }}>
                  {RFC_TYPE_LABEL[form.rfcType]}
                </span>
              </div>
            )}
          </div>

          <Input
            label="Código postal"
            placeholder="00000"
            value={form.zipCode}
            onChange={(e) => form.setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
            error={form.errors.zipCode}
            mono
            maxLength={5}
          />

          {!form.isGenericRfc && (
            <>
              <StyledSelect
                label="Régimen fiscal"
                value={form.taxRegime}
                onChange={form.setTaxRegime}
                options={TAX_REGIMES.map((r) => ({ code: r.code, label: `${r.code} - ${r.label}` }))}
                error={form.errors.taxRegime}
              />
            </>
          )}
        </section>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", borderRadius: "var(--radius-md)",
          background: "var(--surface-muted)", border: "1.5px solid var(--border-soft)",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)", margin: 0 }}>
              Estado
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>
              {form.activeStatus ? "Cliente activo" : "Cliente inactivo"}
            </p>
          </div>
          <Switch checked={form.activeStatus} onChange={form.setActiveStatus} />
        </div>

        <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
          <Button type="button" variant="secondary" size="md" full onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" full>
            <CheckCircle2 size={15} />
            {submitLabel ?? "Crear cliente"}
          </Button>
        </div>
      </div>
    </form>
  )
}
