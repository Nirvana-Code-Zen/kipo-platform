import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'none' | 'xs' | 'sm' | 'md' | 'lg'
  padding?: string
  radius?: string
  interactive?: boolean
  children?: ReactNode
}

const shadows: Record<string, string> = {
  none: 'none',
  xs:   'var(--shadow-xs)',
  sm:   'var(--shadow-sm)',
  md:   'var(--shadow-md)',
  lg:   'var(--shadow-lg)',
}

export function Card({
  elevation = 'sm',
  padding = 'var(--space-5)',
  radius = 'var(--radius-lg)',
  interactive = false,
  children,
  className,
  style,
  ...rest
}: CardProps) {
  const shadow = shadows[elevation] ?? shadows.sm

  return (
    <div
      className={cn(className)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: radius,
        boxShadow: shadow,
        padding,
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!interactive) return
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        if (!interactive) return
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = shadow
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
