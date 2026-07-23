import { Card } from '@kipo/ui-react'

function Sk({
  className = '',
  dark = false,
}: {
  className?: string
  dark?: boolean
}) {
  return (
    <div
      className={`${dark ? 'skeleton-dark' : 'skeleton'} ${className}`}
    />
  )
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className={`p-4 ${i === 0 ? 'bg-primary' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <Sk dark={i === 0} className="h-3 w-24" />
            <Sk dark={i === 0} className="w-6 h-6 rounded-full" />
          </div>
          <Sk dark={i === 0} className="h-8 w-16 mb-2" />
          <Sk dark={i === 0} className="h-3 w-36" />
        </Card>
      ))}
    </div>
  )
}

const BAR_HEIGHTS = [
  'h-[80px]',
  'h-[140px]',
  'h-[110px]',
  'h-[180px]',
  'h-[65px]',
  'h-[155px]',
  'h-[90px]',
] as const

const VARIABLE_WIDTHS = ['w-[55%]', 'w-[70%]', 'w-[85%]'] as const
const RECENT_CLIENT_WIDTHS = ['w-[45%]', 'w-[60%]', 'w-[75%]'] as const

export function BillingAnalyticsSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Sk className="h-5 w-40" />
          <Sk className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Sk className="h-7 w-20 rounded-full" />
          <Sk className="h-7 w-28 rounded-full" />
          <Sk className="h-7 w-28 rounded-full" />
        </div>
      </div>

      <div className="flex items-end gap-2 h-48 px-1">
        {BAR_HEIGHTS.map((heightClass, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <Sk className={`w-full rounded-t-md rounded-b-none ${heightClass}`} />
            <Sk className="h-2.5 w-6" />
          </div>
        ))}
      </div>

      <div className="flex gap-8 mt-4 pt-4 border-t border-border">
        <div className="flex flex-col gap-1.5">
          <Sk className="h-3 w-16" />
          <Sk className="h-5 w-24" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Sk className="h-3 w-12" />
          <Sk className="h-5 w-24" />
        </div>
      </div>
    </Card>
  )
}

export function InvoiceListSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Sk className="h-6 w-40" />
        <Sk className="h-8 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Sk className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Sk className={`h-3.5 ${VARIABLE_WIDTHS[i % 3]}`} />
              <Sk className="h-2.5 w-28" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function StampsProgressSkeleton() {
  return (
    <Card className="p-4">
      <Sk className="h-5 w-36 mb-4" />
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4">
          <Sk className="w-full h-full rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <Sk className="h-8 w-14 rounded-md" />
            <Sk className="h-2.5 w-16 rounded-md" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Sk className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
              <Sk className="h-2.5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function RecentClientsSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Sk className="h-6 w-40" />
        <Sk className="h-8 w-32 rounded-full" />
      </div>
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Sk className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Sk className={`h-3.5 ${RECENT_CLIENT_WIDTHS[i % 3]}`} />
              <Sk className="h-2.5 w-44" />
            </div>
            <Sk className="h-6 w-20 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function DeclarationCountdownSkeleton() {
  return (
    <Card className="p-5 overflow-hidden bg-[var(--color-foreground)]">
      <Sk dark className="h-4 w-40 mb-1" />
      <Sk dark className="h-3 w-52 mb-5" />

      <div className="grid grid-cols-4 gap-2 mb-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Sk dark className="h-10 w-full rounded-xl" />
            <Sk dark className="h-2.5 w-8" />
          </div>
        ))}
      </div>

      <Sk dark className="h-9 w-full" />
    </Card>
  )
}

export function KipoAppCardSkeleton() {
  return (
    <Card className="p-5 overflow-hidden bg-[var(--color-foreground)]">
      <Sk dark className="w-10 h-10 rounded-xl mb-3" />
      <Sk dark className="h-5 w-40 mb-1.5" />
      <Sk dark className="h-3.5 w-48 mb-5" />
      <Sk dark className="h-9 w-full" />
    </Card>
  )
}

export function RemindersSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <Sk className="h-5 w-28" />
        <Sk className="h-4 w-4 rounded-full" />
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
        <Sk className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Sk className="h-3.5 w-44" />
          <Sk className="h-2.5 w-28" />
        </div>
      </div>
      <Sk className="h-9 w-full mt-3" />
    </Card>
  )
}

export function CustomerCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <Sk className="w-16 h-16 rounded-full flex-shrink-0" />
        <Sk className="w-8 h-8 rounded-lg flex-shrink-0" />
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Sk className="h-5 w-36" />
          <Sk className="h-3 w-28" />
        </div>

        <Sk className="h-6 w-16 rounded-full" />

        <Sk className="h-10 w-full rounded-lg mt-2" />
      </div>
    </Card>
  )
}

export function CustomersListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <CustomerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function InvoiceRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <Sk className="w-8 h-8 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <Sk className="h-3.5 w-20" />
        <Sk className="h-2.5 w-36" />
      </div>
      <Sk className="h-2.5 w-20 hidden md:block flex-shrink-0" />
      <Sk className="h-3.5 w-24 flex-shrink-0" />
      <Sk className="h-6 w-20 rounded-full hidden sm:block flex-shrink-0" />
      <Sk className="w-7 h-7 rounded-lg flex-shrink-0" />
    </div>
  )
}

export function InvoicesListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border">
        <Sk className="w-8 h-3 flex-shrink-0" />
        <Sk className="h-2.5 w-12 flex-1" />
        <Sk className="h-2.5 w-12 hidden md:block" />
        <Sk className="h-2.5 w-10" />
        <Sk className="h-2.5 w-14 hidden sm:block" />
        <div className="w-7 flex-shrink-0" />
      </div>
      <div className="divide-y divide-border/50 px-2 py-1">
        {Array.from({ length: count }).map((_, i) => (
          <InvoiceRowSkeleton key={i} />
        ))}
      </div>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <StatsCardsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BillingAnalyticsSkeleton />
        </div>
        <StampsProgressSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InvoiceListSkeleton />
        <RecentClientsSkeleton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DeclarationCountdownSkeleton />
        <KipoAppCardSkeleton />
        <RemindersSkeleton />
      </div>
    </div>
  )
}
