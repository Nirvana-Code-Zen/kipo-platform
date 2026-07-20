"use client"

import { useState, useEffect } from "react"

import { Button, Card } from '@kipo/ui-react'
import { Download, Monitor } from "lucide-react"

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
  }
}

export function KipoAppCard() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", () => setInstalled(true))
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    const prompt = installPrompt as BeforeInstallPromptEvent
    prompt.prompt()
    await prompt.userChoice
    setInstallPrompt(null)
  }

  return (
    <Card
      className="p-4 transition-all duration-500 hover:shadow-2xl animate-slide-in-up overflow-hidden relative group bg-[var(--color-foreground)] text-[var(--color-background)]"
      style={{ animationDelay: "900ms" }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
        >
          <path
            d="M0,30 Q25,15 50,30 T100,30 T150,30 T200,30 L200,60 L0,60 Z"
            fill="#2d6a9f"
            opacity="0.3"
          />
          <path d="M0,40 Q25,25 50,40 T100,40 T150,40 T200,40 L200,60 L0,60 Z" fill="#0a3352" />
        </svg>
      </div>

      <div className="relative z-10">
        <Monitor className="w-6 h-6 mb-3 opacity-90" />
        <h2 className="text-xl font-bold mb-1">Instala Kipo</h2>
        <p className="text-xs opacity-70 mb-4">
          Acceso rápido desde tu pantalla de inicio, sin necesidad de abrir el navegador.
        </p>

        {installed ? (
          <div className="flex items-center gap-2 text-xs opacity-80">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            App instalada
          </div>
        ) : (
          <Button
            onClick={handleInstall}
            disabled={!installPrompt}
            className="w-full h-10 bg-background text-foreground hover:bg-background/90 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            {installPrompt ? "Instalar app" : "Disponible en Chrome / Edge"}
          </Button>
        )}
      </div>
    </Card>
  )
}
