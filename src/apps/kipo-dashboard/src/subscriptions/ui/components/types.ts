export type PlanTier = 'free' | 'pro' | 'pyme' | 'enterprise'

export interface UITenantPlan {
  planType: 'free' | 'pro' | 'enterprise'
  status: string
  tier: PlanTier
  features: string[]
  historyMonths: number | null
}

export interface UIUpgradeOption {
  tier: PlanTier
  name: string
  priceLabel: string
  description: string
  highlights: string[]
}
