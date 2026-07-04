'use client'

import { useState, useEffect } from 'react'

import { createHttpCustomerRepository } from '../../core/infrastructure/repositories/HttpCustomerRepository'

import type { Customer } from '../../core/domain/entities/Customer'
import type { TenantId } from '@/src/customers/core/domain/value-objects/TenantId'

const repo = createHttpCustomerRepository(process.env.NEXT_PUBLIC_API_URL ?? '')

export type UseCustomersState = {
  data: Customer[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export const useCustomers = (userId: TenantId): UseCustomersState => {
  const [data, setData] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load () {
      setIsLoading(true)
      setError(null)
      try {
        const customers = await repo.findAllByUser(userId)
        if (!cancelled) setData(customers)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar clientes')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [userId, tick])

  return { data, isLoading, error, refetch: () => setTick((t) => t + 1) }
}
