"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { getTenantSlugFromHost } from "@/src/shared/host/tenantSlug"
import { APP_DOMAIN } from "@/src/shared/infrastructure/config"

import { installAuthFetchInterceptor } from "../../lib/httpInterceptor"
import { SSO_PARAM } from "../../lib/tenantRedirect"
import { attemptBootstrapOnce, scheduleRefreshForCurrentSession, useAuthStore } from "../../store/authStore"

export function AuthSessionManager() {
  const router = useRouter()

  useEffect(() => {
    installAuthFetchInterceptor()

    const params = new URLSearchParams(window.location.search)
    const code = params.get(SSO_PARAM)

    if (code) {
      params.delete(SSO_PARAM)
      const cleanQuery = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}`)

      void useAuthStore.getState().adoptExchangeCode(code).then((adopted) => {
        if (!adopted) router.replace('/login')
      })
      return
    }

    scheduleRefreshForCurrentSession()
    void attemptBootstrapOnce()

    const currentSlug = getTenantSlugFromHost(window.location.hostname, APP_DOMAIN)
    const { persistedSession, forceUnauthenticated } = useAuthStore.getState()
    if (currentSlug && persistedSession?.tenantSlug && persistedSession.tenantSlug !== currentSlug) {
      forceUnauthenticated()
      router.replace('/login')
    }
  }, [router])

  return null
}
