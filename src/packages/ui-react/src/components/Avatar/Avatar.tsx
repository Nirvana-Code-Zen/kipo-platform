import { type HTMLAttributes } from 'react'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name?: string
  src?: string | null
  size?: number
}

export function Avatar({ name = '', src = null, size = 40, style, ...rest }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-circle)',
        background: src ? `center/cover url(${src})` : 'var(--kipo-gradient)',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: size * 0.4,
        letterSpacing: '-0.01em',
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      {!src && initials}
    </div>
  )
}
