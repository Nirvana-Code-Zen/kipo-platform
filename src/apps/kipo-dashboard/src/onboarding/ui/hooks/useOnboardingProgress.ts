'use client'

import { useState, useRef } from 'react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'
import { patchAuthSession } from '@/src/auth/ui/store/sessionStoage'

type OnboardingProgress = {
  step: 1 | 2 | 3 | 4
  pendingTenant?: { tenantId: string; schemaName: string }
}

function progressKey(userId: string) {
  return `kipo-onboarding-${userId}`
}

function loadProgress(userId: string): OnboardingProgress | null {
  if (typeof window === 'undefined' || !userId) return null
  try {
    const raw = localStorage.getItem(progressKey(userId))
    return raw ? (JSON.parse(raw) as OnboardingProgress) : null
  } catch { return null }
}

export function useOnboardingProgress() {
  const userId = useAuthStore((s) => s.persistedSession?.userId ?? '')
  const setStore = useAuthStore.setState

  const [initialProgress] = useState<OnboardingProgress | null>(() => loadProgress(userId))
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialProgress?.step ?? 1)
  const pendingTenantRef = useRef<{ tenantId: string; schemaName: string } | null>(
    initialProgress?.pendingTenant ?? null
  )

  function advanceTo(nextStep: 1 | 2 | 3 | 4, pendingTenant?: { tenantId: string; schemaName: string }) {
    if (typeof window !== 'undefined' && userId) {
      localStorage.setItem(progressKey(userId), JSON.stringify({ step: nextStep, pendingTenant }))
    }
    setStep(nextStep)
  }

  function onTenantCreated(tenantId: string, schemaName: string) {
    pendingTenantRef.current = { tenantId, schemaName }
    patchAuthSession({ tenantId, tenantSlug: schemaName })
    advanceTo(3, { tenantId, schemaName })
  }

  function complete() {
    const pending = pendingTenantRef.current
    if (pending) {
      setStore((prev) => ({
        persistedSession: prev.persistedSession
          ? { ...prev.persistedSession, tenantId: pending.tenantId, tenantSlug: pending.schemaName as never }
          : prev.persistedSession,
      }))
    }
    if (typeof window !== 'undefined' && userId) {
      localStorage.removeItem(progressKey(userId))
    }
  }

  return {
    step,
    pendingTenantRef,
    advanceTo,
    onTenantCreated,
    complete,
  }
}
