import { ok, err } from '@/src/shared/domain/result'

import { toOtpToken } from '../../domain/value-objects/AccessToken'
import { authError } from '../../domain/exceptions/auth.errors'
import { SessionMapper } from '../mappers/SessionMapper'

import type { SessionRaw } from '../mappers/SessionMapper'
import type { Result } from '@/src/shared/domain/result'
import type { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import type { Session } from '../../domain/entities/Session'
import type { OtpToken } from '../../domain/value-objects/AccessToken'
import type { AuthProvider } from '../../domain/value-objects/AuthProvider'
import type { AuthError } from '../../domain/exceptions/auth.errors'

export const createHttpAuthRepository = (baseUrl: string): IAuthRepository => {
  const request = async <T>(
    path: string,
    options: RequestInit = {}
  ): Promise<Result<T, AuthError>> => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...options.headers },
      })

      if (!res.ok) {
        if (res.status === 401) return err(authError.invalidCredentials())
        if (res.status === 409) return err(authError.userAlreadyExists(''))
        const body = await res.json().catch(() => ({ message: res.statusText })) as { message?: string }
        return err(authError.server(res.status, body.message ?? res.statusText))
      }

      const data = await res.json() as T
      return ok(data)
    } catch (e) {
      return err(authError.network(e instanceof Error ? e.message : 'Unknown error'))
    }
  }

  const sessionResult = async (
    path: string,
    options: RequestInit
  ): Promise<Result<Session, AuthError>> => {
    const result = await request<SessionRaw>(path, options)
    if (!result.ok) return result
    return ok(SessionMapper.toDomain(result.value))
  }

  return {
    loginWithEmail: (email: string, password: string) =>
      sessionResult('/api/v1/auth/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    loginWithSocial: async (
      provider: Extract<AuthProvider, 'google' | 'apple' | 'facebook'>,
      redirectTo: string
    ): Promise<Result<string, AuthError>> => {
      const result = await request<{ url: string }>('/api/v1/auth/sign-in/oauth', {
        method: 'POST',
        body: JSON.stringify({ provider, redirect_to: redirectTo }),
      })
      if (!result.ok) return result
      return ok(result.value.url)
    },

    completeOAuth: (accessToken: string, refreshToken: string) =>
      sessionResult('/api/v1/auth/oauth/callback', {
        method: 'POST',
        body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
      }),

    requestOtp: async (phone: string): Promise<Result<OtpToken, AuthError>> => {
      const result = await request<{ message: string }>('/api/v1/auth/sign-in/phone', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      })
      if (!result.ok) return result
      return ok(toOtpToken(phone))
    },

    verifyOtp: (otpToken: OtpToken, code: string) =>
      sessionResult('/api/v1/auth/sign-in/phone/verify', {
        method: 'POST',
        body: JSON.stringify({ phone: otpToken, token: code }),
      }),

    register: async (data: {
      provider: AuthProvider
      displayName: string
      email?: string
      phone?: string
      password?: string
      idToken?: string
    }): Promise<Result<{ emailPending: true; email: string | null }, AuthError>> => {
      const result = await request<{ email_pending: boolean; email: string | null }>('/api/v1/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })
      if (!result.ok) return result
      return ok({ emailPending: true as const, email: result.value.email ?? null })
    },

    logout: () => request<void>('/api/v1/auth/sign-out', { method: 'POST' }),

    refresh: () => sessionResult('/api/v1/auth/refresh', { method: 'POST' }),
  }
}
