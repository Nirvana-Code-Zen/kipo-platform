import { type HTMLAttributes, type ReactNode } from 'react'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  solid?: boolean
  dot?: boolean
  children?: ReactNode
}

export interface BadgeToneClasses {
  soft: string
  solid: string
  dot: string
}
