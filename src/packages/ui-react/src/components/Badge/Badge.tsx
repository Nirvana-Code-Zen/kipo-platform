import { type HTMLAttributes, type ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'
  solid?: boolean
  dot?: boolean
  children?: ReactNode
}

const tones = {
  neutral: { fg: 'var(--text-body)',      bg: 'var(--kipo-cream-200)',   solidBg: 'var(--kipo-cream-600)' },
  brand:   { fg: 'var(--kipo-red-dark)',  bg: 'var(--kipo-red-50)',      solidBg: 'var(--kipo-red-dark)' },
  success: { fg: '#0E6B47',               bg: 'var(--kipo-success-bg)',  solidBg: 'var(--kipo-success)' },
  warning: { fg: '#8A5A06',               bg: 'var(--kipo-warning-bg)',  solidBg: 'var(--kipo-warning)' },
  danger:  { fg: 'var(--kipo-red-dark)',  bg: 'var(--kipo-danger-bg)',   solidBg: 'var(--kipo-danger)' },
  info:    { fg: '#5B21B6',               bg: 'var(--kipo-info-bg)',     solidBg: 'var(--kipo-info)' },
}

export function Badge({ tone = 'neutral', solid = false, dot = false, children, style, ...rest }: BadgeProps) {
  const t = tones[tone]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12,
        lineHeight: 1.3,
        color: solid ? '#fff' : t.fg,
        background: solid ? t.solidBg : t.bg,
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: solid ? '#fff' : t.solidBg, flexShrink: 0 }} />
      )}
      {children}
    </span>
  )
}
