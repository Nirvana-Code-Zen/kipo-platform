"use client"

import { useState } from "react"

import { FileSignature } from "lucide-react"
import { Button } from "@kipo/ui-react"

import { useConfirmManifiesto } from "../../hooks/useConfirmManifiesto"

import type { ManifiestoSettingsSectionProps } from "./types"

export function ManifiestoSettingsSection({ data }: ManifiestoSettingsSectionProps) {
  const { error } = useConfirmManifiesto()
  const [expanded, setExpanded] = useState(false)

  const noFiscalData = data === null
  const signed = data?.manifiestoSigned ?? false

  return (
    <div className="bg-card rounded-lg border border-[var(--border-soft)] p-5">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${signed ? "bg-[var(--kipo-success-bg)]" : "bg-muted"}`}>
          <FileSignature size={18} className={signed ? "text-[var(--kipo-success)]" : "text-muted-foreground"} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground m-0">
            {signed ? "Carta Manifiesto firmada" : "Carta Manifiesto sin firmar"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
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
        <div className="mt-4 flex flex-col gap-3">
          {error && (
            <div className="px-3.5 py-2.5 rounded-md bg-[var(--kipo-danger-bg)] text-[var(--kipo-danger)] text-[13px] font-sans">
              {error}
            </div>
          )}
          <iframe
            src="https://www.facturapi.io/embedded/manifiesto"
            className="w-full h-[480px] border border-[var(--border-soft)] rounded-md"
            title="Firma de Carta Manifiesto"
          />
        </div>
      )}
    </div>
  )
}
