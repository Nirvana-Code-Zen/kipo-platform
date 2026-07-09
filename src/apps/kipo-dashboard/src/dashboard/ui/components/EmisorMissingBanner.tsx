'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useEmisorStore } from '@/src/settings/ui/store/emisorStore'

export function EmisorMissingBanner() {
  const data = useEmisorStore((s) => s.data)
  const isLoaded = useEmisorStore((s) => s.isLoaded)
  const router = useRouter()

  if (!isLoaded || data !== null) return null

  return (
    <div
      className="flex items-center gap-3 rounded-lg border px-4 py-3 mt-4 md:mt-5"
      style={{ background: 'var(--color-amber-50, #fffbeb)', borderColor: 'var(--color-amber-200, #fde68a)' }}
    >
      <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--color-amber-600, #d97706)' }} />
      <p className="flex-1 text-sm font-medium" style={{ color: 'var(--color-amber-800, #92400e)' }}>
        Configura tus datos fiscales para poder emitir facturas
      </p>
      <button
        onClick={() => router.push('/settings?openFiscal=true')}
        className="text-sm font-semibold shrink-0 underline underline-offset-2"
        style={{ color: 'var(--color-amber-700, #b45309)' }}
      >
        Configurar ahora
      </button>
    </div>
  )
}
