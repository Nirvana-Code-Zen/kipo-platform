"use client"

import { useState, useMemo } from "react"

import { Card } from '@kipo/ui-react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

import type { TooltipProps } from "recharts"

type ViewMode = "monthly" | "current-week" | "custom-week"

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
const DAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const DAYS_LONG = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const monthlyData = [
  { day: "Ene", value: 148200, label: "Enero" },
  { day: "Feb", value: 221500, label: "Febrero" },
  { day: "Mar", value: 195800, label: "Marzo" },
  { day: "Abr", value: 267300, label: "Abril" },
  { day: "May", value: 312700, label: "Mayo" },
  { day: "Jun", value: 284100, label: "Junio" },
  { day: "Jul", value: 225000, label: "Julio" },
  { day: "Ago", value: 0, label: "Agosto" },
  { day: "Sep", value: 0, label: "Septiembre" },
  { day: "Oct", value: 0, label: "Octubre" },
  { day: "Nov", value: 0, label: "Noviembre" },
  { day: "Dic", value: 0, label: "Diciembre" },
]

function getWeekStart(offsetWeeks: number): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - dayOfWeek + offsetWeeks * 7)
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

function generateWeekData(weekOffset: number) {
  // Seed-based pseudo-random for reproducible demo data per week
  const seed = 2026070 + weekOffset * 7
  const seeded = (n: number) => {
    const x = Math.sin(seed + n) * 10000
    return Math.abs(x - Math.floor(x))
  }
  return DAYS_SHORT.map((day, i) => ({
    day,
    value: i === 0 || i === 6 ? Math.round(seeded(i) * 15000 + 5000) : Math.round(seeded(i) * 45000 + 20000),
    label: DAYS_LONG[i],
  }))
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
  const [isLoading, setIsLoading] = useState(false)

  function triggerLoad(fn: () => void) {
    setIsLoading(true)
    setTimeout(() => { fn(); setIsLoading(false) }, 600)
  }

  const chartData = useMemo(() => {
    if (viewMode === "monthly") return monthlyData
    if (viewMode === "current-week") return generateWeekData(0)
    return generateWeekData(weekOffset)
  }, [viewMode, weekOffset])

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
              onClick={() => triggerLoad(() => {
                setViewMode(key)
                if (key !== "custom-week") setWeekOffset(0)
              })}
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
            onClick={() => triggerLoad(() => setWeekOffset((o) => o - 1))}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-foreground">
            Sem. del {formatWeekRange(weekStart)}
          </span>
          <button
            onClick={() => triggerLoad(() => setWeekOffset((o) => Math.min(o + 1, 0)))}
            disabled={weekOffset === 0}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chart / Skeleton */}
      <div className="h-64 mb-4 relative">
        {isLoading ? (
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
        {isLoading ? (
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
