'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { Button } from '@kipo/ui-react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'
import { AuthInput } from '@/src/auth/ui/components/AuthInput'

import { useOnboardingDisplayName } from '../hooks/useOnboardingDisplayName'
import { useOnboardingForm } from '../hooks/useOnboardingForm'

const TIMEZONES = [
  'America/Mexico_City',
  'America/Monterrey',
  'America/Tijuana',
  'America/Hermosillo',
  'America/Cancun',
]

const CURRENCIES = ['MXN', 'USD']

export const OnboardingView = () => {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)

  const patchSession = useAuthStore((s) => s.persistedSession)
  const setStore = useAuthStore.setState

  const onTenantSuccess = (tenantId: string, schemaName: string) => {
    if (patchSession) {
      setStore((prev) => ({
        persistedSession: prev.persistedSession
          ? { ...prev.persistedSession, tenantId, tenantSlug: schemaName as never }
          : prev.persistedSession,
      }))
    }
    router.replace('/dashboard')
  }

  const nameHook = useOnboardingDisplayName(() => setStep(2))

  const {
    name, setName,
    timezone, setTimezone,
    currency, setCurrency,
    isLoading: tenantLoading,
    error: tenantError,
    isValid: tenantValid,
    submit: submitTenant,
  } = useOnboardingForm(onTenantSuccess)

  const initials = nameHook.displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    void nameHook.submit()
  }

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    void submitTenant()
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-base)',
    padding: '24px 16px',
  }

  const cardStyle: React.CSSProperties = { width: '100%', maxWidth: 480 }

  const stepLabelStyle: React.CSSProperties = {
    fontSize: 13,
    color: 'var(--brand)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    marginBottom: 8,
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 32,
    color: 'var(--text-strong)',
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
    marginBottom: 10,
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: 14,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    lineHeight: 1.5,
  }

  const errorBannerStyle: React.CSSProperties = {
    background: 'var(--kipo-danger-bg)',
    border: '1.5px solid var(--kipo-danger)',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 13,
    color: 'var(--kipo-danger)',
    fontFamily: 'var(--font-body)',
    marginBottom: 20,
  }

  const selectStyle: React.CSSProperties = {
    background: 'var(--bg-subtle)',
    border: '1.5px solid transparent',
    borderRadius: 14,
    padding: '14px 16px',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    color: 'var(--text-strong)',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  }

  if (step === 1) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ marginBottom: 32 }}>
            <p style={stepLabelStyle}>Paso 1 de 2</p>
            <h1 style={headingStyle}>¿Cómo te llaman?</h1>
            <p style={subtitleStyle}>
              Tu nombre aparecerá en tu perfil y en los documentos que generes.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'var(--surface-brand-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--brand)',
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--brand)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {initials || '?'}
              </span>
            </div>
          </div>

          {nameHook.error && (
            <div role='alert' style={errorBannerStyle}>
              {nameHook.error}
            </div>
          )}

          <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AuthInput
              label='Tu nombre completo'
              type='text'
              required
              value={nameHook.displayName}
              onChange={(e) => nameHook.setDisplayName(e.target.value)}
              placeholder='Ej. Ana García'
              autoFocus
            />

            <div style={{ marginTop: 8 }}>
              <Button
                type='submit'
                variant='primary'
                size='md'
                full
                disabled={nameHook.isLoading || !nameHook.isValid}
              >
                {nameHook.isLoading ? 'Guardando…' : 'Continuar →'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 32 }}>
          <p style={stepLabelStyle}>Paso 2 de 2</p>
          <h1 style={headingStyle}>Configura tu empresa</h1>
          <p style={subtitleStyle}>
            Esta información crea tu espacio de trabajo en Kipo.
          </p>
        </div>

        {tenantError && (
          <div role='alert' style={errorBannerStyle}>
            {tenantError.message}
          </div>
        )}

        <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AuthInput
            label='Nombre de la empresa'
            type='text'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Ej. Refaccionaria López S.A.'
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)' }}>
                Zona horaria
              </label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={selectStyle}>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz.split('/')[1].replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)' }}>
                Moneda
              </label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={selectStyle}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type='submit' variant='primary' size='md' full disabled={tenantLoading || !tenantValid}>
              {tenantLoading ? 'Creando empresa…' : 'Crear empresa y continuar →'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
