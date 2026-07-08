"use client"

import { useState, useMemo } from "react"

import { Card } from '@kipo/ui-react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

import { useBillingActivity } from "@/src/dashboard/ui/hooks/useBillingActivity"

import type { TooltipProps } from "recharts"

type ViewMode = "monthly" | "current-week" | "custom-week"

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function getWeekStart(offsetWeeks: number): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - dayOfWeek + offsetWeeks * 7)
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart)
  end.setDate(weekStart.getDate() + 6)
  const fmt = (d: Date) =>
    `${d.getDate()} ${MONTHS[d.getMonth()]}`
  return `${fmt(weekStart)} — ${fmt(end)}`
}

const formatMXN = (value: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value)

const formatAxisMXN = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
  return value === 0 ? "" : `$${value}`
}

type CustomTooltipProps = TooltipProps<number | string, string>

const barColors = ["#2d6a9f", "#1c4f78", "#0a3352", "#032641", "#1c4f78", "#1c4f78", "#0a3352"]

const viewButtons: { key: ViewMode; label: string }[] = [
  { key: "monthly", label: "Mensual" },
  { key: "current-week", label: "Esta semana" },
  { key: "custom-week", label: "Por semana" },
]

export function BillingAnalytics() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("current-week")
  const [weekOffset, setWeekOffset] = useState(0)

  const backendView = viewMode === "monthly" ? "monthly" : viewMode === "current-week" ? "current_week" : "week"
  const weekStartParam = viewMode === "custom-week" ? getWeekStart(weekOffset).toISOString().slice(0, 10) : undefined
  const { data: activityData, isLoading: chartLoading } = useBillingActivity(backendView, weekStartParam)

  const chartData = useMemo(() => {
    return activityData.map((p) => ({ day: p.label, value: p.total, label: p.label }))
  }, [activityData])

  const nonZeroData = chartData.filter((d) => d.value > 0)
  const maxValue = nonZeroData.length ? Math.max(...nonZeroData.map((d) => d.value)) : 0
  const average = nonZeroData.length ? Math.round(nonZeroData.reduce((acc, d) => acc + d.value, 0) / nonZeroData.length) : 0

  const weekStart = useMemo(() => getWeekStart(viewMode === "current-week" ? 0 : weekOffset), [viewMode, weekOffset])

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length && Number(payload[0].value) > 0) {
      return (
        <div className="bg-foreground text-background px-3 py-2 rounded-lg text-xs font-semibold shadow-lg">
          <p className="font-bold">{formatMXN(Number(payload[0].value))}</p>
          <p className="text-[10px] opacity-80">{payload[0].payload.label}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up bg-gradient-to-br from-background to-muted/20"
      style={{ animationDelay: "400ms" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-foreground">Actividad de Facturación</h2>

        {/* Filter tabs */}
        <div className="flex items-center bg-muted/40 rounded-lg p-1 gap-0.5">
          {viewButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setViewMode(key)
                if (key !== "custom-week") setWeekOffset(0)
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                viewMode === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Week navigator (only in custom-week mode) */}
      {viewMode === "custom-week" && (
        <div className="flex items-center justify-between mb-4 bg-muted/30 rounded-lg px-3 py-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-foreground">
            Sem. del {formatWeekRange(weekStart)}
          </span>
          <button
            onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
            disabled={weekOffset === 0}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chart / Skeleton */}
      <div className="h-64 mb-4 relative">
        {chartLoading ? (
          <div className="h-full flex items-end gap-2 pb-6">
            {(viewMode === "monthly"
              ? [90, 140, 110, 160, 180, 130, 100, 40, 40, 40, 40, 40]
              : [80, 160, 130, 210, 70, 180, 95]
            ).map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-lg bg-muted animate-pulse"
                style={{ height: h }}
              />
            ))}
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted/20" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: viewMode === "monthly" ? 11 : 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-muted-foreground"
              tickFormatter={formatAxisMXN}
              width={44}
            />
            <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="value"
              fill={barColors[0]}
              radius={[8, 8, 8, 8]}
              maxBarSize={viewMode === "monthly" ? 28 : 60}
              onMouseEnter={(_data: unknown, index: number) => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {chartData.map((_entry: unknown, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                  opacity={chartData[index].value === 0 ? 0.15 : 1}
                  style={{
                    filter: hoveredBar === index && chartData[index].value > 0
                      ? "brightness(1.2) drop-shadow(0 4px 8px rgba(45, 106, 159, 0.4))"
                      : "none",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-muted/50 flex items-center justify-between">
        {chartLoading ? (
          <>
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
          </>
        ) : (
          <>
            <div className="text-sm">
              <span className="text-muted-foreground">Promedio: </span>
              <span className="font-semibold text-foreground">{formatMXN(average)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Pico: </span>
              <span className="font-semibold text-primary">{formatMXN(maxValue)}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
