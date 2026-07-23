import type { ButtonSize, ButtonTone, ButtonVariant } from './types'

export const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-2 px-3.5 text-[13px] rounded-kipo-sm gap-1.5',
  md: 'py-3 px-5 text-[15px] rounded-kipo gap-2',
  lg: 'py-4 px-[26px] text-base rounded-kipo gap-2.5',
}

export const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-kipo-gradient text-text-on-brand border-0 shadow-kipo-brand',
  accent: 'bg-accent text-text-on-accent border-0 shadow-kipo-accent',
  secondary: 'bg-surface-card text-text-strong border-[1.5px] border-border-strong shadow-kipo-xs',
  ghost: 'bg-transparent border-0 shadow-none',
  danger: 'bg-danger text-white border-0 shadow-none',
}

export const ghostToneClasses: Record<ButtonTone, string> = {
  brand: 'text-brand',
  accent: 'text-accent-strong',
  danger: 'text-danger',
}
