'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { EMISOR_SETUP_PATHS } from '@/src/settings/ui/components/shared/getMissingSetupPath'

export function MissingManifestBanner() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-3 rounded-lg border border-banner-warning-border bg-banner-warning-bg px-4 py-3 mt-4 md:mt-5">
      <AlertTriangle className="w-4 h-4 shrink-0 text-banner-warning-icon" />
      <p className="flex-1 text-sm font-medium text-banner-warning-text">
        Firma tu Carta Manifiesto con tu e.firma (FIEL)
      </p>
      <button
        onClick={() => router.push(EMISOR_SETUP_PATHS.manifest)}
        className="text-sm font-semibold shrink-0 underline underline-offset-2 text-banner-warning-link cursor-pointer"
      >
        Firma ahora
      </button>
    </div>
  )
}
