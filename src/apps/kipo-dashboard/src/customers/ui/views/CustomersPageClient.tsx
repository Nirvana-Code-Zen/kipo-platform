'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'

import { CustomersDashboard } from './CustomersDashboard'

import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'

export const CustomersPageClient = () => {
  const { session, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !session) return null

  return <CustomersDashboard userId={session.userId as TenantId} />
}
