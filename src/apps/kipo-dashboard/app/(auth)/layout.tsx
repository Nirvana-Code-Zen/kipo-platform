'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/src/auth/ui/hooks/useAuth'

export default function AuthLayout ({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/customers')
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) return null
  return <>{children}</>
}
