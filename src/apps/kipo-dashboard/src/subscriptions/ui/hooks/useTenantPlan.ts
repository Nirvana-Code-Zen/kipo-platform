"use client"

import { useEffect, useState } from "react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"
import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import type { UITenantPlan } from "../components/types"

export function useTenantPlan() {
  const [plan, setPlan] = useState<UITenantPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    fetch(`${API_BASE_URL}/api/v1/tenants/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return
        setPlan({
          planType: data.plan_type,
          status: data.status,
          tier: data.tier,
          features: data.features,
          historyMonths: data.history_months,
        })
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [accessToken])

  return { plan, isLoading }
}
