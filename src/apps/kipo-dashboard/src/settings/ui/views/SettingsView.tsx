'use client'

import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage, Button, Card } from '@kipo/ui-react'
import {
  User,
  Building2,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  ExternalLink,
  Shield,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/src/auth/ui/store/authStore'
import { Header } from '@/src/shared/ui/components/dashboard/header'

export function SettingsView() {
  const { session, logout } = useAuthStore()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = session?.displayName ?? 'Usuario'
  const email = session?.email ?? ''
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    router.replace('/login')
  }

  return (
    <>
      <Header title="Ajustes" description="Gestiona tu cuenta y preferencias." />

      <div className="mt-4 md:mt-5 max-w-2xl space-y-4">

        {/* Perfil */}
        <Card className="p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Perfil</p>
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 ring-2 ring-primary/20">
              <AvatarImage src="/profile.jpeg" alt={displayName} className="object-cover w-full h-full" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground shrink-0">
              <User className="w-4 h-4 mr-1.5" />
              Editar
            </Button>
          </div>
        </Card>

        {/* Datos fiscales */}
        <Card className="divide-y divide-border overflow-hidden p-0">
          <div className="flex items-center gap-3 px-5 py-4">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Razón social</p>
              <p className="text-sm font-medium text-foreground">— sin configurar —</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">RFC</p>
              <p className="text-sm font-medium text-foreground">— sin configurar —</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Card>

        {/* Plan */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Plan Básico</p>
                <p className="text-xs text-muted-foreground">Gratis</p>
              </div>
            </div>
            <Button size="sm" className="shrink-0">
              Mejorar plan
            </Button>
          </div>
        </Card>

        {/* Soporte */}
        <Card className="divide-y divide-border overflow-hidden p-0">
          <a
            href="https://kipo.com.mx/ayuda"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-4 hover:bg-secondary transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium text-foreground">Centro de ayuda</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </a>
          <a
            href="mailto:soporte@kipo.com.mx"
            className="flex items-center gap-3 px-5 py-4 hover:bg-secondary transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium text-foreground">Contactar soporte</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </a>
        </Card>

        {/* Logout */}
        <Card className="p-5">
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 disabled:opacity-60"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </Button>
        </Card>

      </div>
    </>
  )
}
