'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'
import { goToTenantPath } from '@/src/auth/ui/lib/tenantRedirect'

export default function RootPage () {
  const { isAuthenticated, hasTenant, isLoading, tenantSlug } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    if (hasTenant) { goToTenantPath(router.replace, tenantSlug, '/dashboard'); return }
    router.replace('/onboarding')
  }, [isAuthenticated, hasTenant, isLoading, tenantSlug, router])

  return null
}
