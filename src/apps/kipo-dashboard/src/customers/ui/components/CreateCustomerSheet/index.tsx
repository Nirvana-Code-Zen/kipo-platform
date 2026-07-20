"use client"

import { useState } from "react"
import { createPortal } from "react-dom"

import { X } from "lucide-react"

import { CreateCustomerForm } from "../CreateCustomerForm"

import type { CreateCustomerSheetProps } from "./types"

export function CreateCustomerSheet({ isOpen, onClose, onSave }: CreateCustomerSheetProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(customer: Parameters<typeof onSave>[0]) {
    setApiError(null)
    const error = await onSave(customer)
    if (error) setApiError(error)
    else onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[92dvh]">
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-semibold text-base">Nuevo cliente</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Ingresa los datos fiscales del cliente</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {apiError && (
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 font-sans bg-[var(--kipo-danger-bg)] border-[1.5px] border-[var(--kipo-danger)] text-[var(--kipo-danger)]">
            {apiError}
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <CreateCustomerForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
