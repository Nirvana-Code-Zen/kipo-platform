"use client"

import { Palette } from "lucide-react"
import { Button } from "@kipo/ui-react"
import Image from "next/image"

import { hasCustomDisplayOptions } from "./constants"

import type { InvoiceCustomizationSectionProps } from "./types"

export function InvoiceCustomizationSection({ data, onEdit }: InvoiceCustomizationSectionProps) {
  const hasCustomHtml = Boolean(data?.customSectionHtml && data.customSectionHtml.trim().length > 0)
  const active = hasCustomHtml || hasCustomDisplayOptions(data?.displayOptions)

  return (
    <div className="bg-card rounded-lg border border-border-subtle p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${active ? "bg-primary/10" : "bg-muted"}`}>
        <Palette size={18} className={active ? "text-primary" : "text-muted-foreground"} />
      </div>
      {data?.logoUrl && (
        <Image
          src={data.logoUrl}
          alt="Logo de la empresa"
          height={32}
          width={32}
          className="h-8 w-8 object-contain rounded border border-border-subtle shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {active ? "Personalización activa" : "Sin personalizar"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Ajusta el contenido y las opciones de visualización de tus facturas en PDF.
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit} className="shrink-0">
        {active ? "Editar" : "Personalizar"}
      </Button>
    </div>
  )
}
