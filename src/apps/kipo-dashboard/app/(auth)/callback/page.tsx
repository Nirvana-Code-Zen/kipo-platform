'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'
import { SessionStatus } from '@/src/auth/ui/store/types'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const completeOAuth = useAuthStore((s) => s.completeOAuth)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const error = params.get('error')

    if (error || !accessToken || !refreshToken) {
      void router.replace('/login?error=oauth_failed')
      return
    }

    void completeOAuth(accessToken, refreshToken).then(() => {
      if (useAuthStore.getState().status === SessionStatus.unauthenticated) {
        void router.replace('/login?error=oauth_failed')
      }
    })
  }, [completeOAuth, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 size={32} className="animate-spin text-brand" />
      <p className="font-sans text-text-muted text-sm">
        Completando inicio de sesión…
      </p>
    </div>
  )
}
