import type { RecentClient } from '@/src/dashboard/ui/hooks/useDashboardSummary'

export interface RecentClientsProps {
  clients: RecentClient[]
  isLoading: boolean
}
