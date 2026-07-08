"use client"

import { useState } from "react"

import { ArrowUpRight, TrendingUp } from "lucide-react"
import { Card } from "@kipo/ui-react"

import type { DashboardStats, MonthStats } from "@/src/dashboard/ui/hooks/useDashboardSummary"

function monthDelta(stats: DashboardStats | null, key: keyof MonthStats): string {
  if (!stats) return "vs mes anterior"
  const d = stats.this_month[key] - stats.prev_month[key]
  return `${d >= 0 ? "+" : ""}${d} vs mes anterior`
}

function buildStats(stats: DashboardStats | null) {
  return [
    {
      title: "Total Facturas",
      value: stats ? String(stats.total) : "—",
      increase: monthDelta(stats, "total"),
      bgColor: "bg-primary",
      textColor: "text-primary-foreground",
      delay: "0ms",
    },
    {
      title: "Canceladas",
      value: stats ? String(stats.cancelled) : "—",
      increase: monthDelta(stats, "cancelled"),
      bgColor: "bg-card",
      textColor: "text-foreground",
      delay: "100ms",
    },
    {
      title: "Timbradas",
      value: stats ? String(stats.stamped) : "—",
      increase: monthDelta(stats, "stamped"),
      bgColor: "bg-card",
      textColor: "text-foreground",
      delay: "200ms",
    },
    {
      title: "Borradores",
      value: stats ? String(stats.draft) : "—",
      subtitle: "En revisión",
      bgColor: "bg-card",
      textColor: "text-foreground",
      delay: "300ms",
    },
  ]
}

export function StatsCards({ stats }: { stats: DashboardStats | null }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const cards = buildStats(stats)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((stat, index) => (
        <Card
          key={stat.title}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            animationDelay: stat.delay,
            ...(stat.bgColor === "bg-primary" ? { background: "var(--color-primary)", color: "var(--color-primary-foreground)" } : {}),
          }}
          className={`${stat.bgColor} ${stat.textColor} p-4 transition-all duration-500 ease-out animate-slide-in-up cursor-pointer ${
            hoveredCard === index ? "scale-105 shadow-2xl" : "shadow-lg"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
            <div
              className={`w-6 h-6 rounded-full ${
                stat.bgColor === "bg-primary" ? "bg-primary-foreground/20" : "bg-primary"
              } flex items-center justify-center transition-transform duration-300 ${
                hoveredCard === index ? "rotate-45" : ""
              }`}
            >
              <ArrowUpRight
                className={`w-3 h-3 ${stat.bgColor === "bg-primary" ? "text-primary-foreground" : "text-primary-foreground"}`}
              />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{stat.value}</p>
          <div className="flex items-center gap-1.5 text-xs opacity-80">
            {stat.increase && (
              <>
                <TrendingUp className="w-3 h-3" />
                <span>{stat.increase}</span>
              </>
            )}
            {stat.subtitle && <span>{stat.subtitle}</span>}
          </div>
        </Card>
      ))}
    </div>
  )
}
