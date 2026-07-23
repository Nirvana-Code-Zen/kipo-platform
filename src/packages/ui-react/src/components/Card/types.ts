import { type HTMLAttributes, type ReactNode } from 'react'

export type CardElevation = 'none' | 'xs' | 'sm' | 'md' | 'lg'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation
  padding?: CardPadding
  interactive?: boolean
  children?: ReactNode
}
