'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '../hooks/useAuth'

import type { AuthError } from '../../core/domain/exceptions/auth.errors'
import type { AuthProvider } from '../../core/domain/value-objects/AuthProvider'

const ERROR_MESSAGE: Record<AuthError['kind'], string> = {
  InvalidCredentials: 'Credenciales incorrectas',
  OtpExpired: 'El código expiró. Solicita uno nuevo.',
  OtpInvalid: 'Código incorrecto',
  UserAlreadyExists: 'Ya existe una cuenta con estos datos',
  UserNotFound: 'Cuenta no encontrada',
  SessionExpired: 'Tu sesión expiró',
  NetworkError: 'Error de conexión',
  ServerError: 'Error del servidor',
}

type RegisterTab = 'email' | 'phone' | 'social'

export const RegisterView = () => {
  const router = useRouter()
  const { register, requestOtp, verifyOtp, loginWithSocial, isLoading, isOtpPending, error, pendingOtp, clearError } = useAuth()

  const [tab, setTab] = useState<RegisterTab>('email')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp')

  const redirect = () => router.push('/dashboard')

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    await register({ provider: 'email', displayName, email, password })
    if (!error) redirect()
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await requestOtp({ phone, channel })
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pendingOtp) return
    // After OTP verify we get a session; if it's new user the backend may require additional onboarding
    await verifyOtp({ otpToken: pendingOtp.otpToken, code: otpCode })
    if (!error) redirect()
  }

  const handleSocial = async (provider: Extract<AuthProvider, 'google' | 'apple' | 'facebook'>) => {
    await loginWithSocial({ provider, idToken: '' })
    if (!error) redirect()
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-2'>Crear cuenta</h1>
        <p className='text-sm text-gray-500 mb-6'>Elige cómo quieres registrarte</p>

        {error && (
          <div className='mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700'>
            {ERROR_MESSAGE[error.kind] ?? 'Error desconocido'}
          </div>
        )}

        <div className='flex gap-1 mb-6 bg-gray-100 rounded-lg p-1'>
          {(['email', 'phone', 'social'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { clearError(); setTab(t) }}
              className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                tab === t ? 'bg-white shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'email' ? 'Correo' : t === 'phone' ? 'Teléfono' : 'Social'}
            </button>
          ))}
        </div>

        {/* Email tab */}
        {tab === 'email' && (
          <form onSubmit={handleEmailRegister} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre</label>
              <input
                type='text'
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Tu nombre o empresa'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Correo</label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='tu@correo.com'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Contraseña</label>
              <input
                type='password'
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Mínimo 8 caracteres'
              />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
            >
              {isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>
        )}

        {/* Phone tab */}
        {tab === 'phone' && !isOtpPending && (
          <form onSubmit={handleRequestOtp} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono</label>
              <input
                type='tel'
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='+52 55 1234 5678'
              />
            </div>
            <div className='flex gap-2'>
              {(['whatsapp', 'sms'] as const).map((ch) => (
                <button
                  key={ch}
                  type='button'
                  onClick={() => setChannel(ch)}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                    channel === ch
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {ch === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                </button>
              ))}
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
            >
              {isLoading ? 'Enviando…' : 'Enviar código'}
            </button>
          </form>
        )}

        {tab === 'phone' && isOtpPending && (
          <form onSubmit={handleVerifyOtp} className='space-y-4'>
            <p className='text-sm text-gray-600'>
              Código enviado a <strong>{pendingOtp?.phone}</strong> vía{' '}
              {pendingOtp?.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
            </p>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Código</label>
              <input
                type='text'
                inputMode='numeric'
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='000000'
              />
            </div>
            <button
              type='submit'
              disabled={isLoading || otpCode.length < 6}
              className='w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
            >
              {isLoading ? 'Verificando…' : 'Verificar y registrarse'}
            </button>
          </form>
        )}

        {/* Social tab */}
        {tab === 'social' && (
          <div className='space-y-3'>
            <button
              onClick={() => handleSocial('google')}
              disabled={isLoading}
              className='w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
                <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
                <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05' />
                <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
              </svg>
              Continuar con Google
            </button>
            <button
              onClick={() => handleSocial('apple')}
              disabled={isLoading}
              className='w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                <path d='M16.52 0c.2 1.58-.46 3.15-1.34 4.28-.89 1.14-2.33 2.03-3.76 1.92-.22-1.52.5-3.1 1.37-4.17C13.71.89 15.2.07 16.52 0zM21.5 17.2c-.74 1.64-1.09 2.37-2.04 3.82-.93 1.42-2.27 3.21-3.9 3.22-1.46.01-1.84-.95-3.83-.94-1.99.01-2.41.96-3.88.95-1.63-.01-2.88-1.66-3.82-3.09C1.48 17.49.5 13.6 1.93 10.9c1-1.89 2.8-3 4.5-3 1.69 0 2.75.93 4.14.93 1.35 0 2.18-.94 4.12-.94 1.52 0 3.13.83 4.14 2.25a5.1 5.1 0 0 0-2.43 4.42c.04 2.26 1.3 3.39 2.1 4.64z' />
              </svg>
              Continuar con Apple
            </button>
            <button
              onClick={() => handleSocial('facebook')}
              disabled={isLoading}
              className='w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors'
            >
              <svg className='w-5 h-5 text-blue-600' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
              </svg>
              Continuar con Facebook
            </button>
          </div>
        )}

        <p className='mt-6 text-center text-sm text-gray-500'>
          ¿Ya tienes cuenta?{' '}
          <a href='/login' className='text-blue-600 hover:underline font-medium'>
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}
