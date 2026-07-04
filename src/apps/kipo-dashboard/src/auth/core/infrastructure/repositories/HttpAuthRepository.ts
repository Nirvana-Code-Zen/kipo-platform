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
      sessionResult('/auth/login/email', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    loginWithSocial: (
      provider: Extract<AuthProvider, 'google' | 'apple' | 'facebook'>,
      idToken: string
    ) =>
      sessionResult('/auth/login/social', {
        method: 'POST',
        body: JSON.stringify({ provider, id_token: idToken }),
      }),

    requestOtp: async (phone: string, channel: 'whatsapp' | 'sms'): Promise<Result<OtpToken, AuthError>> => {
      const result = await request<{ otp_token: string }>('/auth/otp/request', {
        method: 'POST',
        body: JSON.stringify({ phone, channel }),
      })
      if (!result.ok) return result
      return ok(toOtpToken(result.value.otp_token))
    },

    verifyOtp: (otpToken: OtpToken, code: string) =>
      sessionResult('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ otp_token: otpToken, code }),
      }),

    register: (data: {
      provider: AuthProvider
      displayName: string
      email?: string
      phone?: string
      password?: string
      idToken?: string
    }) =>
      sessionResult('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          provider: data.provider,
          display_name: data.displayName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          id_token: data.idToken,
        }),
      }),

    logout: () => request<void>('/auth/logout', { method: 'POST' }),

    refresh: () => sessionResult('/auth/refresh', { method: 'POST' }),
  }
}
