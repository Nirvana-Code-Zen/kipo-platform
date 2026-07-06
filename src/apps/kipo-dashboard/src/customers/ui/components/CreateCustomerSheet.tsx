"use client"

import { createPortal } from "react-dom"

import { X } from "lucide-react"

import { CreateCustomerForm } from "./CreateCustomerForm"

import type { Customer } from "./types"

interface CreateCustomerSheetProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customer: Customer) => void
}

export function CreateCustomerSheet({ isOpen, onClose, onSubmit }: CreateCustomerSheetProps) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[92dvh]">
        {/* Handle bar mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
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

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          <CreateCustomerForm
            onSubmit={(customer) => { onSubmit(customer); onClose() }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
