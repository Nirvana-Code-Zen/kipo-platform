import type { AuthError } from '../../core/domain/exceptions/auth.errors'
import type { Session, PersistedSession } from '../../core/domain/entities/Session'
import type { OtpToken } from '../../core/domain/value-objects/AccessToken'
import type { AuthProvider } from '../../core/domain/value-objects/AuthProvider'
import type {
  LoginWithEmailDTO,
  RegisterDTO,
  RequestOtpDTO,
  VerifyOtpDTO,
} from '../../core/application/dtos'

export type AuthStatus = SessionStatus.idle |
  SessionStatus.loading |
  SessionStatus.authenticated |
  SessionStatus.unauthenticated |
  SessionStatus.otp_pending |
  SessionStatus.email_pending

export type PersistedState = {
  persistedSession: PersistedSession | null
  pendingEmail: string | null
}

export type AuthState = {
  accessToken: Session['accessToken'] | null
  persistedSession: PersistedSession | null
  pendingEmail: string | null  // email awaiting confirmation after register
  status: AuthStatus
  error: AuthError | null
  pendingOtp: { phone: string; otpToken: OtpToken } | null

  loginWithEmail: (dto: LoginWithEmailDTO) => Promise<void>
  loginWithSocial: (dto: { provider: Extract<AuthProvider, 'google' | 'apple' | 'facebook'> }) => Promise<void>
  completeOAuth: (accessToken: string, refreshToken: string) => Promise<void>
  requestOtp: (dto: RequestOtpDTO) => Promise<void>
  verifyOtp: (dto: VerifyOtpDTO) => Promise<void>
  register: (dto: RegisterDTO) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
  updateProfile: (displayName: string, avatarUrl: string | undefined) => void
}

export enum SessionStatus {
  authenticated = 'authenticated',
  idle = 'idle',
  loading = 'loading',
  unauthenticated = 'unauthenticated',
  otp_pending = 'opt_pending',
  email_pending = 'email_pending'
}
