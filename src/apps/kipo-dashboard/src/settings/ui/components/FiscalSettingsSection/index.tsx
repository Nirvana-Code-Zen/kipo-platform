"use client"

import { Building2 } from "lucide-react"
import { Button } from "@kipo/ui-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"

import type { FiscalSettingsSectionProps, DataRowProps } from "./types"

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-t border-[var(--border-soft)]">
      <div className="w-20 h-[11px] rounded animate-pulse bg-muted" />
      <div className="w-[140px] h-[11px] rounded animate-pulse bg-muted" />
    </div>
  )
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex items-baseline gap-2 px-5 py-2.5 border-t border-[var(--border-soft)]">
      <span className="text-xs shrink-0 min-w-[110px] text-muted-foreground font-sans">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground font-sans">
        {value}
      </span>
    </div>
  )
}

export function FiscalSettingsSection({ data, isLoading, onEdit }: FiscalSettingsSectionProps) {
  const { regimenFiscal } = useCatalogs()

  if (isLoading) {
    return (
      <div className="overflow-hidden bg-card rounded-lg border border-[var(--border-soft)]">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="w-[120px] h-[11px] rounded animate-pulse bg-muted" />
        </div>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    )
  }

  if (data === null) {
    return (
      <div className="flex items-center gap-4 px-5 py-6 bg-card rounded-lg border border-[var(--border-soft)]">
        <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-md bg-muted">
          <Building2 size={18} className="text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold m-0 text-foreground">
            Datos fiscales sin configurar
          </p>
          <p className="text-xs mt-1 text-muted-foreground font-sans">
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
    <div className="overflow-hidden bg-card rounded-lg border border-[var(--border-soft)]">
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
