import type { AuthProvider } from '../../domain/value-objects/AuthProvider'
import type { OtpToken } from '../../domain/value-objects/AccessToken'

export type LoginWithEmailDTO = {
  email: string
  password: string
}

export type LoginWithSocialDTO = {
  provider: Extract<AuthProvider, 'google' | 'apple' | 'facebook'>
  redirectTo: string
}

export type RequestOtpDTO = {
  phone: string
}

export type OAuthCallbackDTO = {
  accessToken: string
  refreshToken: string
}

export type VerifyOtpDTO = {
  otpToken: OtpToken
  code: string
}

export type RegisterDTO = {
  provider: AuthProvider
  displayName: string
  email?: string
  phone?: string
  password?: string
  idToken?: string  // for social providers
}
