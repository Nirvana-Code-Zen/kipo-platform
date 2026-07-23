'use client'

import { useState } from 'react'

import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@kipo/ui-react'

import { AuthInput } from '../components/AuthInput'
import { useAuth } from '../hooks/useAuth'
import { LOGIN_ERROR_MESSAGE } from './constants'

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

export const LoginView = ({ tenantName }: { tenantName?: string } = {}) => {
  const { isLoading, isOtpPending, error, pendingOtp, clearError, loginWithEmail, loginWithSocial, requestOtp, verifyOtp } = useAuth()

  const [tab, setTab] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    void loginWithEmail({ email, password })
  }
  const handleSocial = (provider: string) => {
    void loginWithSocial({ provider: provider as 'google' | 'apple' | 'facebook' })
  }
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault()
    void requestOtp({ phone })
  }
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (pendingOtp) void verifyOtp({ otpToken: pendingOtp.otpToken, code: otpCode })
  }

  return (
    <>
      <div className='mb-7'>
        <h1 className='font-display font-bold text-[34px] text-foreground tracking-[-0.03em] leading-[1.15] mb-2.5'>
          Bienvenido de nuevo
        </h1>
        <p className='text-sm text-muted-foreground font-sans'>
          ¿No tienes cuenta?{' '}
          <Link
            href='/register'
            className='text-foreground font-semibold underline underline-offset-[3px]'
          >
            Regístrate
          </Link>
        </p>
      </div>

      {tenantName && (
        <div className='bg-muted border-[1.5px] border-border-subtle rounded-kipo px-3.5 py-2.5 text-[13px] text-foreground font-sans mb-4'>
          Iniciando sesión en <strong>{tenantName}</strong>
        </div>
      )}

      {error && (
        <div
          role='alert'
          className='bg-danger-soft border-[1.5px] border-danger rounded-kipo px-3.5 py-2.5 text-[13px] text-danger font-sans mb-5'
        >
          {LOGIN_ERROR_MESSAGE[error.kind] ?? 'Error desconocido'}
        </div>
      )}

      <div className='flex border-b-[1.5px] border-border-subtle mb-6'>
        {(['email', 'phone'] as const).map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => { clearError(); setTab(t) }}
            className={[
              'py-2 px-1 mr-5 text-sm font-sans cursor-pointer bg-transparent border-0 border-b-2 -mb-[1.5px] transition-[color,border-color] duration-150',
              tab === t
                ? 'font-semibold text-foreground border-brand'
                : 'font-normal text-muted-foreground border-transparent',
            ].join(' ')}
          >
            {t === 'email' ? 'Correo' : 'Teléfono'}
          </button>
        ))}
      </div>

      {tab === 'email' && (
        <form onSubmit={handleEmailLogin} className='flex flex-col gap-3'>
          <AuthInput
            label='Correo electrónico'
            type='email'
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='tu@empresa.com'
          />
          <AuthInput
            label='Contraseña'
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Contraseña'
            suffix={
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className='bg-transparent border-0 cursor-pointer text-muted-foreground flex p-0 leading-none'
              >
                <EyeIcon open={showPassword} />
              </button>
            }
          />
          <div className='mt-2'>
            <Button type='submit' variant='primary' size='md' full disabled={isLoading}>
              {isLoading ? <><Loader2 size={16} className='animate-spin' /> Entrando…</> : 'Entrar'}
            </Button>
          </div>
        </form>
      )}

      {tab === 'phone' && !isOtpPending && (
        <form onSubmit={handleRequestOtp} className='flex flex-col gap-3'>
          <AuthInput
            label='Número de teléfono'
            type='tel'
            required
            autoComplete='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='+52 55 1234 5678'
          />

          <div className='mt-2'>
            <Button type='submit' variant='primary' size='md' full disabled={isLoading}>
              {isLoading ? <><Loader2 size={16} className='animate-spin' /> Enviando…</> : 'Enviar código'}
            </Button>
          </div>
        </form>
      )}

      {tab === 'phone' && isOtpPending && (
        <form onSubmit={handleVerifyOtp} className='flex flex-col gap-3.5'>
          <p className='text-sm text-text-body font-sans leading-normal m-0'>
            Código enviado a <strong className='text-foreground'>{pendingOtp?.phone}</strong>{' '}
            vía SMS
          </p>

          <div className='flex flex-col gap-1'>
            <label htmlFor='otp-code' className='sr-only'>Código de verificación</label>
            <div className='flex items-center bg-muted border-[1.5px] border-transparent rounded-[14px] px-4'>
              <input
                id='otp-code'
                type='text'
                inputMode='numeric'
                maxLength={6}
                required
                autoComplete='one-time-code'
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder='000000'
                className='flex-1 border-0 outline-none bg-transparent py-[15px] text-2xl text-center tracking-[0.3em] font-mono text-foreground tabular-nums'
              />
            </div>
          </div>

          <div className='mt-1'>
            <Button type='submit' variant='primary' size='md' full disabled={isLoading || otpCode.length < 6}>
              {isLoading ? <><Loader2 size={16} className='animate-spin' /> Verificando…</> : 'Verificar'}
            </Button>
          </div>

          <button
            type='button'
            onClick={() => { clearError(); setOtpCode('') }}
            className='bg-transparent border-0 cursor-pointer text-[13px] text-muted-foreground font-sans p-0 text-center'
          >
            Cambiar número
          </button>
        </form>
      )}

      <div className='flex items-center gap-3 my-6 mb-5'>
        <div className='flex-1 h-px bg-border-subtle' />
        <span className='text-xs text-muted-foreground font-sans whitespace-nowrap'>
          O continúa con
        </span>
        <div className='flex-1 h-px bg-border-subtle' />
      </div>

      <div className='flex flex-col gap-2.5'>
        <div className='grid grid-cols-2 gap-2.5'>
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
    </>
  )
}
