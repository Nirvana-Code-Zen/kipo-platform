"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { getTenantSlugFromHost } from "@/src/shared/host/tenantSlug"
import { APP_DOMAIN } from "@/src/shared/infrastructure/config"

import { installAuthFetchInterceptor } from "../lib/httpInterceptor"
import { scheduleRefreshForCurrentSession, useAuthStore } from "../store/authStore"

export function AuthSessionManager() {
  const router = useRouter()

  useEffect(() => {
    installAuthFetchInterceptor()
    scheduleRefreshForCurrentSession()

    const currentSlug = getTenantSlugFromHost(window.location.hostname, APP_DOMAIN)
    const { persistedSession, forceUnauthenticated } = useAuthStore.getState()
    if (currentSlug && persistedSession?.tenantSlug && persistedSession.tenantSlug !== currentSlug) {
      forceUnauthenticated()
      router.replace('/login')
    }
  }, [router])

  return null
}
