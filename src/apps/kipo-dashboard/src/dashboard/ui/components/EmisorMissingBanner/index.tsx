'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useEmisorStore } from '@/src/settings/ui/store/emisorStore'
import { EMISOR_SETUP_PATHS } from '@/src/settings/ui/components/shared/getMissingSetupPath'

import { MissingCSDBanner } from '../MissingCSD'
import { MissingManifestBanner } from '../MissingManifest'

export function EmisorMissingBanner() {
  const data = useEmisorStore((s) => s.data)
  const isLoaded = useEmisorStore((s) => s.isLoaded)
  const router = useRouter()

  if (!isLoaded || !data ) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-banner-warning-border bg-banner-warning-bg px-4 py-3 mt-4 md:mt-5">
        <AlertTriangle className="w-4 h-4 shrink-0 text-banner-warning-icon" />
        <p className="flex-1 text-sm font-medium text-banner-warning-text">
          Configura tus datos fiscales para poder emitir facturas
        </p>
        <button
          onClick={() => router.push(EMISOR_SETUP_PATHS.fiscal)}
          className="text-sm font-semibold shrink-0 underline underline-offset-2 text-banner-warning-link cursor-pointer"
        >
          Configurar ahora
        </button>
      </div>
    )
  }

  if (!data?.csdConfigured) return <MissingCSDBanner/>

  if (!data?.manifiestoSigned) return <MissingManifestBanner/>

  return null
}
