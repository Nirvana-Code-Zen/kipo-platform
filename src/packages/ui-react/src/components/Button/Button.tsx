import { type ButtonHTMLAttributes, type ReactNode, type CSSProperties } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const sizes = {
  sm: { padding: '8px 14px',  fontSize: 13, borderRadius: 'var(--radius-sm)', gap: 6 },
  md: { padding: '12px 20px', fontSize: 15, borderRadius: 'var(--radius-md)', gap: 8 },
  lg: { padding: '16px 26px', fontSize: 16, borderRadius: 'var(--radius-md)', gap: 10 },
} satisfies Record<string, CSSProperties & { gap: number }>

const variants = {
  primary:   { background: 'var(--kipo-gradient)', color: 'var(--text-on-brand)', border: 'none', boxShadow: 'var(--shadow-brand)' },
  accent:    { background: 'var(--accent)',         color: 'var(--text-on-accent)', border: 'none', boxShadow: 'var(--shadow-accent)' },
  secondary: { background: 'var(--surface-card)',   color: 'var(--text-strong)', border: '1.5px solid var(--border-strong)', boxShadow: 'var(--shadow-xs)' },
  ghost:     { background: 'transparent',           color: 'var(--brand)', border: 'none', boxShadow: 'none' },
  danger:    { background: 'var(--kipo-danger)',    color: '#fff', border: 'none', boxShadow: 'none' },
} satisfies Record<string, CSSProperties>

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style,
  ...rest
}: ButtonProps) {
  const s = sizes[size]
  const v = variants[variant]

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        width: full ? '100%' : 'auto',
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.borderRadius,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
        ...v,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
