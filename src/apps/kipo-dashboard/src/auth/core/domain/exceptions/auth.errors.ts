export type AuthError =
  | { kind: 'InvalidCredentials' }
  | { kind: 'OtpExpired' }
  | { kind: 'OtpInvalid' }
  | { kind: 'UserAlreadyExists'; identifier: string }
  | { kind: 'UserNotFound' }
  | { kind: 'SessionExpired' }
  | { kind: 'NetworkError'; message: string }
  | { kind: 'ServerError'; status: number; message: string }

export const authError = {
  invalidCredentials: (): AuthError => ({ kind: 'InvalidCredentials' }),
  otpExpired: (): AuthError => ({ kind: 'OtpExpired' }),
  otpInvalid: (): AuthError => ({ kind: 'OtpInvalid' }),
  userAlreadyExists: (identifier: string): AuthError => ({ kind: 'UserAlreadyExists', identifier }),
  userNotFound: (): AuthError => ({ kind: 'UserNotFound' }),
  sessionExpired: (): AuthError => ({ kind: 'SessionExpired' }),
  network: (message: string): AuthError => ({ kind: 'NetworkError', message }),
  server: (status: number, message: string): AuthError => ({ kind: 'ServerError', status, message }),
}
