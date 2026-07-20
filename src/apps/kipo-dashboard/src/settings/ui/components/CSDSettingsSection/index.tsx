"use client"

import { ShieldCheck, HelpCircle } from "lucide-react"
import { Button, Tooltip } from "@kipo/ui-react"

import { CSD_HELP_TEXT } from "./constants"

import type { CSDSettingsSectionProps } from "./types"

function CSDHelpTooltip() {
  return (
    <Tooltip content={CSD_HELP_TEXT}>
      <button
        type="button"
        aria-label="¿Qué es un CSD?"
        className="inline-flex border-0 bg-transparent p-0 cursor-pointer"
      >
        <HelpCircle size={14} className="text-muted-foreground" />
      </button>
    </Tooltip>
  )
}

export function CSDSettingsSection({ data, isLoading, onEdit }: CSDSettingsSectionProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-[var(--border-soft)] px-5 py-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-muted animate-pulse shrink-0" />
        <div className="w-40 h-[11px] rounded bg-muted animate-pulse" />
      </div>
    )
  }

  const noFiscalData = data === null
  const configured = data?.csdConfigured ?? false

  return (
    <div className="bg-card rounded-lg border border-[var(--border-soft)] p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${configured ? "bg-[var(--kipo-success-bg)]" : "bg-muted"}`}>
        <ShieldCheck size={18} className={configured ? "text-[var(--kipo-success)]" : "text-muted-foreground"} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-foreground m-0">
            {configured ? "CSD configurado" : "Certificado (CSD) sin configurar"}
          </p>
          <CSDHelpTooltip />
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-sans">
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
