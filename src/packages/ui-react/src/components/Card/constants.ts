import type { CardElevation, CardPadding } from './types'

export const elevationClasses: Record<CardElevation, string> = {
  none: 'shadow-none',
  xs: 'shadow-kipo-xs',
  sm: 'shadow-kipo-sm',
  md: 'shadow-kipo-md',
  lg: 'shadow-kipo-lg',
}

export const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}
