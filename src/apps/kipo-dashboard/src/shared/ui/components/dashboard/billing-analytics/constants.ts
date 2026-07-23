export const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export const barColors = ['#2d6a9f', '#1c4f78', '#0a3352', '#032641', '#1c4f78', '#1c4f78', '#0a3352']

export type ViewMode = 'monthly' | 'current-week' | 'custom-week'

export const viewButtons: { key: ViewMode; label: string }[] = [
  { key: 'monthly',      label: 'Mensual' },
  { key: 'current-week', label: 'Esta semana' },
  { key: 'custom-week',  label: 'Por semana' },
]

export const formatMXN = (value: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value)

export const formatAxisMXN = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
  return value === 0 ? '' : `$${value}`
}

export function getWeekStart(offsetWeeks: number): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - dayOfWeek + offsetWeeks * 7)
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

export function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart)
  end.setDate(weekStart.getDate() + 6)
  const fmt = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`
  return `${fmt(weekStart)} — ${fmt(end)}`
}

export const MONTHLY_BAR_HEIGHTS = ['h-[90px]', 'h-[140px]', 'h-[110px]', 'h-[160px]', 'h-[180px]', 'h-[130px]', 'h-[100px]', 'h-10', 'h-10', 'h-10', 'h-10', 'h-10'] as const

export const WEEKLY_BAR_HEIGHTS = ['h-[80px]', 'h-[160px]', 'h-[130px]', 'h-[210px]', 'h-[70px]', 'h-[180px]', 'h-[95px]'] as const
