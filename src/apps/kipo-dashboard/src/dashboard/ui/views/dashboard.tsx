'use client'

import { useEffect, useState } from "react"

import { BillingAnalytics } from "@/src/shared/ui/components/dashboard/billing-analytics"
import { DeclarationCountdown } from "@/src/shared/ui/components/dashboard/declaration-countdown"
import { Header } from "@/src/shared/ui/components/dashboard/header"
import { InvoiceList } from "@/src/shared/ui/components/dashboard/invoice-list"
import { KipoAppCard } from "@/src/shared/ui/components/dashboard/kipo-app-card"
import { RecentClients } from "@/src/shared/ui/components/dashboard/recent-clients"
import { Reminders } from "@/src/shared/ui/components/dashboard/reminders"
import {
  BillingAnalyticsSkeleton,
  DeclarationCountdownSkeleton,
  InvoiceListSkeleton,
  KipoAppCardSkeleton,
  RemindersSkeleton,
  StampsProgressSkeleton,
  StatsCardsSkeleton,
} from "@/src/shared/ui/components/dashboard/skeletons"
import { StampsProgress } from "@/src/shared/ui/components/dashboard/stamps-progress"
import { StatsCards } from "@/src/shared/ui/components/dashboard/stats-cards"

export function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Header
        title="Dashboard"
        description="Resumen de tu actividad fiscal del mes de julio."
      />

      <div className="mt-4 md:mt-5 space-y-3 md:space-y-4">
        {loading ? <StatsCardsSkeleton /> : <StatsCards />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {loading ? <BillingAnalyticsSkeleton /> : <BillingAnalytics />}
            <RecentClients />
          </div>

          <div className="space-y-3 md:space-y-4">
            {loading ? <RemindersSkeleton /> : <Reminders />}
            {loading ? <StampsProgressSkeleton /> : <StampsProgress />}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {loading ? <InvoiceListSkeleton /> : <InvoiceList />}
          {loading ? <KipoAppCardSkeleton /> : <KipoAppCard />}
          {loading ? <DeclarationCountdownSkeleton /> : <DeclarationCountdown />}
        </div>
      </div>
    </>
  )
}
