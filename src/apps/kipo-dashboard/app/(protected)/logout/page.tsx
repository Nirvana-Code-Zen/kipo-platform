'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/src/auth/ui/store/authStore'

export default function LogoutPage() {
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  useEffect(() => {
    logout().then(() => router.replace('/login'))
  }, [logout, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">Cerrando sesión...</p>
    </div>
  )
}
