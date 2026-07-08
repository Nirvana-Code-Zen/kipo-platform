'use client'

import Link from 'next/link'
import { MailCheck } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

export const EmailConfirmView = () => {
  const { pendingEmail } = useAuth()

  return (
    <>
      <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>
          <MailCheck />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 28,
            color: 'var(--text-strong)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Revisa tu correo
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        >
          Enviamos un enlace de confirmación a
        </p>
        {pendingEmail && (
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-strong)',
              fontFamily: 'var(--font-body)',
              marginBottom: 24,
            }}
          >
            {pendingEmail}
          </p>
        )}
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
          }}
        >
          Confirma tu cuenta para continuar.
          <br />
          Después podrás iniciar sesión y configurar tu empresa.
        </p>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 20,
          textAlign: 'center',
        }}
      >
        <Link
          href='/login'
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </>
  )
}
