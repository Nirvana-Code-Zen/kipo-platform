'use client'

import { useShallow } from 'zustand/react/shallow'

import { hydrateSession } from '../../core/domain/entities/Session'
import { useAuthStore } from '../store/authStore'
import { SessionStatus } from '../store/types'

import type { TenantSlug } from '../../core/domain/value-objects/TenantSlug'
import type { Session } from '../../core/domain/entities/Session'

export const useAuth = () => {
  const store = useAuthStore(useShallow((s) => ({
    status: s.status,
    persistedSession: s.persistedSession,
    accessToken: s.accessToken,
    error: s.error,
    pendingOtp: s.pendingOtp,
    pendingEmail: s.pendingEmail,
    refresh: s.refresh,
    loginWithEmail: s.loginWithEmail,
    loginWithSocial: s.loginWithSocial,
    completeOAuth: s.completeOAuth,
    requestOtp: s.requestOtp,
    verifyOtp: s.verifyOtp,
    register: s.register,
    logout: s.logout,
    clearError: s.clearError,
  })))

  const isAuthenticated = store.status === SessionStatus.authenticated && store.accessToken !== null && store.persistedSession !== null

  const session: Session | null = (store.accessToken && store.persistedSession)
    ? hydrateSession(store.persistedSession, store.accessToken)
    : null

  const hasTenant = isAuthenticated && store.persistedSession?.tenantId != null
  const tenantSlug = store.persistedSession?.tenantSlug as TenantSlug | null | undefined

  return {
    session,
    status: store.status,
    error: store.error,
    pendingOtp: store.pendingOtp,
    pendingEmail: store.pendingEmail,
    isAuthenticated,
    hasTenant,
    isEmailPending: store.status === SessionStatus.email_pending,
    isLoading: store.status === SessionStatus.loading || (store.status === SessionStatus.idle && store.persistedSession !== null),
    isOtpPending: store.status === SessionStatus.otp_pending,
    tenantSlug,

    loginWithEmail: store.loginWithEmail,
    loginWithSocial: store.loginWithSocial,
    completeOAuth: store.completeOAuth,
    requestOtp: store.requestOtp,
    verifyOtp: store.verifyOtp,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
  }
}
