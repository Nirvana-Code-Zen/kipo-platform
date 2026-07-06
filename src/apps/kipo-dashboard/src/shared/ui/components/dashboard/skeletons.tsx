import { Card } from '@kipo/ui-react'

// Base primitive — use anywhere
function Sk({
  className = '',
  dark = false,
  style,
}: {
  className?: string
  dark?: boolean
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`${dark ? 'skeleton-dark' : 'skeleton'} ${className}`}
      style={style}
    />
  )
}

// ─── Stats cards ─────────────────────────────────────────────────────────────

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <Card
          key={i}
          className="p-4"
          style={i === 0 ? { background: 'var(--color-primary)' } : undefined}
        >
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

// ─── Billing analytics ───────────────────────────────────────────────────────

export function BillingAnalyticsSkeleton() {
  const bars = [80, 140, 110, 180, 65, 155, 90]

  return (
    <Card className="p-5">
      {/* header */}
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

      {/* bars */}
      <div className="flex items-end gap-2 h-48 px-1">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <Sk className="w-full rounded-t-md rounded-b-none" style={{ height: h }} />
            <Sk className="h-2.5 w-6" />
          </div>
        ))}
      </div>

      {/* footer stats */}
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

// ─── Invoice list ─────────────────────────────────────────────────────────────

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
              <Sk className="h-3.5" style={{ width: `${55 + (i % 3) * 15}%` }} />
              <Sk className="h-2.5 w-28" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Stamps progress (donut) ──────────────────────────────────────────────────

export function StampsProgressSkeleton() {
  return (
    <Card className="p-4">
      <Sk className="h-5 w-36 mb-4" />
      <div className="flex flex-col items-center">
        {/* donut circle */}
        <div className="relative w-40 h-40 mb-4">
          <Sk className="w-full h-full rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <Sk className="h-8 w-14 rounded-md" />
            <Sk className="h-2.5 w-16 rounded-md" />
          </div>
        </div>
        {/* legend */}
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

// ─── Recent clients ───────────────────────────────────────────────────────────

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
              <Sk className="h-3.5" style={{ width: `${45 + (i % 3) * 15}%` }} />
              <Sk className="h-2.5 w-44" />
            </div>
            <Sk className="h-6 w-20 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Declaration countdown (dark card) ───────────────────────────────────────

export function DeclarationCountdownSkeleton() {
  return (
    <Card
      className="p-5 overflow-hidden"
      style={{ background: 'var(--color-foreground)' }}
    >
      <Sk dark className="h-4 w-40 mb-1" />
      <Sk dark className="h-3 w-52 mb-5" />

      {/* countdown boxes */}
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

// ─── Kipo app card (dark card) ────────────────────────────────────────────────

export function KipoAppCardSkeleton() {
  return (
    <Card
      className="p-5 overflow-hidden"
      style={{ background: 'var(--color-foreground)' }}
    >
      <Sk dark className="w-10 h-10 rounded-xl mb-3" />
      <Sk dark className="h-5 w-40 mb-1.5" />
      <Sk dark className="h-3.5 w-48 mb-5" />
      <Sk dark className="h-9 w-full" />
    </Card>
  )
}

// ─── Reminders ────────────────────────────────────────────────────────────────

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

// ─── Customer card ────────────────────────────────────────────────────────────

export function CustomerCardSkeleton() {
  return (
    <Card className="p-6">
      {/* avatar + menu button */}
      <div className="flex items-start justify-between mb-4">
        <Sk className="w-16 h-16 rounded-full flex-shrink-0" />
        <Sk className="w-8 h-8 rounded-lg flex-shrink-0" />
      </div>

      {/* name + regime */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Sk className="h-5 w-36" />
          <Sk className="h-3 w-28" />
        </div>

        {/* badge */}
        <Sk className="h-6 w-16 rounded-full" />

        {/* action button */}
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

// ─── Full dashboard skeleton ──────────────────────────────────────────────────
// Drop this in the dashboard view while the initial data loads

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
