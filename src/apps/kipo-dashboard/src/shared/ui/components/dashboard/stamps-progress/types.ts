import type { DashboardStamps } from '@/src/dashboard/ui/hooks/useDashboardSummary'

export interface StampsProgressProps {
  stamps: DashboardStamps | null
  onBuyClick?: () => void
}
