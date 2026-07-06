"use client"

import { useRef } from "react"

import { Trash2, ToggleLeft, ToggleRight, User } from "lucide-react"

import { useClickOutside } from "@/src/shared/ui/hooks/useClickOutside"

import type { CustomerStatus } from "./types"

interface CustomerCardMenuProps {
  isOpen: boolean
  onClose: () => void
  status: CustomerStatus
  onViewDetails: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

export function CustomerCardMenu({
  isOpen,
  onClose,
  status,
  onViewDetails,
  onToggleStatus,
  onDelete,
}: CustomerCardMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  useClickOutside(menuRef, onClose)

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 min-w-[170px] rounded-xl border border-border bg-card shadow-lg shadow-black/10 py-1 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <button
        onClick={() => { onViewDetails(); onClose() }}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <User className="w-4 h-4 text-muted-foreground" />
        Ver detalles
      </button>
      <div className="my-1 h-px bg-border" />
      <button
        onClick={() => { onToggleStatus(); onClose() }}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
      >
        {status === "active"
          ? <ToggleLeft className="w-4 h-4 text-muted-foreground" />
          : <ToggleRight className="w-4 h-4 text-primary" />
        }
        {status === "active" ? "Desactivar" : "Activar"}
      </button>
      <div className="my-1 h-px bg-border" />
      <button
        onClick={() => { onDelete(); onClose() }}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </button>
    </div>
  )
}
