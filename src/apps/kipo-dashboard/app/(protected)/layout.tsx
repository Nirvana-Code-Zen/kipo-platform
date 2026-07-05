'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'
import { DashboardShell } from '@/src/shared/ui/layout/DashboardShell'

export default function ProtectedLayout ({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login')
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) return null
  return <DashboardShell>{children}</DashboardShell>
}
