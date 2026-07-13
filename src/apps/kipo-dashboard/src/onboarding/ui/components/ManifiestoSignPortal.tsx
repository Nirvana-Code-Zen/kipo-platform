"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { X } from "lucide-react"

import { useConfirmManifiesto } from "@/src/settings/ui/hooks/useConfirmManifiesto"

const FACTURAPI_ORIGIN = "https://www.facturapi.io"

interface ManifiestoSignPortalProps {
  isOpen: boolean
  onClose: () => void
  onSigned: () => void
}

export function ManifiestoSignPortal({ isOpen, onClose, onSigned }: ManifiestoSignPortalProps) {
  const { confirm, isConfirming, error } = useConfirmManifiesto()
  const [justSigned, setJustSigned] = useState(false)
  const handledRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    handledRef.current = false
    setJustSigned(false)

    async function handleMessage(event: MessageEvent) {
      if (event.origin !== FACTURAPI_ORIGIN || handledRef.current) return
      handledRef.current = true
      const result = await confirm()
      if (result) {
        setJustSigned(true)
        setTimeout(onSigned, 900)
      } else {
        handledRef.current = false
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [isOpen, confirm, onSigned])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-6">
      <div className="relative w-full h-full sm:rounded-2xl sm:shadow-2xl bg-card flex flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-semibold text-base text-foreground font-sans">Firma tu Carta Manifiesto</h2>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Firma con tu e.firma dentro del recuadro. Esta ventana se cerrará sola cuando Facturapi confirme tu firma.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {(justSigned || isConfirming || error) && (
          <div
            role="status"
            className={`mx-5 mt-4 px-3.5 py-2.5 rounded-xl text-[13px] font-sans flex-shrink-0 ${
              error ? "bg-danger-soft border-destructive text-destructive" : "bg-muted text-foreground"
            }`}
            style={{ borderWidth: error ? "1.5px" : undefined, borderStyle: error ? "solid" : undefined }}
          >
            {error ?? (justSigned ? "Manifiesto firmado ✓" : "Confirmando firma…")}
          </div>
        )}

        <div className="flex-1 min-h-0">
          <iframe
            src={`${FACTURAPI_ORIGIN}/embedded/manifiesto`}
            className="w-full h-full border-0"
            title="Firma de Carta Manifiesto"
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
