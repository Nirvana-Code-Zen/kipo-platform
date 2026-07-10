"use client"

import { Building2 } from "lucide-react"
import { Button } from "@kipo/ui-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"

import type { UIFiscalSettings } from "./types"

interface FiscalSettingsSectionProps {
  data: UIFiscalSettings | null
  isLoading: boolean
  onEdit: () => void
}

function SkeletonRow() {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5"
      style={{ borderTop: "1px solid var(--border-soft)" }}
    >
      <div className="w-20 h-[11px] rounded animate-pulse" style={{ background: "var(--surface-muted)" }} />
      <div className="w-[140px] h-[11px] rounded animate-pulse" style={{ background: "var(--surface-muted)" }} />
    </div>
  )
}

interface DataRowProps {
  label: string
  value: string
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div
      className="flex items-baseline gap-2 px-5 py-2.5"
      style={{ borderTop: "1px solid var(--border-soft)" }}
    >
      <span
        className="text-xs shrink-0 min-w-[110px]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </span>
      <span
        className="text-sm font-medium"
        style={{ color: "var(--text-strong)", fontFamily: "var(--font-body)" }}
      >
        {value}
      </span>
    </div>
  )
}

export function FiscalSettingsSection({ data, isLoading, onEdit }: FiscalSettingsSectionProps) {
  const { regimenFiscal } = useCatalogs()

  if (isLoading) {
    return (
      <div
        className="overflow-hidden"
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-soft)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="w-[120px] h-[11px] rounded animate-pulse" style={{ background: "var(--surface-muted)" }} />
        </div>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    )
  }

  if (data === null) {
    return (
      <div
        className="flex items-center gap-4 px-5 py-6"
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-soft)",
        }}
      >
        <div
          className="w-10 h-10 flex items-center justify-center shrink-0"
          style={{ borderRadius: "var(--radius-md)", background: "var(--surface-muted)" }}
        >
          <Building2 size={18} style={{ color: "var(--text-muted)" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold m-0" style={{ color: "var(--text-strong)" }}>
            Datos fiscales sin configurar
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
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
  const regimenLabel = regimenFiscal.find((r) => r.code === data.regimenFiscal)?.description ?? data.regimenFiscal

  return (
    <div
      className="overflow-hidden"
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <Button variant="ghost" size="sm" onClick={onEdit} className="text-muted-foreground shrink-0">
        Editar
      </Button>
      <DataRow label="RFC" value={data.rfc} />
      <DataRow label="Razón social" value={data.razonSocial} />
      <DataRow label="Régimen fiscal" value={`${data.regimenFiscal} · ${regimenLabel}`} />
      <DataRow label="Código postal" value={data.codigoPostal} />
      <DataRow label="Serie" value={data.series || "Sin serie"} />
      <DataRow label="Folio actual" value={data.series ? `${data.series}-${lastFolioDisplay}` : lastFolioDisplay} />
    </div>
  )
}
