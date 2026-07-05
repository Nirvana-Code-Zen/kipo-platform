'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/src/auth/ui/store/authStore'

export default function ProtectedLayout ({ children }: { children: React.ReactNode }) {
  const status = useAuthStore(s => s.status)
  const persistedSession = useAuthStore(s => s.persistedSession)
  const refresh = useAuthStore(s => s.refresh)
  const router = useRouter()

  useEffect(() => {
    if (status === 'idle' && persistedSession) refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'idle' && !persistedSession)) {
      router.replace('/login')
    }
  }, [status, persistedSession, router])

  if (status === 'authenticated') return <>{children}</>
  return null
}
