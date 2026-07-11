"use client"

import { useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

export type MonthStats = { total: number; stamped: number; cancelled: number; draft: number }
export type DashboardStats = MonthStats & { this_month: MonthStats; prev_month: MonthStats }
export type DashboardStamps = { available: number; stamped: number }
export type RecentInvoice = {
  id: string
  folio: string
  receiver_name: string
  total: number
  status: string
  created_at: string
}
export type RecentClient = {
  id: string
  tax_id: string
  legal_name: string
  email: string
  status: string
  avatar_url: string | null
}

export type DashboardSummary = {
  stats: DashboardStats
  stamps: DashboardStamps
  recent_invoices: RecentInvoice[]
  recent_clients: RecentClient[]
}

export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setIsLoading(true)
    fetch(`${API_BASE_URL}/api/v1/dashboard/summary`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return
        setSummary(data as DashboardSummary)
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
  }, [accessToken])

  return { summary, isLoading }
}
