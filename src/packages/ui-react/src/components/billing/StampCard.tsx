import { type CSSProperties } from 'react'

export interface StampCardProps {
  qty?: number
  unitPrice?: number
  label?: string
  featured?: boolean
  selected?: boolean
  onSelect?: (qty: number) => void
  style?: CSSProperties
}

export function StampCard({
  qty = 50,
  unitPrice = 3.5,
  label = '',
  featured = false,
  selected = false,
  onSelect,
  style,
}: StampCardProps) {
  const totalParts = (qty * unitPrice).toLocaleString('es-MX', { minimumFractionDigits: 2 })

  return (
    <button
      onClick={() => onSelect?.(qty)}
      style={{
        position: 'relative',
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        background: featured ? 'var(--kipo-gradient)' : 'var(--surface-card)',
        color: featured ? '#fff' : 'var(--text-strong)',
        border: selected
          ? '2px solid var(--brand)'
          : featured
          ? '2px solid transparent'
          : '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        boxShadow: featured ? 'var(--shadow-brand)' : 'var(--shadow-xs)',
        transition: 'transform var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {label && (
        <span
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            padding: '3px 9px',
            borderRadius: 'var(--radius-pill)',
            background: featured ? 'var(--kipo-lime-500)' : 'var(--kipo-red-50)',
            color: featured ? 'var(--kipo-slate-900)' : 'var(--kipo-red-dark)',
          }}
        >
          {label}
        </span>
      )}

      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 34, letterSpacing: '-0.02em' }}>
        {qty}
      </div>
      <div style={{ fontSize: 13, opacity: featured ? 0.85 : 0.6, marginTop: 2 }}>
        timbres CFDI
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: `1px solid ${featured ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)'}`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 22 }}>${totalParts}</span>
        <span style={{ fontSize: 12, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
          ${unitPrice.toFixed(2)}/u
        </span>
      </div>
    </button>
  )
}
