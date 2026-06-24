import type { ReactNode, CSSProperties } from 'react'

export function DocPage({ category, children }: { category: string; children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: '20px 48px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
          {category}
        </span>
      </div>
      {children}
    </div>
  )
}

function DocBtn({ children }: { children: ReactNode }) {
  return (
    <button style={{
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderRadius: 8,
      padding: '6px 14px',
      cursor: 'pointer',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </button>
  )
}

export function DocSection({
  title,
  subtitle,
  children,
  cardStyle,
}: {
  title: string
  subtitle: string
  children: ReactNode
  cardStyle?: CSSProperties
}) {
  return (
    <div style={{ padding: '40px 48px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--text-strong)',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            {title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'var(--text-muted)',
            margin: '5px 0 0',
            lineHeight: 1.4,
          }}>
            {subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 32 }}>
          <DocBtn>Feedback</DocBtn>
          <DocBtn>↗ Edit</DocBtn>
        </div>
      </div>
      <div style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        overflow: 'hidden',
        ...cardStyle,
      }}>
        {children}
      </div>
      <div style={{
        marginTop: 12,
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--text-muted)',
        paddingLeft: 2,
        cursor: 'pointer',
      }}>
        Add usage notes
      </div>
    </div>
  )
}

export function Swatch({
  step,
  hex,
  dark = false,
  style,
}: {
  step: string | number
  hex?: string
  dark?: boolean
  style?: CSSProperties
}) {
  const textColor = dark ? '#fff' : '#1A150F'
  const subColor = dark ? 'rgba(255,255,255,0.55)' : 'rgba(26,21,15,0.45)'
  return (
    <div style={{
      borderRadius: 12,
      minHeight: 112,
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      flex: '1 1 0',
      minWidth: 0,
      ...style,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: textColor, lineHeight: 1.3 }}>
        {step}
      </span>
      {hex && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: subColor, marginTop: 2 }}>
          {hex}
        </span>
      )}
    </div>
  )
}

export function SwatchRow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', gap: 8, ...style }}>
      {children}
    </div>
  )
}

export function MonoMeta({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 20,
      lineHeight: 1.5,
    }}>
      {children}
    </div>
  )
}
