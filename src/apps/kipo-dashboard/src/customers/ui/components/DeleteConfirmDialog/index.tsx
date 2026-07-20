"use client"

import { createPortal } from "react-dom"

import type { DeleteConfirmDialogProps } from "./types"

export function DeleteConfirmDialog({ customerName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  if (customerName === null) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className="rounded-2xl border border-border p-6 shadow-xl w-full max-w-sm mx-4 bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold text-lg mb-2">Eliminar cliente</h2>
        <p className="text-sm mb-6 text-muted-foreground">
          ¿Eliminar a <span className="font-medium text-foreground">{customerName}</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg font-medium text-white bg-destructive hover:opacity-90 transition-opacity"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
