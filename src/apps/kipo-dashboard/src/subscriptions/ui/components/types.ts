export type PlanTier = 'basico' | 'emprendedor' | 'pyme' | 'enterprise'

export interface UITenantPlan {
  planType: 'free' | 'pro' | 'enterprise'
  status: string
  tier: PlanTier
  features: string[]
  historyMonths: number | null
}

export interface UIUpgradeOption {
  tier: Extract<PlanTier, 'emprendedor' | 'pyme'>
  name: string
  priceLabel: string
  description: string
  highlights: string[]
}
