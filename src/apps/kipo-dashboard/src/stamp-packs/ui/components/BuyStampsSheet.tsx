"use client"

import { createPortal } from "react-dom"

import { X } from "lucide-react"
import { Button, StampCard } from "@kipo/ui-react"

import { useStampPackSelection } from "../hooks/useStampPackSelection"
import { useBuyStampPack } from "../hooks/useBuyStampPack"
import { isStampPackId } from "../../core/domain/value-objects/StampPackId"
import { STAMP_PACK_CATALOG } from "../data/stampPackCatalog"

interface BuyStampsSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function BuyStampsSheet({ isOpen, onClose }: BuyStampsSheetProps) {
  const { selectedPackId, setSelectedPackId } = useStampPackSelection(100)
  const { buy, isPurchasing, error } = useBuyStampPack()

  if (!isOpen) return null

  const selectedPack = STAMP_PACK_CATALOG.find((pack) => pack.id === selectedPackId) ?? null

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
            <h2 className="font-semibold text-base">Comprar timbres</h2>
            <p className="text-xs text-muted-foreground mt-1">Elige el paquete que más te convenga</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div
            className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border"
            style={{
              background: "var(--kipo-danger-bg)",
              borderColor: "var(--kipo-danger)",
              color: "var(--kipo-danger)",
              fontFamily: "var(--font-body)",
            }}
          >
            No se pudo completar la compra. Intenta de nuevo.
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STAMP_PACK_CATALOG.map((pack) => (
              <StampCard
                key={pack.id}
                qty={pack.qty}
                unitPrice={pack.unitPrice}
                label={pack.label}
                featured={pack.featured}
                selected={selectedPackId === pack.id}
                onSelect={(qty) => { if (isStampPackId(qty)) setSelectedPackId(qty) }}
              />
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex-shrink-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <Button
            onClick={() => selectedPack && buy(selectedPack.id)}
            disabled={!selectedPack || isPurchasing}
          >
            {isPurchasing ? "Procesando..." : `Comprar ${selectedPack?.qty ?? ""} timbres`}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
