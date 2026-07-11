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

import type { Session } from '../../core/domain/entities/Session'

const repo = createHttpAuthRepository(API_BASE_URL)

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
        try { await logoutUseCase(repo)() } catch { /* ignore logout errors */ }
        removeAuthSession()
        set({
          accessToken: null,
          persistedSession: null,
          pendingEmail: null,
          status: SessionStatus.unauthenticated,
          error: null,
          pendingOtp: null,
        })
      },

      refresh: async () => {
        const { persistedSession } = get()
        const result = await refreshSessionUseCase(repo)()

        if (result.ok) {
          applySession(set, result.value)
          return
        }

        if (persistedSession && new Date(persistedSession.expiresAt).getTime() > Date.now()) {
          set({ accessToken: 'fake-token' as Session['accessToken'], status: SessionStatus.authenticated, error: null })
          return
        }

        set({ accessToken: null, persistedSession: null, status: SessionStatus.unauthenticated, error: null })
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
