"use client"

import { useState, useMemo } from "react"

import { Card } from '@kipo/ui-react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

import { useBillingActivity } from "@/src/dashboard/ui/hooks/useBillingActivity"

import {
  ViewMode,
  barColors,
  viewButtons,
  formatMXN,
  formatAxisMXN,
  getWeekStart,
  formatWeekRange,
  MONTHLY_BAR_HEIGHTS,
  WEEKLY_BAR_HEIGHTS,
} from "./constants"

import type { CustomTooltipProps } from "./types"

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
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up delay-400 bg-gradient-to-br from-background to-muted/20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-foreground">Actividad de Facturación</h2>

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

      <div className="h-64 mb-4 relative">
        {chartLoading ? (
          <div className="h-full flex items-end gap-2 pb-6">
            {(viewMode === "monthly" ? MONTHLY_BAR_HEIGHTS : WEEKLY_BAR_HEIGHTS).map((heightClass, i) => (
              <div key={i} className={`flex-1 rounded-lg bg-muted animate-pulse ${heightClass}`} />
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
                    className={
                      hoveredBar === index && chartData[index].value > 0
                        ? 'brightness-125 drop-shadow-[0_4px_8px_rgba(45,106,159,0.4)]'
                        : undefined
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

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
