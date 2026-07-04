'use client'

import { useState, useEffect } from 'react'

import { createHttpUserRepository } from '../../core/infrastructure/repositories/HttpUserRepository'

import type { User } from '../../core/domain/entities/User'

const repo = createHttpUserRepository(process.env.NEXT_PUBLIC_API_URL ?? '')

export type UseUsersState = {
  data: User[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export const useUsers = (): UseUsersState => {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load () {
      setIsLoading(true)
      setError(null)
      try {
        const users = await repo.findAll()
        if (!cancelled) setData(users)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load users')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [tick])

  return { data, isLoading, error, refetch: () => setTick((t) => t + 1) }
}
