import type { BadgeTone, BadgeToneClasses } from './types'

export const toneClasses: Record<BadgeTone, BadgeToneClasses> = {
  neutral: { soft: 'text-text-body bg-[var(--kipo-cream-200)]', solid: 'bg-[var(--kipo-cream-600)]', dot: 'bg-[var(--kipo-cream-600)]' },
  brand:   { soft: 'text-brand-strong bg-[var(--kipo-red-50)]', solid: 'bg-brand-strong', dot: 'bg-brand-strong' },
  success: { soft: 'text-[#0E6B47] bg-success-soft', solid: 'bg-success', dot: 'bg-success' },
  warning: { soft: 'text-[#8A5A06] bg-warning-soft', solid: 'bg-warning', dot: 'bg-warning' },
  danger:  { soft: 'text-brand-strong bg-danger-soft', solid: 'bg-danger', dot: 'bg-danger' },
  info:    { soft: 'text-[#5B21B6] bg-info-soft', solid: 'bg-info', dot: 'bg-info' },
}
