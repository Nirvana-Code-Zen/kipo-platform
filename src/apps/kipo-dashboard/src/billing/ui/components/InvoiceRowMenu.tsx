"use client"

import { useRef } from "react"

import { Eye, Ban, Trash2 } from "lucide-react"

import { useClickOutside } from "@/src/shared/ui/hooks/useClickOutside"

import type { InvoiceStatus } from "./types"

interface InvoiceRowMenuProps {
  isOpen: boolean
  onClose: () => void
  status: InvoiceStatus
  onViewDetails: () => void
  onCancel: () => void
  onDelete: () => void
}

export function InvoiceRowMenu({
  isOpen,
  onClose,
  status,
  onViewDetails,
  onCancel,
  onDelete,
}: InvoiceRowMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, onClose)

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-xl border border-border bg-card shadow-lg py-1.5 animate-in fade-in zoom-in-95 duration-150"
    >
      <MenuItem icon={<Eye className="w-4 h-4" />} label="Ver detalles" onClick={() => { onViewDetails(); onClose() }} />

      {status === "stamped" && (
        <>
          <div className="my-1 border-t border-border" />
          <MenuItem
            icon={<Ban className="w-4 h-4" />}
            label="Cancelar"
            onClick={() => { onCancel(); onClose() }}
            tone="warning"
          />
        </>
      )}

      {status === "draft" && (
        <>
          <div className="my-1 border-t border-border" />
          <MenuItem
            icon={<Trash2 className="w-4 h-4" />}
            label="Eliminar"
            onClick={() => { onDelete(); onClose() }}
            tone="danger"
          />
        </>
      )}
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  tone,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  tone?: "warning" | "danger"
}) {
  const color =
    tone === "danger"
      ? "var(--kipo-danger)"
      : tone === "warning"
      ? "var(--kipo-warning)"
      : "var(--text-body)"

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
      style={{ color }}
    >
      {icon}
      {label}
    </button>
  )
}
