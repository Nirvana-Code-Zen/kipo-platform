'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { Button } from '@kipo/ui-react'

import { AuthInput } from '../components/AuthInput'
import { AuthShell } from '../components/AuthShell'
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

const EyeIcon = ({ open }: { open: boolean }) => open
  ? (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  )
  : (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
      <line x1='1' y1='1' x2='23' y2='23' />
    </svg>
  )

const GoogleIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
    <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
    <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
    <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05' />
    <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
  </svg>
)

const AppleIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M16.52 0c.2 1.58-.46 3.15-1.34 4.28-.89 1.14-2.33 2.03-3.76 1.92-.22-1.52.5-3.1 1.37-4.17C13.71.89 15.2.07 16.52 0zM21.5 17.2c-.74 1.64-1.09 2.37-2.04 3.82-.93 1.42-2.27 3.21-3.9 3.22-1.46.01-1.84-.95-3.83-.94-1.99.01-2.41.96-3.88.95-1.63-.01-2.88-1.66-3.82-3.09C1.48 17.49.5 13.6 1.93 10.9c1-1.89 2.8-3 4.5-3 1.69 0 2.75.93 4.14.93 1.35 0 2.18-.94 4.12-.94 1.52 0 3.13.83 4.14 2.25a5.1 5.1 0 0 0-2.43 4.42c.04 2.26 1.3 3.39 2.1 4.64z' />
  </svg>
)

const FacebookIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='#1877F2' aria-hidden='true'>
    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
  </svg>
)

export const RegisterView = () => {
  const router = useRouter()
  const { register, requestOtp, verifyOtp, loginWithSocial, isLoading, isOtpPending, error, pendingOtp, clearError } = useAuth()

  const [tab, setTab] = useState<'email' | 'phone'>('email')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    await verifyOtp({ otpToken: pendingOtp.otpToken, code: otpCode })
    if (!error) redirect()
  }

  const handleSocial = async (provider: Extract<AuthProvider, 'google' | 'apple' | 'facebook'>) => {
    await loginWithSocial({ provider, idToken: '' })
    if (!error) redirect()
  }

  return (
    <AuthShell>
      {/* Heading */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 34,
            color: 'var(--text-strong)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: 10,
          }}
        >
          Crea tu cuenta
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          ¿Ya tienes cuenta?{' '}
          <a
            href='/login'
            style={{ color: 'var(--text-strong)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            Inicia sesión
          </a>
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role='alert'
          style={{
            background: 'var(--kipo-danger-bg)',
            border: '1.5px solid var(--kipo-danger)',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 13,
            color: 'var(--kipo-danger)',
            fontFamily: 'var(--font-body)',
            marginBottom: 20,
          }}
        >
          {ERROR_MESSAGE[error.kind] ?? 'Error desconocido'}
        </div>
      )}

      {/* Underline tabs */}
      <div style={{ display: 'flex', borderBottom: '1.5px solid var(--border-subtle)', marginBottom: 24 }}>
        {(['email', 'phone'] as const).map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => { clearError(); setTab(t) }}
            style={{
              padding: '8px 4px',
              marginRight: 20,
              fontSize: 14,
              fontWeight: tab === t ? 600 : 400,
              fontFamily: 'var(--font-body)',
              color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === t ? 'var(--brand)' : 'transparent'}`,
              marginBottom: -1.5,
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {t === 'email' ? 'Correo' : 'Teléfono'}
          </button>
        ))}
      </div>

      {/* Email form */}
      {tab === 'email' && (
        <form onSubmit={handleEmailRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AuthInput
            label='Nombre o empresa'
            type='text'
            required
            autoComplete='name'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder='Refaccionaria López S.A. de C.V.'
          />
          <AuthInput
            label='Correo electrónico'
            type='email'
            required
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='tu@empresa.com'
          />
          <AuthInput
            label='Contraseña'
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            autoComplete='new-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Contraseña (mín. 8 caracteres)'
            suffix={
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0, lineHeight: 0 }}
              >
                <EyeIcon open={showPassword} />
              </button>
            }
          />
          <div style={{ marginTop: 8 }}>
            <Button type='submit' variant='primary' size='md' full disabled={isLoading}>
              {isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>
          </div>
        </form>
      )}

      {/* Phone: request OTP */}
      {tab === 'phone' && !isOtpPending && (
        <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AuthInput
            label='Número de teléfono'
            type='tel'
            required
            autoComplete='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='+52 55 1234 5678'
          />

          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)', marginBottom: 8 }}>
              Recibir código por
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type='button' variant={channel === 'whatsapp' ? 'primary' : 'secondary'} size='sm' full onClick={() => setChannel('whatsapp')}>
                WhatsApp
              </Button>
              <Button type='button' variant={channel === 'sms' ? 'primary' : 'secondary'} size='sm' full onClick={() => setChannel('sms')}>
                SMS
              </Button>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type='submit' variant='primary' size='md' full disabled={isLoading}>
              {isLoading ? 'Enviando…' : 'Enviar código'}
            </Button>
          </div>
        </form>
      )}

      {/* Phone: verify OTP */}
      {tab === 'phone' && isOtpPending && (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 14, color: 'var(--text-body)', fontFamily: 'var(--font-body)', lineHeight: 1.5, margin: 0 }}>
            Código enviado a <strong style={{ color: 'var(--text-strong)' }}>{pendingOtp?.phone}</strong>{' '}
            vía {pendingOtp?.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label htmlFor='otp-code-register' className='sr-only'>Código de verificación</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-subtle)',
                border: '1.5px solid transparent',
                borderRadius: 14,
                padding: '0 16px',
              }}
            >
              <input
                id='otp-code-register'
                type='text'
                inputMode='numeric'
                maxLength={6}
                required
                autoComplete='one-time-code'
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder='000000'
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '15px 0',
                  fontSize: 24,
                  textAlign: 'center',
                  letterSpacing: '0.3em',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-strong)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 4 }}>
            <Button type='submit' variant='primary' size='md' full disabled={isLoading || otpCode.length < 6}>
              {isLoading ? 'Verificando…' : 'Verificar y registrarse'}
            </Button>
          </div>

          <button
            type='button'
            onClick={() => { clearError(); setOtpCode('') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', padding: 0, textAlign: 'center' }}
          >
            Cambiar número
          </button>
        </form>
      )}

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
          O regístrate con
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
      </div>

      {/* Social: Google + Apple side by side, Facebook full width */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Button variant='secondary' size='md' full disabled={isLoading} iconLeft={<GoogleIcon />} onClick={() => handleSocial('google')}>
            Google
          </Button>
          <Button variant='secondary' size='md' full disabled={isLoading} iconLeft={<AppleIcon />} onClick={() => handleSocial('apple')}>
            Apple
          </Button>
        </div>
        <Button variant='secondary' size='md' full disabled={isLoading} iconLeft={<FacebookIcon />} onClick={() => handleSocial('facebook')}>
          Continuar con Facebook
        </Button>
      </div>
    </AuthShell>
  )
}
