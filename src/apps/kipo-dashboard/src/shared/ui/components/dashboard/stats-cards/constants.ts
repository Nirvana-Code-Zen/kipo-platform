import type { DashboardStats, MonthStats } from '@/src/dashboard/ui/hooks/useDashboardSummary'

export function monthDelta(stats: DashboardStats | null, key: keyof MonthStats): string {
  if (!stats) return 'vs mes anterior'
  const d = stats.this_month[key] - stats.prev_month[key]
  return `${d >= 0 ? '+' : ''}${d} vs mes anterior`
}

export function buildStats(stats: DashboardStats | null) {
  return [
    {
      title: 'Total Facturas',
      value: stats ? String(stats.total) : '—',
      increase: monthDelta(stats, 'total'),
      filter: 'all',
      isPrimary: true,
      delay: 'delay-0',
    },
    {
      title: 'Canceladas',
      value: stats ? String(stats.cancelled) : '—',
      increase: monthDelta(stats, 'cancelled'),
      filter: 'cancelled',
      isPrimary: false,
      delay: 'delay-100',
    },
    {
      title: 'Timbradas',
      value: stats ? String(stats.stamped) : '—',
      increase: monthDelta(stats, 'stamped'),
      filter: 'stamped',
      isPrimary: false,
      delay: 'delay-200',
    },
    {
      title: 'Borradores',
      value: stats ? String(stats.draft) : '—',
      subtitle: 'En revisión',
      filter: 'draft',
      isPrimary: false,
      delay: 'delay-300',
    },
  ]
}
