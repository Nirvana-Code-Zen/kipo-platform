"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

import { Button, Input } from "@kipo/ui-react"
import { X, CheckCircle2, AlertCircle, Building2, User } from "lucide-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"
import { detectRfcType, RFC_TYPE_LABEL } from "@/src/shared/domain/rfc"
import { scrollToFirstFormError } from "@/src/shared/ui/lib/scrollToFirstFormError"

import { useSaveFiscalSettings } from "../../hooks/useSaveFiscalSettings"
import { EmisorSetupNextStepPrompt } from "../EmisorSetupNextStepPrompt"
import { getNextEmisorSetupStep } from "../shared/getMissingSetupPath"

import type { FiscalSettingsSheetProps } from "./types"
import type { UIFiscalSettings } from "../shared/types"
import type { EmisorSetupStepInfo } from "../shared/getMissingSetupPath"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans font-bold text-[13px] text-muted-foreground uppercase tracking-[0.06em]">
        {children}
      </span>
      <div className="flex-1 h-px bg-[var(--border-soft)]" />
    </div>
  )
}

function rfcIsValid(rfc: string): boolean {
  return /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(rfc)
}

const FISCAL_FIELD_ORDER = ['rfc', 'razonSocial', 'regimenFiscal', 'codigoPostal'] as const

