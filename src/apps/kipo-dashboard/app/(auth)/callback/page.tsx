'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'

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
      void router.replace('/dashboard')
    })
  }, [completeOAuth, router])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Loader2 size={32} className='animate-spin' style={{ color: 'var(--brand)' }} />
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: 14 }}>
        Completando inicio de sesión…
      </p>
    </div>
  )
}
