"use client"

import { useState } from "react"

import { FileSignature } from "lucide-react"
import { Button } from "@kipo/ui-react"

import { useConfirmManifiesto } from "../hooks/useConfirmManifiesto"

import type { UIFiscalSettings } from "./types"

interface ManifiestoSettingsSectionProps {
  data: UIFiscalSettings | null
}

export function ManifiestoSettingsSection({ data }: ManifiestoSettingsSectionProps) {
  const { error } = useConfirmManifiesto()
  const [expanded, setExpanded] = useState(false)

  const noFiscalData = data === null
  const signed = data?.manifiestoSigned ?? false

  return (
    <div style={{
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-soft)",
      padding: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: "var(--radius-md)",
          background: signed ? "var(--kipo-success-bg)" : "var(--surface-muted)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <FileSignature size={18} style={{ color: signed ? "var(--kipo-success)" : "var(--text-muted)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", margin: 0 }}>
            {signed ? "Carta Manifiesto firmada" : "Carta Manifiesto sin firmar"}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "var(--font-body)" }}>
            {noFiscalData
              ? "Completa tus datos fiscales primero."
              : signed
                ? "Ya confirmaste la firma de tu Carta Manifiesto."
                : "Firma tu Carta Manifiesto con tu e.firma (FIEL)."}
          </p>
        </div>
        {!signed && (
          <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)} disabled={noFiscalData} className="shrink-0">
            {expanded ? "Ocultar" : "Firmar"}
          </Button>
        )}
      </div>

      {!signed && expanded && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: "var(--radius-md)",
              background: "var(--kipo-danger-bg)", color: "var(--kipo-danger)", fontSize: 13,
              fontFamily: "var(--font-body)",
            }}>
              {error}
            </div>
          )}
          <iframe
            src="https://www.facturapi.io/embedded/manifiesto"
            style={{ width: "100%", height: 480, border: "1px solid var(--border-soft)", borderRadius: "var(--radius-md)" }}
            title="Firma de Carta Manifiesto"
          />
        </div>
      )}
    </div>
  )
}
