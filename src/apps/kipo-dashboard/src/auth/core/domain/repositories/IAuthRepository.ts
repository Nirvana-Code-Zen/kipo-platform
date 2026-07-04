import type { Result } from '@/src/shared/domain/result'
import type { Session } from '../entities/Session'
import type { OtpToken } from '../value-objects/AccessToken'
import type { AuthProvider } from '../value-objects/AuthProvider'
import type { AuthError } from '../exceptions/auth.errors'

// Repository interface uses only domain primitives and value objects — no application DTOs
export type IAuthRepository = {
  loginWithEmail: (email: string, password: string) => Promise<Result<Session, AuthError>>
  loginWithSocial: (
    provider: Extract<AuthProvider, 'google' | 'apple' | 'facebook'>,
    idToken: string
  ) => Promise<Result<Session, AuthError>>
  requestOtp: (
    phone: string,
    channel: 'whatsapp' | 'sms'
  ) => Promise<Result<OtpToken, AuthError>>
  verifyOtp: (otpToken: OtpToken, code: string) => Promise<Result<Session, AuthError>>
  register: (data: {
    provider: AuthProvider
    displayName: string
    email?: string
    phone?: string
    password?: string
    idToken?: string
  }) => Promise<Result<Session, AuthError>>
  logout: () => Promise<Result<void, AuthError>>
  refresh: () => Promise<Result<Session, AuthError>>
}
