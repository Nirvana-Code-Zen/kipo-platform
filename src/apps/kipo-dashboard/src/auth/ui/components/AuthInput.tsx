'use client'

import { useState } from 'react'

import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  suffix?: ReactNode
  error?: string
}

export function AuthInput ({ label, suffix, error, id, style, ...rest }: AuthInputProps) {
  const [focus, setFocus] = useState(false)
  const inputId = id ?? 'auth-' + label.replace(/\s+/g, '-').toLowerCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      <label htmlFor={inputId} className='sr-only'>{label}</label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-subtle)',
          border: `1.5px solid ${error ? 'var(--kipo-danger)' : focus ? 'var(--brand)' : 'transparent'}`,
          borderRadius: 14,
          padding: '0 16px',
          boxShadow: focus && !error ? '0 0 0 3px var(--focus-ring)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '15px 0',
            fontSize: 15,
            color: 'var(--text-strong)',
            fontFamily: 'var(--font-body)',
          }}
          {...rest}
        />
        {suffix && (
          <span style={{ color: 'var(--text-muted)', display: 'flex', lineHeight: 0, flexShrink: 0 }}>
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: 'var(--kipo-danger)', fontFamily: 'var(--font-body)', margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
}
