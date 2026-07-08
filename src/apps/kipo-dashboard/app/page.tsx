'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'

export default function RootPage () {
  const { isAuthenticated, hasTenant, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    router.replace(hasTenant ? '/dashboard' : '/onboarding')
  }, [isAuthenticated, hasTenant, isLoading, router])

  return null
}
