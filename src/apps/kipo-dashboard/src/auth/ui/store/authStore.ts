'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { toPersistedSession, hydrateSession, isExpired } from '../../core/domain/entities/Session'
import { createHttpAuthRepository } from '../../core/infrastructure/repositories/HttpAuthRepository'
import { loginWithEmailUseCase } from '../../core/application/use-cases/loginWithEmailUseCase'
import { loginWithSocialUseCase } from '../../core/application/use-cases/loginWithSocialUseCase'
import { requestOtpUseCase } from '../../core/application/use-cases/requestOtpUseCase'
import { verifyOtpUseCase } from '../../core/application/use-cases/verifyOtpUseCase'
import { registerUseCase } from '../../core/application/use-cases/registerUseCase'
import { logoutUseCase } from '../../core/application/use-cases/logoutUseCase'
import { refreshSessionUseCase } from '../../core/application/use-cases/refreshSessionUseCase'

import type { AuthError } from '../../core/domain/exceptions/auth.errors'
import type { OtpToken } from '../../core/domain/value-objects/AccessToken'
import type { Session, PersistedSession } from '../../core/domain/entities/Session'
import type {
  LoginWithEmailDTO,
  LoginWithSocialDTO,
  RegisterDTO,
  RequestOtpDTO,
  VerifyOtpDTO,
} from '../../core/application/dtos'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'otp_pending'

type PersistedState = {
  persistedSession: PersistedSession | null
}

type AuthState = {
  // accessToken lives only in memory — not included in PersistedSession
  accessToken: Session['accessToken'] | null
  persistedSession: PersistedSession | null
  status: AuthStatus
  error: AuthError | null
  pendingOtp: { phone: string; otpToken: OtpToken; channel: 'whatsapp' | 'sms' } | null

  // Computed
  session: Session | null

  // Actions
  loginWithEmail: (dto: LoginWithEmailDTO) => Promise<void>
  loginWithSocial: (dto: LoginWithSocialDTO) => Promise<void>
  requestOtp: (dto: RequestOtpDTO) => Promise<void>
  verifyOtp: (dto: VerifyOtpDTO) => Promise<void>
  register: (dto: RegisterDTO) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const repo = createHttpAuthRepository(API_BASE_URL)

const applySession = (
  set: (partial: Partial<AuthState>) => void,
  session: Session
) => {
  set({
    accessToken: session.accessToken,
    persistedSession: toPersistedSession(session),
    status: 'authenticated',
    error: null,
    pendingOtp: null,
  })
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      persistedSession: null,
      status: 'idle',
      error: null,
      pendingOtp: null,

      get session () {
        const { accessToken, persistedSession } = get()
        if (!accessToken || !persistedSession) return null
        const session = hydrateSession(persistedSession, accessToken)
        return isExpired(session) ? session : session
      },

      loginWithEmail: async (dto) => {
        set({ status: 'loading', error: null })
        const result = await loginWithEmailUseCase(repo)(dto)
        if (result.ok) {
          applySession(set, result.value)
        } else {
          set({ status: 'authenticated', error: result.error })
        }
      },

      loginWithSocial: async (dto) => {
        set({ status: 'loading', error: null })
        const result = await loginWithSocialUseCase(repo)(dto)
        if (result.ok) {
          applySession(set, result.value)
        } else {
          set({ status: 'authenticated', error: result.error })
        }
      },

      requestOtp: async (dto) => {
        set({ status: 'loading', error: null })
        const result = await requestOtpUseCase(repo)(dto)
        if (result.ok) {
          set({
            status: 'otp_pending',
            pendingOtp: { phone: dto.phone, otpToken: result.value, channel: dto.channel },
          })
        } else {
          set({ status: 'authenticated', error: result.error })
        }
      },

      verifyOtp: async (dto) => {
        set({ status: 'loading', error: null })
        const result = await verifyOtpUseCase(repo)(dto)
        if (result.ok) {
          applySession(set, result.value)
        } else {
          set({ status: 'otp_pending', error: result.error })
        }
      },

      register: async (dto) => {
        set({ status: 'loading', error: null })
        const result = await registerUseCase(repo)(dto)
        if (result.ok) {
          applySession(set, result.value)
        } else {
          set({ status: 'authenticated', error: result.error })
        }
      },

      logout: async () => {
        set({ status: 'loading' })
        await logoutUseCase(repo)()
        set({
          accessToken: null,
          persistedSession: null,
          status: 'authenticated',
          error: null,
          pendingOtp: null,
        })
      },

      refresh: async () => {
        const result = await refreshSessionUseCase(repo)()
        if (result.ok) {
          applySession(set, result.value)
        } else {
          set({
            accessToken: null,
            persistedSession: null,
            status: 'authenticated',
            error: result.error,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'kipo-auth',
      partialize: (state): PersistedState => ({
        persistedSession: state.persistedSession,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.persistedSession) {
          // accessToken is gone after page reload — trigger refresh to get a new one
          // The refresh will use the httpOnly cookie that the browser sends automatically
          state.status = 'idle'
        }
      },
    }
  )
)
