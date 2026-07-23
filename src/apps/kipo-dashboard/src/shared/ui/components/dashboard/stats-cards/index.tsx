"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import { Card } from "@kipo/ui-react"

import { buildStats } from "./constants"

import type { DashboardStats } from "@/src/dashboard/ui/hooks/useDashboardSummary"

export function StatsCards({ stats }: { stats: DashboardStats | null }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const router = useRouter()

  const cards = buildStats(stats)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((stat, index) => (
        <Card
          key={stat.title}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => router.push(`/billing?status=${stat.filter}`)}
          className={`p-4 transition-all duration-500 ease-out animate-slide-in-up cursor-pointer ${stat.delay} ${
            stat.isPrimary ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
          } ${hoveredCard === index ? "scale-105 shadow-2xl" : "shadow-lg"}`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
                stat.isPrimary ? "bg-primary-foreground/20" : "bg-primary"
              } ${hoveredCard === index ? "rotate-45" : ""}`}
            >
              <ArrowUpRight className={`w-3 h-3 ${stat.isPrimary ? "text-primary-foreground" : "text-primary-foreground"}`} />
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
