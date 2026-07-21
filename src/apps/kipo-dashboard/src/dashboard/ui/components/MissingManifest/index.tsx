'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'


export function MissingManifestBanner() {
  const router = useRouter()

  return (
    <div
      className="flex items-center gap-3 rounded-lg border px-4 py-3 mt-4 md:mt-5"
      style={{ background: 'var(--color-amber-50, #fffbeb)', borderColor: 'var(--color-amber-200, #fde68a)' }}
    >
      <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--color-amber-600, #d97706)' }} />
      <p className="flex-1 text-sm font-medium" style={{ color: 'var(--color-amber-800, #92400e)' }}>
        Firma tu Carta Manifiesto con tu e.firma (FIEL)
      </p>
      <button
        onClick={() => router.push('/settings')}
        className="text-sm font-semibold shrink-0 underline underline-offset-2"
        style={{ color: 'var(--color-amber-700, #b45309)' }}
      >
        Firma ahora
      </button>
    </div>
  )
}
