'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'
import { CatalogsProvider } from '@/src/catalogs/ui/context/CatalogsContext'
import { useEmisorInit } from '@/src/settings/ui/hooks/useEmisorInit'
import { DashboardShell } from '@/src/shared/ui/layout/DashboardShell'

export default function ProtectedLayout ({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, hasTenant, isLoading } = useAuth()
  const router = useRouter()

  useEmisorInit()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    if (!hasTenant) { router.replace('/onboarding'); return }
  }, [mounted, isAuthenticated, hasTenant, isLoading, router])

  if (!mounted || isLoading || !isAuthenticated || !hasTenant) return null
  return (
    <CatalogsProvider>
      <DashboardShell>{children}</DashboardShell>
    </CatalogsProvider>
  )
}
