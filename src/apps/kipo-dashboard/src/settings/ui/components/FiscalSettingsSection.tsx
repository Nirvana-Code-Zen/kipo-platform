"use client"

import { Building2 } from "lucide-react"
import { Button } from "@kipo/ui-react"

import { REGIMEN_FISCAL_LABELS } from "../data/catalogs"

import type { UIFiscalSettings } from "./types"

interface FiscalSettingsSectionProps {
  data: UIFiscalSettings | null
  isLoading: boolean
  onEdit: () => void
}

function SkeletonRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderTop: "1px solid var(--border-soft)" }}>
      <div style={{
        width: 80, height: 11, borderRadius: 4,
        background: "var(--surface-muted)",
        animation: "pulse 1.5s ease-in-out infinite",
      }} />
      <div style={{
        width: 140, height: 11, borderRadius: 4,
        background: "var(--surface-muted)",
        animation: "pulse 1.5s ease-in-out infinite",
      }} />
    </div>
  )
}

interface DataRowProps {
  label: string
  value: string
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 8,
      padding: "10px 20px",
      borderTop: "1px solid var(--border-soft)",
    }}>
      <span style={{
        fontSize: 12,
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
        minWidth: 110,
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-strong)",
        fontFamily: "var(--font-body)",
      }}>
        {value}
      </span>
    </div>
  )
}

export function FiscalSettingsSection({ data, isLoading, onEdit }: FiscalSettingsSectionProps) {
  if (isLoading) {
    return (
      <div style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-soft)",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
          <div style={{
            width: 120, height: 11, borderRadius: 4,
            background: "var(--surface-muted)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        </div>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    )
  }

  if (data === null) {
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
          width: 40, height: 40,
          borderRadius: "var(--radius-md)",
          background: "var(--surface-muted)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Building2 size={18} style={{ color: "var(--text-muted)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", margin: 0 }}>
            Datos fiscales sin configurar
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "var(--font-body)" }}>
            Configura tu RFC y datos del emisor para poder timbrar facturas.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit} className="shrink-0">
          Configurar
        </Button>
      </div>
    )
  }

  const lastFolio = data.folioSiguiente - 1
  const lastFolioDisplay = lastFolio > 0 ? lastFolio.toString().padStart(4, "0") : "—"
  const regimenLabel = REGIMEN_FISCAL_LABELS[data.regimenFiscal] ?? data.regimenFiscal

  return (
    <div style={{
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-soft)",
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: 0,
          fontFamily: "var(--font-body)",
        }}>
          Datos del emisor
        </p>
        <Button variant="ghost" size="sm" onClick={onEdit} className="text-muted-foreground shrink-0">
          Editar
        </Button>
      </div>
      <DataRow label="RFC" value={data.rfc} />
      <DataRow label="Razón social" value={data.razonSocial} />
      <DataRow label="Régimen fiscal" value={`${data.regimenFiscal} · ${regimenLabel}`} />
      <DataRow label="Código postal" value={data.codigoPostal} />
      <DataRow label="Serie" value={data.series || "Sin serie"} />
      <DataRow label="Folio actual" value={data.series ? `${data.series}-${lastFolioDisplay}` : lastFolioDisplay} />
    </div>
  )
}
