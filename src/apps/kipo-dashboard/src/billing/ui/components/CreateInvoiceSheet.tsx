"use client"

import { createPortal } from "react-dom"

import { AlertTriangle, Check, X } from "lucide-react"

import { useInvoiceForm } from "../hooks/useInvoiceForm"
import { useCreateInvoice } from "../hooks/useCreateInvoice"
import { useStampedInvoiceCount } from "../hooks/useStampedInvoiceCount"
import { CreateInvoiceForm } from "./CreateInvoiceForm"

import type { UIInvoice } from "./types"

interface CreateInvoiceSheetProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (invoice: UIInvoice) => void
}

export function CreateInvoiceSheet({ isOpen, onClose, onCreated }: CreateInvoiceSheetProps) {
  const form = useInvoiceForm()
  const { create, isSubmitting, apiError } = useCreateInvoice(onCreated)
  const { availableStamps } = useStampedInvoiceCount()

  if (!isOpen) return null

  const hasStamps = availableStamps !== null && availableStamps > 0
  const noStamps = availableStamps !== null && availableStamps === 0

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.validate()) return
    const ok = await create(form.buildCreateRequest())
    if (ok) onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-2xl bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[92dvh]">
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-semibold text-base">Nueva factura</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">
                {hasStamps ? "Se timbrará automáticamente" : "El borrador se puede timbrar después"}
              </p>
              {hasStamps && (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium"
                  style={{
                    background: "var(--surface-brand-soft)",
                    color: "var(--brand)",
                  }}
                >
                  <Check className="w-3 h-3" />
                  {availableStamps} timbres disponibles
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {noStamps && (
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 flex items-start gap-2.5 border" style={{
            background: "var(--kipo-warning-bg)",
            borderColor: "var(--kipo-warning)",
            color: "var(--kipo-warning)",
            fontFamily: "var(--font-body)",
          }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>No tienes timbres disponibles. La factura se guardará como borrador y podrás timbrarla cuando adquieras timbres.</span>
          </div>
        )}

        {apiError && (
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border" style={{
            background: "var(--kipo-danger-bg)",
            borderColor: "var(--kipo-danger)",
            color: "var(--kipo-danger)",
            fontFamily: "var(--font-body)",
          }}>
            {apiError}
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <CreateInvoiceForm
            form={form}
            onFormSubmit={handleFormSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            submitLabel={hasStamps ? "Timbrar factura" : "Crear borrador"}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
