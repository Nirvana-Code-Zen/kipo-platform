import type { AuthError } from '../../core/domain/exceptions/auth.errors'

export const LOGIN_ERROR_MESSAGE: Record<AuthError['kind'], string> = {
  InvalidCredentials: 'Correo o contraseña incorrectos',
  OtpExpired: 'El código expiró. Solicita uno nuevo.',
  OtpInvalid: 'Código incorrecto',
  UserAlreadyExists: 'Esta cuenta ya existe',
  UserNotFound: 'Cuenta no encontrada',
  SessionExpired: 'Tu sesión expiró',
  WrongTenant: 'Esta cuenta no pertenece a esta organización',
  NetworkError: 'Error de conexión',
  ServerError: 'Error del servidor',
}

export const REGISTER_ERROR_MESSAGE: Record<AuthError['kind'], string> = {
  InvalidCredentials: 'Credenciales incorrectas',
  OtpExpired: 'El código expiró. Solicita uno nuevo.',
  OtpInvalid: 'Código incorrecto',
  UserAlreadyExists: 'Ya existe una cuenta con estos datos',
  UserNotFound: 'Cuenta no encontrada',
  SessionExpired: 'Tu sesión expiró',
  WrongTenant: 'Esta cuenta no pertenece a esta organización',
  NetworkError: 'Error de conexión',
  ServerError: 'Error del servidor',
}
