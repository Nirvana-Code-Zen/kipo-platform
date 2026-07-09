"use client"

import { useState } from "react"

import { Button } from "@kipo/ui-react"

import { AuthInput } from "@/src/auth/ui/components/AuthInput"
import { TAX_REGIMES } from "@/src/settings/ui/data/catalogs"
import { useSaveFiscalSettings } from "@/src/settings/ui/hooks/useSaveFiscalSettings"

interface FiscalDataStepProps {
  onSaved: () => void
  onSkip: () => void
}

const containerStyle: React.CSSProperties = {
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--bg-base)",
  padding: "24px 16px",
}

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
}

const stepLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--brand)",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  marginBottom: 8,
}

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 32,
  color: "var(--text-strong)",
  letterSpacing: "-0.03em",
  lineHeight: 1.15,
  marginBottom: 10,
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: "var(--text-muted)",
  fontFamily: "var(--font-body)",
  lineHeight: 1.5,
}

const errorBannerStyle: React.CSSProperties = {
  background: "var(--kipo-danger-bg)",
  border: "1.5px solid var(--kipo-danger)",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 13,
  color: "var(--kipo-danger)",
  fontFamily: "var(--font-body)",
  marginBottom: 20,
}

const selectStyle: React.CSSProperties = {
  background: "var(--bg-subtle)",
  border: "1.5px solid transparent",
  borderRadius: 14,
  padding: "14px 16px",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  color: "var(--text-strong)",
  outline: "none",
  cursor: "pointer",
  width: "100%",
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "var(--text-muted)",
  fontFamily: "var(--font-body)",
  marginBottom: 12,
  textTransform: "uppercase",
}

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-muted)",
  fontFamily: "var(--font-body)",
  marginTop: 4,
}

const RFC_REGEX = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/
const CP_REGEX = /^\d{5}$/

export function FiscalDataStep({ onSaved, onSkip }: FiscalDataStepProps) {
  const [rfc, setRfc] = useState("")
  const [razonSocial, setRazonSocial] = useState("")
  const [regimenFiscal, setRegimenFiscal] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [series, setSeries] = useState("")
  const [folioSiguiente, setFolioSiguiente] = useState(1)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { save, isSaving, error } = useSaveFiscalSettings()

  async function handleSubmit() {
    if (!RFC_REGEX.test(rfc)) {
      setValidationError("El RFC no tiene un formato válido.")
      return
    }
    if (!razonSocial.trim()) {
      setValidationError("La razón social es requerida.")
      return
    }
    if (!regimenFiscal) {
      setValidationError("Selecciona un régimen fiscal.")
      return
    }
    if (!CP_REGEX.test(codigoPostal)) {
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
    <div style={containerStyle}>
      <div style={cardStyle}>
        <p style={stepLabelStyle}>Paso 3 de 3</p>
        <h1 style={headingStyle}>Configura tu perfil fiscal</h1>
        <p style={{ ...subtitleStyle, marginBottom: 32 }}>
          Podrás editarlos en cualquier momento desde Ajustes.
        </p>

        {displayError && <div style={errorBannerStyle}>{displayError}</div>}

        <p style={{ ...sectionLabelStyle, marginTop: 0 }}>Datos del emisor</p>

        <div style={{ marginBottom: 16 }}>
          <AuthInput
            label="RFC"
            value={rfc}
            onChange={(e) => setRfc(e.target.value.toUpperCase())}
            maxLength={13}
          />
          <p style={hintStyle}>12 caracteres (moral) o 13 (física)</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <AuthInput
            label="Razón social"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            placeholder="Como aparece en la CSF"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <select
            style={selectStyle}
            value={regimenFiscal}
            onChange={(e) => setRegimenFiscal(e.target.value)}
          >
            <option value="" disabled>
              Seleccionar...
            </option>
            {TAX_REGIMES.map((regime) => (
              <option key={regime.code} value={regime.code}>
                {regime.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <AuthInput
            label="Código postal"
            value={codigoPostal}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "")
              setCodigoPostal(val)
            }}
            maxLength={5}
          />
        </div>

        <p style={{ ...sectionLabelStyle, marginTop: 24 }}>Configuración de folio</p>

        <div style={{ marginBottom: 16 }}>
          <AuthInput
            label="Serie"
            value={series}
            onChange={(e) => setSeries(e.target.value.toUpperCase())}
            placeholder="ej. A, FAC, 2026"
          />
          <p style={hintStyle}>Opcional</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <AuthInput
            label="Folio inicial"
            type="number"
            value={String(folioSiguiente)}
            onChange={(e) => setFolioSiguiente(Math.max(1, Number(e.target.value)))}
            min={1}
          />
          <p style={hintStyle}>El número con el que arrancará tu primera factura</p>
        </div>

        <Button onClick={handleSubmit} disabled={isSaving} style={{ width: "100%" }}>
          {isSaving ? "Guardando..." : "Guardar y continuar"}
        </Button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={onSkip}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: 13,
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Omitir por ahora
          </button>
        </div>
      </div>
    </div>
  )
}
