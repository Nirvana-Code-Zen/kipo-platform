'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'
import { goToTenantPath } from '@/src/auth/ui/lib/tenantRedirect'
import { CatalogsProvider } from '@/src/catalogs/ui/context/CatalogsContext'
import { useEmisorInit } from '@/src/settings/ui/hooks/useEmisorInit'
import { getTenantSlugFromHost } from '@/src/shared/host/tenantSlug'
import { APP_DOMAIN } from '@/src/shared/infrastructure/config'
import { DashboardShell } from '@/src/shared/ui/layout/DashboardShell'

export default function ProtectedLayout ({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, hasTenant, isLoading, tenantSlug } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEmisorInit()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    if (!hasTenant) { router.replace('/onboarding'); return }
    void goToTenantPath(router.replace, tenantSlug, pathname)
  }, [mounted, isAuthenticated, hasTenant, isLoading, tenantSlug, pathname, router])

  const onWrongHost = mounted && tenantSlug != null
    && getTenantSlugFromHost(window.location.hostname, APP_DOMAIN) !== tenantSlug

  if (!mounted) return null
  if (isLoading || !isAuthenticated || !hasTenant || onWrongHost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Cargando…</p>
      </div>
    )
  }
  return (
    <CatalogsProvider>
      <DashboardShell>{children}</DashboardShell>
    </CatalogsProvider>
  )
}
