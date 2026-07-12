"use client"

import { useState } from "react"

import { Button } from "@kipo/ui-react"
import { AlertCircle, Building2, User } from "lucide-react"

import { AuthInput } from "@/src/auth/ui/components/AuthInput"
import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"
import { useSaveFiscalSettings } from "@/src/settings/ui/hooks/useSaveFiscalSettings"
import { detectRfcType, RFC_TYPE_LABEL } from "@/src/shared/domain/rfc"

interface FiscalDataStepProps {
  onSaved: () => void
  onSkip: () => void
}

const CP_REGEX = /^\d{5}$/

export function FiscalDataStep({ onSaved, onSkip }: FiscalDataStepProps) {
  const [rfc, setRfc] = useState("")
  const [rfcBlurred, setRfcBlurred] = useState(false)
  const [razonSocial, setRazonSocial] = useState("")
  const [regimenFiscal, setRegimenFiscal] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [series, setSeries] = useState("")
  const [folioSiguiente, setFolioSiguiente] = useState(1)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { save, isSaving, error } = useSaveFiscalSettings()
  const { regimenFiscal: regimenFiscalCatalog } = useCatalogs()

  const rfcType = detectRfcType(rfc)
  const rfcValid = rfcType === "natural" || rfcType === "legal"
  const showRfcIndicator = rfcType !== "empty" && (rfcValid || rfcBlurred)
  const canSubmit = rfcValid && razonSocial.trim().length > 0 && regimenFiscal.length > 0

  async function handleSubmit() {
    if (!rfcValid) return
    if (!razonSocial.trim()) {
      setValidationError("La razón social es requerida.")
      return
    }
    if (!regimenFiscal) {
      setValidationError("Selecciona un régimen fiscal.")
      return
    }
    if (codigoPostal && !CP_REGEX.test(codigoPostal)) {
      setValidationError("El código postal debe tener 5 dígitos.")
      return
    }

    setValidationError(null)

    const result = await save({ rfc, razonSocial, regimenFiscal, codigoPostal, series, folioSiguiente })
    if (result !== null) {
      onSaved()
    }
  }

  const displayError = validationError ?? error

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-6">
      <div className="w-full max-w-[480px]">
        <p className="text-[13px] text-primary font-sans font-semibold mb-2">Paso 3 de 3</p>
        <h1 className="font-display font-bold text-[32px] text-foreground tracking-[-0.03em] leading-[1.15] mb-2.5">
          Configura tu perfil fiscal
        </h1>
        <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-8">
          Podrás editarlos en cualquier momento desde Ajustes.
        </p>

        {displayError && (
          <div
            className="bg-danger-soft border-destructive rounded-xl px-3.5 py-2.5 text-[13px] text-destructive font-sans mb-5"
            style={{ borderWidth: "1.5px", borderStyle: "solid" }}
          >
            {displayError}
          </div>
        )}

        <p className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground font-sans mb-3 uppercase">
          Datos del emisor
        </p>

        <div className="mb-4">
          <AuthInput
            label="RFC"
            showLabel
            value={rfc}
            onChange={(e) => setRfc(e.target.value.toUpperCase().replace(/[^A-ZÑ&0-9]/g, "").slice(0, 13))}
            onBlur={() => setRfcBlurred(true)}
            maxLength={13}
          />
          {showRfcIndicator ? (
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
          ) : (
            <p className="text-xs text-muted-foreground font-sans mt-1">
              12 caracteres (moral) o 13 (física)
            </p>
          )}
        </div>

        <div className="mb-4">
          <AuthInput
            label="Razón social"
            showLabel
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))}
            placeholder="Como aparece en la CSF"
          />
        </div>

        <div className="mb-4">
          <label className="text-[13px] font-semibold text-muted-foreground font-sans mb-1 block">
            Régimen fiscal
          </label>
          <select
            className="bg-muted border-transparent rounded-[14px] px-4 py-3.5 text-sm font-sans text-foreground outline-none cursor-pointer w-full"
            style={{ borderWidth: "1.5px", borderStyle: "solid" }}
            value={regimenFiscal}
            onChange={(e) => setRegimenFiscal(e.target.value)}
          >
            <option value="" disabled>
              Seleccionar...
            </option>
            {regimenFiscalCatalog.map((regime) => (
              <option key={regime.code} value={regime.code}>
                {regime.description}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <AuthInput
            label="Código postal"
            showLabel
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value.replace(/\D/g, ""))}
            maxLength={5}
          />
        </div>

        <p className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground font-sans mb-3 uppercase mt-6">
          Configuración de folio
        </p>

        <div className="mb-4">
          <AuthInput
            label="Serie"
            showLabel
            value={series}
            onChange={(e) => setSeries(e.target.value.toUpperCase())}
            placeholder="ej. A, FAC, 2026"
          />
          <p className="text-xs text-muted-foreground font-sans mt-1">Opcional</p>
        </div>

        <div className="mb-8">
          <AuthInput
            label="Folio inicial"
            showLabel
            type="number"
            value={String(folioSiguiente)}
            onChange={(e) => setFolioSiguiente(Math.max(1, Number(e.target.value)))}
            min={1}
          />
          <p className="text-xs text-muted-foreground font-sans mt-1">El número con el que arrancará tu primera factura</p>
        </div>

        <Button onClick={handleSubmit} disabled={isSaving || !canSubmit} full>
          {isSaving ? "Guardando..." : "Guardar y continuar"}
        </Button>

        <div className="text-center mt-4">
          <button
            onClick={onSkip}
            className="bg-transparent border-0 p-0 text-[13px] text-muted-foreground font-sans underline cursor-pointer"
          >
            Omitir por ahora
          </button>
        </div>
      </div>
    </div>
  )
}
