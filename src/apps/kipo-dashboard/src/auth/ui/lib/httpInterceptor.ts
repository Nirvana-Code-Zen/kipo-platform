import { API_BASE_URL } from "@/src/shared/infrastructure/config"

import { useAuthStore } from "../store/authStore"

let installed = false
let refreshInFlight: Promise<boolean> | null = null

function isAuthEndpoint(url: string): boolean {
  return url.startsWith(`${API_BASE_URL}/api/v1/auth/`)
}

function getOrRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = useAuthStore.getState().refresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

function withAuthHeader(init: RequestInit | undefined, token: string): RequestInit {
  const headers = new Headers(init?.headers)
  headers.set("Authorization", `Bearer ${token}`)
  return { ...init, headers }
}

export function installAuthFetchInterceptor() {
  if (installed || typeof window === "undefined") return
  installed = true

  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString()
    const isApiCall = url.startsWith(API_BASE_URL)

    const res = await originalFetch(input, init)

    if (!isApiCall || isAuthEndpoint(url) || res.status !== 401) {
      return res
    }

    const refreshed = await getOrRefresh()
    if (!refreshed) {
      return res
    }

    const token = useAuthStore.getState().accessToken
    if (!token) return res

    const retryRes = await originalFetch(input, withAuthHeader(init, token))
    if (retryRes.status === 401) {
      useAuthStore.getState().forceUnauthenticated()
    }
    return retryRes
  }
}
