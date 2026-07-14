'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { AuthState, PersistedState, SessionStatus } from './types'
import { getAuthSession, setAuthSession, patchAuthSession, removeAuthSession } from './sessionStoage'
import { toPersistedSession } from '../../core/domain/entities/Session'
import { createHttpAuthRepository } from '../../core/infrastructure/repositories/HttpAuthRepository'
import { loginWithEmailUseCase } from '../../core/application/use-cases/loginWithEmailUseCase'
import { loginWithSocialUseCase } from '../../core/application/use-cases/loginWithSocialUseCase'
import { completeOAuthUseCase } from '../../core/application/use-cases/completeOAuthUseCase'
import { requestOtpUseCase } from '../../core/application/use-cases/requestOtpUseCase'
import { verifyOtpUseCase } from '../../core/application/use-cases/verifyOtpUseCase'
import { registerUseCase } from '../../core/application/use-cases/registerUseCase'
import { logoutUseCase } from '../../core/application/use-cases/logoutUseCase'
import { refreshSessionUseCase } from '../../core/application/use-cases/refreshSessionUseCase'
import { createExchangeCodeUseCase } from '../../core/application/use-cases/createExchangeCodeUseCase'
import { consumeExchangeCodeUseCase } from '../../core/application/use-cases/consumeExchangeCodeUseCase'

import type { Session } from '../../core/domain/entities/Session'

const repo = createHttpAuthRepository(API_BASE_URL)

const REFRESH_LEAD_MS = 60_000
const REFRESH_MIN_DELAY_MS = 5_000

let refreshTimer: ReturnType<typeof setTimeout> | null = null

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

const scheduleRefresh = (expiresAt: Date | string) => {
  clearRefreshTimer()
  const delay = Math.max(new Date(expiresAt).getTime() - Date.now() - REFRESH_LEAD_MS, REFRESH_MIN_DELAY_MS)
  refreshTimer = setTimeout(() => {
    useAuthStore.getState().refresh()
  }, delay)
}

const applySession = (
  set: (partial: Partial<AuthState>) => void,
  session: Session
) => {
  set({
    accessToken: session.accessToken,
    persistedSession: toPersistedSession(session),
    status: SessionStatus.authenticated,
    error: null,
    pendingOtp: null,
  })
  scheduleRefresh(session.expiresAt)
}

const CLEARED_STATE: Partial<AuthState> = {
  accessToken: null,
  persistedSession: null,
  status: SessionStatus.unauthenticated,
  error: null,
  pendingOtp: null,
}

