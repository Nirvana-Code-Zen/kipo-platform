'use client'

import { useEffect } from 'react'

import { useAuthStore } from '../store/authStore'

import type { TenantSlug } from '../../core/domain/value-objects/TenantSlug'

export const useAuth = () => {
  const store = useAuthStore()

  useEffect(() => {
    if (store.status === 'idle' && store.persistedSession && !store.accessToken) {
      store.refresh()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const isAuthenticated = store.status === 'authenticated' && store.accessToken !== null && store.persistedSession !== null
  const hasTenant = isAuthenticated && store.session?.tenantId != null

  return {
    session: store.session,
    status: store.status,
    error: store.error,
    pendingOtp: store.pendingOtp,
    pendingEmail: store.pendingEmail,
    isAuthenticated,
    hasTenant,
    isEmailPending: store.status === 'email_pending',
    isLoading: store.status === 'loading' || (store.status === 'idle' && store.persistedSession !== null),
    isOtpPending: store.status === 'otp_pending',
    tenantSlug: store.session?.tenantSlug as TenantSlug | null | undefined,

    loginWithEmail: store.loginWithEmail,
    loginWithSocial: store.loginWithSocial,
    requestOtp: store.requestOtp,
    verifyOtp: store.verifyOtp,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
    fakeLogin: store.fakeLogin,
  }
}
