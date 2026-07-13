'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'
import { CatalogsProvider } from '@/src/catalogs/ui/context/CatalogsContext'
import { goToTenantPath } from '@/src/auth/ui/lib/tenantRedirect'

export default function OnboardingLayout ({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasTenant, isLoading, tenantSlug } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    if (hasTenant) { goToTenantPath(router.replace, tenantSlug, '/dashboard'); return }
  }, [isAuthenticated, hasTenant, isLoading, tenantSlug, router])

  if (isLoading || !isAuthenticated || hasTenant) return null
  return <CatalogsProvider>{children}</CatalogsProvider>
}
