'use client'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'

import { CustomersDashboard } from './CustomersDashboard'

import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'

export const CustomersPageClient = () => {
  const { session } = useAuth()

  // Layout guarantees auth — safety fallback only
  if (!session) return null

  return <CustomersDashboard userId={session.userId as TenantId} />
}
