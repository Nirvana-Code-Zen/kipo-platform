import { type CSSProperties } from 'react'

export interface SwitchProps {
  checked?: boolean
  onChange?: (next: boolean) => void
  disabled?: boolean
  label?: string
  style?: CSSProperties
}

export function Switch({ checked = false, onChange, disabled = false, label = '', style }: SwitchProps) {
  const toggle = () => { if (!disabled && onChange) onChange(!checked) }

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <span
        onClick={toggle}
        role="switch"
        aria-checked={checked}
        style={{
          width: 46,
          height: 28,
          borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--kipo-gradient)' : 'var(--kipo-gray-300)',
          position: 'relative',
          transition: 'background var(--dur-base) var(--ease-out)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 22,
            height: 22,
            borderRadius: 'var(--radius-circle)',
            background: '#fff',
            boxShadow: 'var(--shadow-sm)',
            transition: 'left var(--dur-base) var(--ease-out)',
          }}
        />
      </span>
      {label && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-body)' }}>{label}</span>
      )}
    </label>
  )
}
