'use client'

import { useState } from 'react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export const useOnboardingDisplayName = (onSuccess: () => void) => {
  const accessToken = useAuthStore(s => s.accessToken)
  const session = useAuthStore(s => s.persistedSession)
  const updateProfile = useAuthStore(s => s.updateProfile)

  const [displayName, setDisplayName] = useState(session?.displayName ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!accessToken || !displayName.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName.trim() }),
      })
      if (!res.ok) throw new Error('No se pudo guardar el nombre')
      updateProfile(displayName.trim(), session?.avatarUrl)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    displayName,
    setDisplayName,
    isLoading,
    error,
    isValid: displayName.trim().length >= 2,
    submit,
  }
}
