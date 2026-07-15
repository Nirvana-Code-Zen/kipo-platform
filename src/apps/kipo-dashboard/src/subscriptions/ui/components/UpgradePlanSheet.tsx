"use client"

import { createPortal } from "react-dom"

import { X, Check } from "lucide-react"
import { Button } from "@kipo/ui-react"

import { useCreateCheckout } from "../hooks/useCreateCheckout"
import { UPGRADE_OPTIONS } from "../data/upgradeOptions"

interface UpgradePlanSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradePlanSheet({ isOpen, onClose }: UpgradePlanSheetProps) {
  const { checkout, isCreating, error } = useCreateCheckout()

  if (!isOpen) return null

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
            <h2 className="font-semibold text-base">Mejorar plan</h2>
            <p className="text-xs text-muted-foreground mt-1">Elige el plan que más te convenga</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border border-destructive text-destructive">
            No se pudo iniciar el pago. Intenta de nuevo.
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {UPGRADE_OPTIONS.map((option) => (
              <div
                key={option.tier}
                className="flex flex-col rounded-lg border border-border-subtle p-4"
              >
                <p className="font-semibold text-sm text-foreground">{option.name}</p>
                <p className="text-lg font-bold text-foreground mt-1">{option.priceLabel}</p>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>

                <ul className="flex flex-col gap-2 mt-4 mb-4 flex-1">
                  {option.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => checkout(option.tier)}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Procesando..." : `Elegir ${option.name}`}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
