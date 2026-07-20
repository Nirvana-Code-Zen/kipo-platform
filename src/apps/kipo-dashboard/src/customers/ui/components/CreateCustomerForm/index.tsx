"use client"

import { Button, Input, Switch } from "@kipo/ui-react"
import { CheckCircle2, AlertCircle, Building2, User } from "lucide-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"

import { useCustomerForm, RFC_TYPE_LABEL } from "../../hooks/useCustomerForm"
import { AVATARS } from "../../data/catalogs"
import { capitalizeWords } from "./constants"

import type { CreateCustomerFormProps, StyledSelectProps, AvatarPickerProps } from "./types"

function StyledSelect({ label, value, onChange, options, error, placeholder = "Seleccionar..." }: StyledSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold font-sans text-foreground">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-card rounded-md px-3.5 py-3 pr-10 text-[15px] font-sans outline-none cursor-pointer border-[1.5px] ${
            error ? "border-destructive" : "border-border-strong"
          } ${value ? "text-foreground" : "text-muted-foreground"}`}
        >
          <option value="" disabled className="text-muted-foreground">{placeholder}</option>
          {options.map((o) => (
            <option key={o.code} value={o.code}>{o.label}</option>
          ))}
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▾</span>
      </div>
      {error && <span className="text-xs text-[var(--kipo-danger)]">{error}</span>}
    </div>
  )
}

function AvatarPicker({ selected, initials, onChange }: AvatarPickerProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-semibold font-sans text-foreground">
        Avatar <span className="text-muted-foreground font-normal">(opcional)</span>
      </span>
      <div className="flex gap-3 items-center flex-wrap">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shrink-0 border-2 transition-all ${
            selected === null
              ? "border-[var(--brand)] bg-[var(--surface-brand-soft)] shadow-[0_0_0_3px_var(--focus-ring)]"
              : "border-border-strong bg-muted"
          }`}
        >
          <span className={`font-display font-bold text-base tracking-[-0.02em] ${selected === null ? "text-[var(--brand)]" : "text-muted-foreground"}`}>
            {initials || "?"}
          </span>
        </button>

        {AVATARS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onChange(url)}
            className={`w-14 h-14 rounded-full p-0.5 cursor-pointer shrink-0 border-2 transition-all bg-transparent ${
              selected === url
                ? "border-[var(--brand)] shadow-[0_0_0_3px_var(--focus-ring)]"
                : "border-transparent"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover block"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-bold font-sans text-muted-foreground uppercase tracking-[0.06em]">
        {children}
      </span>
      <div className="flex-1 h-px bg-[var(--border-soft)]" />
    </div>
  )
}

export function CreateCustomerForm({ onSubmit, onCancel, initialValues, submitLabel }: CreateCustomerFormProps) {
  const form = useCustomerForm({ initialValues })
  const { regimenFiscal } = useCatalogs()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.validate()) return
    onSubmit(form.buildCustomer())
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-7">

        <AvatarPicker
          selected={form.avatarUrl}
          initials={form.initials}
          onChange={form.setAvatarUrl}
        />

        <section className="flex flex-col gap-4">
          <SectionTitle>Datos generales</SectionTitle>

          <Input
            label="Nombre o razón social"
            placeholder="Como aparece en la Constancia de Situación Fiscal"
            value={form.legalName}
            onChange={(e) => form.setLegalName(capitalizeWords(e.target.value))}
            error={form.errors.legalName}
            autoComplete="off"
          />

          <div className="grid grid-cols-2 gap-3">
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

        <section className="flex flex-col gap-4">
          <SectionTitle>Datos fiscales</SectionTitle>

          <div className="flex flex-col gap-1.5">
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
              <div className="flex items-center gap-1.5">
                {form.rfcType === "invalid"
                  ? <AlertCircle size={13} className="text-[var(--kipo-danger)] shrink-0" />
                  : form.rfcType === "natural"
                    ? <User size={13} className="text-[var(--brand)] shrink-0" />
                    : <Building2 size={13} className="text-[var(--brand)] shrink-0" />
                }
                <span className={`text-xs font-semibold font-sans ${form.rfcType === "invalid" ? "text-[var(--kipo-danger)]" : "text-[var(--brand)]"}`}>
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
            <StyledSelect
              label="Régimen fiscal"
              value={form.taxRegime}
              onChange={form.setTaxRegime}
              options={regimenFiscal.map((r) => ({ code: r.code, label: `${r.code} - ${r.description}` }))}
              error={form.errors.taxRegime}
            />
          )}
        </section>

        <div className="flex items-center justify-between px-4 py-3.5 rounded-md bg-muted border-[1.5px] border-[var(--border-soft)]">
          <div>
            <p className="font-sans font-semibold text-sm text-foreground m-0">Estado</p>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">
              {form.activeStatus ? "Cliente activo" : "Cliente inactivo"}
            </p>
          </div>
          <Switch checked={form.activeStatus} onChange={form.setActiveStatus} />
        </div>

        <div className="flex gap-2.5 pt-1">
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
