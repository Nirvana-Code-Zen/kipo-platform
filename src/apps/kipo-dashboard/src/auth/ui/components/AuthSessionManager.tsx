"use client"

import { useEffect } from "react"

import { installAuthFetchInterceptor } from "../lib/httpInterceptor"
import { scheduleRefreshForCurrentSession } from "../store/authStore"

export function AuthSessionManager() {
  useEffect(() => {
    installAuthFetchInterceptor()
    scheduleRefreshForCurrentSession()
  }, [])

  return null
}
