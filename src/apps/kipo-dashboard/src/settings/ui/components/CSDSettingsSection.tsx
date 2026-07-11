"use client"

import { ShieldCheck, HelpCircle } from "lucide-react"
import { Button, Tooltip } from "@kipo/ui-react"

import type { UIFiscalSettings } from "./types"

interface CSDSettingsSectionProps {
  data: UIFiscalSettings | null
  isLoading: boolean
  onEdit: () => void
}

const CSD_HELP_TEXT =
  "El CSD (Certificado de Sello Digital) es un archivo que el SAT te entrega para firmar tus facturas electrónicamente. Necesitas tu archivo .cer, tu archivo .key y la contraseña de la llave privada, obtenidos desde el portal del SAT."

function CSDHelpTooltip() {
  return (
    <Tooltip content={CSD_HELP_TEXT}>
      <button
        type="button"
        aria-label="¿Qué es un CSD?"
        style={{ display: "inline-flex", border: "none", background: "none", padding: 0, cursor: "pointer" }}
      >
        <HelpCircle size={14} style={{ color: "var(--text-muted)" }} />
      </button>
    </Tooltip>
  )
}

export function CSDSettingsSection({ data, isLoading, onEdit }: CSDSettingsSectionProps) {
  if (isLoading) {
    return (
      <div style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-soft)",
        padding: "24px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "var(--radius-md)",
          background: "var(--surface-muted)", animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0,
        }} />
        <div style={{ width: 160, height: 11, borderRadius: 4, background: "var(--surface-muted)", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    )
  }

  const noFiscalData = data === null
  const configured = data?.csdConfigured ?? false

  return (
    <div style={{
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-soft)",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: "var(--radius-md)",
        background: configured ? "var(--kipo-success-bg)" : "var(--surface-muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <ShieldCheck size={18} style={{ color: configured ? "var(--kipo-success)" : "var(--text-muted)" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", margin: 0 }}>
            {configured ? "CSD configurado" : "Certificado (CSD) sin configurar"}
          </p>
          <CSDHelpTooltip />
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "var(--font-body)" }}>
          {noFiscalData
            ? "Completa tus datos fiscales primero."
            : configured
              ? "Tu certificado digital está listo para timbrar."
              : "Sube tu CSD del SAT para poder timbrar facturas."}
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit} disabled={noFiscalData} className="shrink-0">
        {configured ? "Editar" : "Configurar"}
      </Button>
    </div>
  )
}
