'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@kipo/ui-react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'
import { AuthInput } from '@/src/auth/ui/components/AuthInput'

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
  const patchSession = useAuthStore((s) => s.persistedSession)
  const setStore = useAuthStore.setState

  const onSuccess = (tenantId: string, schemaName: string) => {
    if (patchSession) {
      setStore((prev) => ({
        persistedSession: prev.persistedSession
          ? { ...prev.persistedSession, tenantId, tenantSlug: schemaName as never }
          : prev.persistedSession,
      }))
    }
    router.replace('/dashboard')
  }

  const {
    name, setName,
    schemaName, setSchemaName,
    timezone, setTimezone,
    currency, setCurrency,
    isLoading, error, isValid, submit,
  } = useOnboardingForm(onSuccess)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void submit()
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--brand)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 8 }}>
            Paso 1 de 1
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 32,
              color: 'var(--text-strong)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            Configura tu empresa
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
            Esta información crea tu espacio de trabajo en Kipo.
          </p>
        </div>

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
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AuthInput
            label='Nombre de la empresa'
            type='text'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Ej. Refaccionaria López S.A.'
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-strong)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Identificador único
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-subtle)',
                borderRadius: 14,
                border: '1.5px solid transparent',
                padding: '0 16px',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                tenant/
              </span>
              <input
                type='text'
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                placeholder='mi-empresa'
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '15px 0',
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-strong)',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>
              Solo letras minúsculas, números y guiones. No se puede cambiar después.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)' }}>
                Zona horaria
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid transparent',
                  borderRadius: 14,
                  padding: '14px 16px',
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-strong)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz.split('/')[1].replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)' }}>
                Moneda
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid transparent',
                  borderRadius: 14,
                  padding: '14px 16px',
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-strong)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type='submit' variant='primary' size='md' full disabled={isLoading || !isValid}>
              {isLoading ? 'Creando empresa…' : 'Crear empresa y continuar →'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
