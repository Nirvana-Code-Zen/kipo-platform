'use client'

import { useState } from 'react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'

import { createTenantUseCase } from '../../core/application/use-cases/createTenantUseCase'
import { createHttpTenantOnboardingRepository } from '../../core/infrastructure/repositories/HttpTenantOnboardingRepository'

import type { TenantOnboardingError } from '../../core/domain/repositories/ITenantOnboardingRepository'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
const repo = createHttpTenantOnboardingRepository(API_BASE_URL)

const toSchemaSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)

export const useOnboardingForm = (onSuccess: (tenantId: string, schemaName: string) => void) => {
  const accessToken = useAuthStore((s) => s.accessToken)

  const [name, setName] = useState('')
  const [schemaName, setSchemaName] = useState('')
  const [schemaEdited, setSchemaEdited] = useState(false)
  const [timezone, setTimezone] = useState('America/Mexico_City')
  const [currency, setCurrency] = useState('MXN')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<TenantOnboardingError | null>(null)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!schemaEdited) setSchemaName(toSchemaSlug(value))
  }

  const handleSchemaChange = (value: string) => {
    setSchemaEdited(true)
    setSchemaName(toSchemaSlug(value))
  }

  const submit = async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError(null)
    const result = await createTenantUseCase(repo)(
      { name, schemaName, timezone, currency },
      accessToken
    )
    setIsLoading(false)
    if (result.ok) {
      onSuccess(result.value.tenantId, result.value.schemaName)
    } else {
      setError(result.error)
    }
  }

  return {
    name, setName: handleNameChange,
    schemaName, setSchemaName: handleSchemaChange,
    timezone, setTimezone,
    currency, setCurrency,
    isLoading,
    error,
    isValid: name.trim().length >= 2 && schemaName.length >= 3,
    submit,
  }
}