export function FiscalSettingsSheet({ isOpen, onClose, initial, onSaved, onContinueToNextStep }: FiscalSettingsSheetProps) {
  const { save, isSaving, error } = useSaveFiscalSettings()
  const { regimenFiscal: regimenFiscalCatalog } = useCatalogs()

  const [rfc, setRfc] = useState("")
  const [razonSocial, setRazonSocial] = useState("")
  const [regimenFiscal, setRegimenFiscal] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [series, setSeries] = useState("")
  const [folioInicial, setFolioInicial] = useState("1")

  const [rfcBlurred, setRfcBlurred] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({})
  const [nextStep, setNextStep] = useState<EmisorSetupStepInfo | null>(null)
  const formScrollRef = useRef<HTMLDivElement>(null)

  const rfcType = detectRfcType(rfc)
  const rfcValid = rfcType === "natural" || rfcType === "legal"
  const showRfcIndicator = rfcType !== "empty" && (rfcValid || rfcBlurred)

  const isNew = initial === null || initial.folioSiguiente === 1

  useEffect(() => {
    if (isOpen) {
      setRfc(initial?.rfc ?? "")
      setRazonSocial(initial?.razonSocial ?? "")
      setRegimenFiscal(initial?.regimenFiscal ?? "")
      setCodigoPostal(initial?.codigoPostal ?? "")
      setSeries(initial?.series ?? "")
      setFolioInicial(initial?.folioSiguiente?.toString() ?? "1")
      setFieldErrors({})
      setRfcBlurred(false)
      setNextStep(null)
    }
  }, [isOpen, initial])

  if (!isOpen) return null

  function collectValidationErrors(): Partial<Record<string, string>> {
    const next: Partial<Record<string, string>> = {}
    if (!rfcIsValid(rfc)) next.rfc = "RFC inválido (12 chars moral / 13 chars física)"
    if (!razonSocial.trim()) next.razonSocial = "Requerido"
    if (!regimenFiscal) next.regimenFiscal = "Selecciona un régimen"
    if (!/^\d{5}$/.test(codigoPostal.trim())) next.codigoPostal = "5 dígitos requeridos"
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = collectValidationErrors()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      requestAnimationFrame(() => {
        scrollToFirstFormError(formScrollRef.current, FISCAL_FIELD_ORDER, errors)
      })
      return
    }
    const payload: UIFiscalSettings = {
      rfc: rfc.trim().toUpperCase(),
      razonSocial: razonSocial.trim(),
      regimenFiscal,
      codigoPostal: codigoPostal.trim(),
      series: series.trim().toUpperCase(),
      folioSiguiente: initial?.folioSiguiente ?? (parseInt(folioInicial, 10) || 1),
    }
    const result = await save(payload)
    if (result) {
      onSaved(result)
      const pendingStep = getNextEmisorSetupStep(result)
      if (pendingStep && onContinueToNextStep) {
        setNextStep(pendingStep)
        return
      }
      onClose()
    }
  }

  function handleContinueToNextStep() {
    if (!nextStep) return
    onContinueToNextStep?.(nextStep.step)
    setNextStep(null)
    onClose()
  }

  function handleDismissNextStep() {
    setNextStep(null)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[92dvh]">
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-semibold text-base">
              {initial === null ? "Configurar datos fiscales" : "Editar datos fiscales"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Requerido para emitir facturas CFDI 4.0
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border bg-[var(--kipo-danger-bg)] border-[var(--kipo-danger)] text-[var(--kipo-danger)] font-sans">
            {error}
          </div>
        )}

        <div ref={formScrollRef} className="overflow-y-auto flex-1 px-5 py-5">
          {nextStep ? (
            <EmisorSetupNextStepPrompt
              savedMessage={nextStep.savedMessage}
              nextTitle={nextStep.nextTitle}
              nextDescription={nextStep.nextDescription}
              ctaLabel={nextStep.ctaLabel}
              onContinue={handleContinueToNextStep}
              onClose={handleDismissNextStep}
            />
          ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-7">

              <section className="flex flex-col gap-4">
                <SectionTitle>Datos del emisor</SectionTitle>

                <div data-form-field="rfc">
                  <Input
                    label="RFC"
                    placeholder="XAXX010101000"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase().replace(/[^A-ZÑ&0-9]/g, "").slice(0, 13))}
                    onBlur={() => setRfcBlurred(true)}
                    error={fieldErrors.rfc}
                    mono
                    maxLength={13}
                    autoComplete="off"
                    hint={showRfcIndicator ? undefined : "12 caracteres (moral) o 13 (física)"}
                  />
                  {showRfcIndicator && (
                    <div className="flex items-center gap-1.5 mt-1">
                      {rfcType === "invalid"
                        ? <AlertCircle size={13} className="text-[var(--kipo-danger)] shrink-0" />
                        : rfcType === "natural"
                          ? <User size={13} className="text-[var(--brand)] shrink-0" />
                          : <Building2 size={13} className="text-[var(--brand)] shrink-0" />
                      }
                      <span className={`text-[12px] font-semibold font-sans ${rfcType === "invalid" ? "text-[var(--kipo-danger)]" : "text-[var(--brand)]"}`}>
                        {RFC_TYPE_LABEL[rfcType]}
                      </span>
                    </div>
                  )}
                </div>

                <div data-form-field="razonSocial">
                <Input
                  label="Razón social"
                  placeholder="Como aparece en la CSF"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))}
                  error={fieldErrors.razonSocial}
                  autoComplete="off"
                />
                </div>

                <div data-form-field="regimenFiscal" className="flex flex-col gap-1.5">
                  <label className="font-sans font-semibold text-[13px] text-foreground">
                    Régimen fiscal
                  </label>
                  <div className="relative">
                    <select
                      value={regimenFiscal}
                      onChange={(e) => setRegimenFiscal(e.target.value)}
                      className={`w-full appearance-none bg-card rounded-md px-3.5 py-3 pr-10 text-[15px] font-sans cursor-pointer outline-none border-[1.5px] ${
                        fieldErrors.regimenFiscal ? "border-[var(--kipo-danger)]" : "border-[var(--border-strong)]"
                      } ${regimenFiscal ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      <option value="" disabled className="text-muted-foreground">
                        Seleccionar...
                      </option>
                      {regimenFiscalCatalog.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.code} · {r.description}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
                      ▾
                    </span>
                  </div>
                  {fieldErrors.regimenFiscal && (
                    <span className="text-xs text-[var(--kipo-danger)]">
                      {fieldErrors.regimenFiscal}
                    </span>
                  )}
                </div>

                <div data-form-field="codigoPostal">
                <Input
                  label="Código postal"
                  placeholder="00000"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  error={fieldErrors.codigoPostal}
                  mono
                  maxLength={5}
                />
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <SectionTitle>Configuración de folio</SectionTitle>

                <Input
                  label="Serie"
                  placeholder="ej. A, FAC, 2026"
                  value={series}
                  onChange={(e) => setSeries(e.target.value.toUpperCase().slice(0, 10))}
                  hint="Opcional"
                  mono
                  maxLength={10}
                  autoComplete="off"
                />

                {isNew && (
                  <Input
                    label="Folio inicial"
                    type="number"
                    placeholder="1"
                    value={folioInicial}
                    onChange={(e) => setFolioInicial(e.target.value)}
                    hint="El número con el que arrancará tu primera factura"
                    mono
                    min="1"
                  />
                )}
              </section>

              <div className="flex gap-2.5 pt-1">
                <Button type="button" variant="secondary" size="md" full onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="md" full disabled={isSaving}>
                  <CheckCircle2 size={15} />
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </div>

            </div>
          </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
