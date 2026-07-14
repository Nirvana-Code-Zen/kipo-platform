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
    if (hasTenant) { void goToTenantPath(router.replace, tenantSlug, '/dashboard'); return }
  }, [isAuthenticated, hasTenant, isLoading, tenantSlug, router])

  if (isLoading || !isAuthenticated) return null
  if (hasTenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Preparando tu cuenta…</p>
      </div>
    )
  }
  return <CatalogsProvider>{children}</CatalogsProvider>
}
