'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'
import { AuthShell } from '@/src/auth/ui/components/AuthShell'
import { goToTenantPath } from '@/src/auth/ui/lib/tenantRedirect'

export default function AuthLayout ({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasTenant, isEmailPending, isLoading, tenantSlug } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (isEmailPending) { router.replace('/email-confirm'); return }
    if (isAuthenticated && hasTenant) { void goToTenantPath(router.replace, tenantSlug, '/dashboard'); return }
    if (isAuthenticated && !hasTenant) { router.replace('/onboarding'); return }
  }, [isAuthenticated, hasTenant, isEmailPending, isLoading, tenantSlug, router])

  if (isAuthenticated) return null
  return <AuthShell>{children}</AuthShell>
}
