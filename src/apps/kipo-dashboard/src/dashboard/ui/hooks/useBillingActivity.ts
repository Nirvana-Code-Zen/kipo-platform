"use client"

import { useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export type ChartActivityPoint = { label: string; total: number }

export function useBillingActivity(
  view: "monthly" | "current_week" | "week",
  weekStart?: string,
) {
  const [data, setData] = useState<ChartActivityPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false

    setIsLoading(true)
    const params = new URLSearchParams({ view })
    if (weekStart) params.set("week_start", weekStart)
    fetch(`${API_BASE_URL}/api/v1/dashboard/billing-activity?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json) return
        setData(json as ChartActivityPoint[])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [view, weekStart, accessToken])

  return { data, isLoading }
}
