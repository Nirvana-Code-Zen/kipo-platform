"use client"

import { createPortal } from "react-dom"

interface DeleteConfirmDialogProps {
  customerName: string | null
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ customerName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  if (customerName === null) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onCancel}
    >
      <div
        className="rounded-2xl border border-border p-6 shadow-xl w-full max-w-sm mx-4"
        style={{ background: "var(--surface-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold text-lg mb-2">Eliminar cliente</h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          ¿Eliminar a <span className="font-medium" style={{ color: "var(--text-default)" }}>{customerName}</span>? Esta acción no se puede deshacer.
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
            className="px-4 py-2 text-sm rounded-lg font-medium text-white transition-colors"
            style={{ background: "var(--color-destructive, #ef4444)" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
