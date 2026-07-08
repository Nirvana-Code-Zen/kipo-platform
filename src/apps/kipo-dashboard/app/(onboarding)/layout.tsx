'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'

export default function OnboardingLayout ({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasTenant, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    if (hasTenant) { router.replace('/dashboard'); return }
  }, [isAuthenticated, hasTenant, isLoading, router])

  if (isLoading || !isAuthenticated || hasTenant) return null
  return <>{children}</>
}