const auth = getAuthSession()

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: auth?.accessToken,
      persistedSession: auth && toPersistedSession(auth),
      pendingEmail: null,
      status: auth ? SessionStatus.authenticated : SessionStatus.idle,
      error: null,
      pendingOtp: null,

      loginWithEmail: async (dto) => {
        set({ status: SessionStatus.loading, error: null })
        const result = await loginWithEmailUseCase(repo)(dto)
        if (result.ok) {
          applySession(set, result.value)
          setAuthSession(result.value)
          return
        }
        set({ status: SessionStatus.authenticated, error: result.error })
      },

      loginWithSocial: async (dto: { provider: 'google' | 'apple' | 'facebook' }) => {
        set({ status: SessionStatus.loading, error: null })
        const redirectTo = typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : 'http://localhost:3000/auth/callback'
        const result = await loginWithSocialUseCase(repo)({ ...dto, redirectTo })
        if (result.ok) {
          window.location.href = result.value
        } else {
          set({ status: SessionStatus.unauthenticated, error: result.error })
        }
      },

      completeOAuth: async (accessToken: string, refreshToken: string) => {
        set({ status: SessionStatus.loading, error: null })
        const result = await completeOAuthUseCase(repo)({ accessToken, refreshToken })
        if (result.ok) {
          applySession(set, result.value)
          setAuthSession(result.value)
        } else {
          set({ status: SessionStatus.unauthenticated, error: result.error })
        }
      },

      requestOtp: async (dto) => {
        set({ status: SessionStatus.loading, error: null })
        const phone = dto.phone.startsWith('+') ? dto.phone : `+52${dto.phone.replace(/\D/g, '')}`
        const result = await requestOtpUseCase(repo)({ phone })
        if (result.ok) {
          set({
            status: SessionStatus.otp_pending,
            pendingOtp: { phone, otpToken: result.value },
          })
        } else {
          set({ status: SessionStatus.authenticated, error: result.error })
        }
      },

      verifyOtp: async (dto) => {
        set({ status: SessionStatus.loading, error: null })
        const result = await verifyOtpUseCase(repo)(dto)
        if (result.ok) {
          applySession(set, result.value)
          setAuthSession(result.value)
        } else {
          set({ status: SessionStatus.otp_pending, error: result.error })
        }
      },

      register: async (dto) => {
        set({ status: SessionStatus.loading, error: null })
        const result = await registerUseCase(repo)(dto)
        if (result.ok) {
          set({ status: SessionStatus.email_pending, pendingEmail: result.value.email, error: null })
        } else {
          set({ status: SessionStatus.unauthenticated, error: result.error })
        }
      },

      logout: async () => {
        set({ status: SessionStatus.loading })
        const { accessToken } = get()
        try { await logoutUseCase(repo)(accessToken) } catch { /* ignore logout errors */ }
        clearRefreshTimer()
        removeAuthSession()
        set({ ...CLEARED_STATE, pendingEmail: null })
      },

      refresh: async () => {
        const result = await refreshSessionUseCase(repo)()

        if (result.ok) {
          applySession(set, result.value)
          setAuthSession(result.value)
          return true
        }

        get().forceUnauthenticated()
        return false
      },

      forceUnauthenticated: () => {
        clearRefreshTimer()
        removeAuthSession()
        set(CLEARED_STATE)
      },

      mintExchangeCode: async () => {
        const { accessToken } = get()
        if (!accessToken) return null
        const result = await createExchangeCodeUseCase(repo)(accessToken)
        return result.ok ? result.value : null
      },

      adoptExchangeCode: async (code: string) => {
        set({ status: SessionStatus.loading, error: null })
        const result = await consumeExchangeCodeUseCase(repo)(code)
        if (result.ok) {
          applySession(set, result.value)
          setAuthSession(result.value)
          return true
        }
        set({ status: SessionStatus.unauthenticated, error: result.error })
        return false
      },

      clearError: () => set({ error: null }),

      updateProfile: (displayName, avatarUrl) => {
        const { persistedSession } = get()
        if (!persistedSession) return
        set({
          persistedSession: { ...persistedSession, displayName, avatarUrl },
        })
        patchAuthSession({ displayName, avatarUrl })
      },
    }),
    {
      name: 'kipo-auth',
      partialize: (state): PersistedState => ({
        persistedSession: state.persistedSession,
        pendingEmail: state.pendingEmail,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !auth) {
          state.status = SessionStatus.unauthenticated
          return
        }
        if (state && state.persistedSession) {
          state.status = SessionStatus.authenticated
        }
      },
    }
  )
)

export const scheduleRefreshForCurrentSession = () => {
  const { persistedSession, accessToken } = useAuthStore.getState()
  if (persistedSession && accessToken) {
    scheduleRefresh(persistedSession.expiresAt)
  }
}

let bootstrapAttempted = false

export const attemptBootstrapOnce = (): Promise<boolean> | null => {
  if (bootstrapAttempted) return null
  bootstrapAttempted = true

  const { status, persistedSession, accessToken } = useAuthStore.getState()
  if (!(status === SessionStatus.idle && persistedSession && !accessToken)) {
    return null
  }

  useAuthStore.setState({ status: SessionStatus.loading })
  return useAuthStore.getState().refresh()
}
