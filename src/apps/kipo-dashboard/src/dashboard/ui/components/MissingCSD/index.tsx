'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'


export function MissingCSDBanner() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-3 rounded-lg border border-banner-warning-border bg-banner-warning-bg px-4 py-3 mt-4 md:mt-5">
      <AlertTriangle className="w-4 h-4 shrink-0 text-banner-warning-icon" />
      <p className="flex-1 text-sm font-medium text-banner-warning-text">
        Sube tu CSD del SAT para poder timbrar facturas.
      </p>
      <button
        onClick={() => router.push('/settings?openCsd=true')}
        className="text-sm font-semibold shrink-0 underline underline-offset-2 text-banner-warning-link"
      >
        Configurar ahora
      </button>
    </div>
  )
}
