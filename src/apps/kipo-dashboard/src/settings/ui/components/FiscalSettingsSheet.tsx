"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

import { Button, Input } from "@kipo/ui-react"
import { X, CheckCircle2, AlertCircle, Building2, User } from "lucide-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"
import { detectRfcType, RFC_TYPE_LABEL } from "@/src/shared/domain/rfc"

import { useSaveFiscalSettings } from "../hooks/useSaveFiscalSettings"

import type { UIFiscalSettings } from "./types"

interface FiscalSettingsSheetProps {
  isOpen: boolean
  onClose: () => void
  initial: UIFiscalSettings | null
  onSaved: (data: UIFiscalSettings) => void
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

function rfcIsValid(rfc: string): boolean {
  return /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(rfc)
}

export function FiscalSettingsSheet({ isOpen, onClose, initial, onSaved }: FiscalSettingsSheetProps) {
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
    }
  }, [isOpen, initial])

  if (!isOpen) return null

  function validate(): boolean {
    const next: Partial<Record<string, string>> = {}
    if (!rfcIsValid(rfc)) next.rfc = "RFC inválido (12 chars moral / 13 chars física)"
    if (!razonSocial.trim()) next.razonSocial = "Requerido"
    if (!regimenFiscal) next.regimenFiscal = "Selecciona un régimen"
    if (!/^\d{5}$/.test(codigoPostal.trim())) next.codigoPostal = "5 dígitos requeridos"
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
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
      onClose()
    }
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
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border" style={{
            background: "var(--kipo-danger-bg)",
            borderColor: "var(--kipo-danger)",
            color: "var(--kipo-danger)",
            fontFamily: "var(--font-body)",
          }}>
            {error}
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

              <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <SectionTitle>Datos del emisor</SectionTitle>

                <div>
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
                        ? <AlertCircle size={13} style={{ color: "var(--kipo-danger)", flexShrink: 0 }} />
                        : rfcType === "natural"
                          ? <User size={13} style={{ color: "var(--brand)", flexShrink: 0 }} />
                          : <Building2 size={13} style={{ color: "var(--brand)", flexShrink: 0 }} />
                      }
                      <span
                        className="text-[12px] font-semibold font-sans"
                        style={{ color: rfcType === "invalid" ? "var(--kipo-danger)" : "var(--brand)" }}
                      >
                        {RFC_TYPE_LABEL[rfcType]}
                      </span>
                    </div>
                  )}
                </div>

                <Input
                  label="Razón social"
                  placeholder="Como aparece en la CSF"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))}
                  error={fieldErrors.razonSocial}
                  autoComplete="off"
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{
                    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
                    color: "var(--text-strong)",
                  }}>
                    Régimen fiscal
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={regimenFiscal}
                      onChange={(e) => setRegimenFiscal(e.target.value)}
                      style={{
                        width: "100%",
                        appearance: "none",
                        background: "var(--surface-card)",
                        border: `1.5px solid ${fieldErrors.regimenFiscal ? "var(--kipo-danger)" : "var(--border-strong)"}`,
                        borderRadius: "var(--radius-md)",
                        padding: "12px 40px 12px 14px",
                        fontSize: 15,
                        fontFamily: "var(--font-body)",
                        color: regimenFiscal ? "var(--text-strong)" : "var(--text-muted)",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="" disabled style={{ color: "var(--text-muted)" }}>
                        Seleccionar...
                      </option>
                      {regimenFiscalCatalog.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.code} · {r.description}
                        </option>
                      ))}
                    </select>
                    <span style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      pointerEvents: "none", color: "var(--text-muted)", fontSize: 12,
                    }}>
                      ▾
                    </span>
                  </div>
                  {fieldErrors.regimenFiscal && (
                    <span style={{ fontSize: 12, color: "var(--kipo-danger)" }}>
                      {fieldErrors.regimenFiscal}
                    </span>
                  )}
                </div>

                <Input
                  label="Código postal"
                  placeholder="00000"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  error={fieldErrors.codigoPostal}
                  mono
                  maxLength={5}
                />
              </section>

              <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

              <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
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
        </div>
      </div>
    </div>,
    document.body
  )
}
