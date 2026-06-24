import { useState, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  hint?: string
  error?: string
  mono?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
}

export function Input({ label, hint, error, mono = false, prefix, suffix, style, id, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false)
  const inputId = id ?? (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined)

  const borderColor = error
    ? 'var(--kipo-danger)'
    : focus
    ? 'var(--brand)'
    : 'var(--border-strong)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--text-strong)' }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface-card)',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          padding: '0 14px',
          boxShadow: focus ? '0 0 0 4px var(--focus-ring)' : 'none',
          transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
        }}
      >
        {prefix && (
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>{prefix}</span>
        )}
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '12px 0',
            fontSize: 15,
            color: 'var(--text-strong)',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
            fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
            letterSpacing: mono ? '-0.01em' : 'normal',
          }}
          {...rest}
        />
        {suffix && (
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>{suffix}</span>
        )}
      </div>
      {(error ?? hint) && (
        <span style={{ fontSize: 12, color: error ? 'var(--kipo-danger)' : 'var(--text-muted)' }}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
