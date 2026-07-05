'use client'

import { useEffect } from 'react'

import { useAuthStore } from '../store/authStore'

import type { TenantSlug } from '../../core/domain/value-objects/TenantSlug'

// Primary hook consumed by all other bounded contexts.
// tenantSlug is the mandatory scoping key — never undefined when authenticated.
export const useAuth = () => {
  const store = useAuthStore()

  useEffect(() => {
    // On mount, if we have a persisted session but no access token, try to refresh.
    // The httpOnly refresh token cookie will be sent automatically by the browser.
    if (store.status === 'idle' && store.persistedSession && !store.accessToken) {
      store.refresh()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    session: store.session,
    status: store.status,
    error: store.error,
    pendingOtp: store.pendingOtp,
    isAuthenticated: store.status === 'authenticated' && store.session !== null,
    isLoading: store.status === 'loading' || (store.status === 'idle' && store.persistedSession !== null),
    isOtpPending: store.status === 'otp_pending',
    tenantSlug: store.session?.tenantSlug as TenantSlug | undefined,

    loginWithEmail: store.loginWithEmail,
    loginWithSocial: store.loginWithSocial,
    requestOtp: store.requestOtp,
    verifyOtp: store.verifyOtp,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
  }
}
