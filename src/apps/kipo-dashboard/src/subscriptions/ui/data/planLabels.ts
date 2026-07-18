import type { PlanTier } from '../components/types'

export const PLAN_LABELS: Record<PlanTier, { name: string; priceLabel: string }> = {
  free: { name: 'Plan Básico', priceLabel: 'Gratis' },
  pro: { name: 'Plan Emprendedor', priceLabel: '$299 MXN/mes' },
  pyme: { name: 'Plan PyME', priceLabel: '$599 MXN/mes' },
  enterprise: { name: 'Plan Enterprise', priceLabel: 'Personalizado' },
}
