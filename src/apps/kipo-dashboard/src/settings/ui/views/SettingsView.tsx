'use client'

import { useState, useEffect } from 'react'

import { Avatar, AvatarFallback, AvatarImage, Button, Card } from '@kipo/ui-react'
import {
  User,
  CreditCard,
  HelpCircle,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useAuthStore } from '@/src/auth/ui/store/authStore'
import { Header } from '@/src/shared/ui/components/dashboard/header'
import { useStampedInvoiceCount } from '@/src/billing/ui/hooks/useStampedInvoiceCount'
import { BuyStampsSheet } from '@/src/stamp-packs/ui/components/BuyStampsSheet'

import { useFiscalSettings } from '../hooks/useFiscalSettings'
import { FiscalSettingsSection } from '../components/FiscalSettingsSection'
import { FiscalSettingsSheet } from '../components/FiscalSettingsSheet'
import { ProfileEditSheet } from '../components/ProfileEditSheet'
import { CSDSettingsSection } from '../components/CSDSettingsSection'
import { CSDSettingsSheet } from '../components/CSDSettingsSheet'
import { ManifiestoSettingsSection } from '../components/ManifiestoSettingsSection'

export function SettingsView() {
  const persistedSession = useAuthStore((s) => s.persistedSession)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [fiscalSheetOpen, setFiscalSheetOpen] = useState(false)
  const [profileSheetOpen, setProfileSheetOpen] = useState(false)
  const [csdSheetOpen, setCsdSheetOpen] = useState(false)
  const [buySheetOpen, setBuySheetOpen] = useState(false)

  const { data: fiscalData, isLoading: fiscalLoading, setData: setFiscalData } = useFiscalSettings()
  const { availableStamps, addAvailableStamps } = useStampedInvoiceCount()

  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get('openFiscal') === 'true') {
      setFiscalSheetOpen(true)
      router.replace('/settings')
    }
    if (searchParams.get('openCsd') === 'true') {
      setCsdSheetOpen(true)
      router.replace('/settings')
    }
  }, [searchParams])

  const displayName = persistedSession?.displayName ?? 'Usuario'
  const email = persistedSession?.email ?? ''
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
              {persistedSession?.avatarUrl && (
                <AvatarImage src={persistedSession.avatarUrl} alt={displayName} className="object-cover w-full h-full" />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground shrink-0"
              onClick={() => setProfileSheetOpen(true)}
            >
              <User className="w-4 h-4 mr-1.5" />
              Editar
            </Button>
          </div>
        </Card>

        {/* Datos fiscales */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Datos fiscales
          </p>
          <FiscalSettingsSection
            data={fiscalData}
            isLoading={fiscalLoading}
            onEdit={() => setFiscalSheetOpen(true)}
          />
        </div>

        {/* CSD */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Certificado de Sello Digital
          </p>
          <CSDSettingsSection
            data={fiscalData}
            isLoading={fiscalLoading}
            onEdit={() => setCsdSheetOpen(true)}
          />
        </div>

        {/* Carta Manifiesto */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Carta Manifiesto
          </p>
          <ManifiestoSettingsSection
            data={fiscalData}
            onConfirmed={(updated) => setFiscalData(updated)}
          />
        </div>

        {/* Plan */}
        <Card className="p-5 space-y-4">
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
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Timbres disponibles</p>
              <p className="text-xs text-muted-foreground">
                {availableStamps !== null ? `${availableStamps} timbres` : 'Cargando...'}
              </p>
            </div>
            <Button size="sm" variant="secondary" className="shrink-0" onClick={() => setBuySheetOpen(true)}>
              Comprar timbres
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

      <FiscalSettingsSheet
        isOpen={fiscalSheetOpen}
        onClose={() => setFiscalSheetOpen(false)}
        initial={fiscalData}
        onSaved={(updated) => setFiscalData(updated)}
      />

      <ProfileEditSheet
        isOpen={profileSheetOpen}
        onClose={() => setProfileSheetOpen(false)}
      />

      <CSDSettingsSheet
        isOpen={csdSheetOpen}
        onClose={() => setCsdSheetOpen(false)}
        onSaved={(updated) => setFiscalData(updated)}
      />

      <BuyStampsSheet
        isOpen={buySheetOpen}
        onClose={() => setBuySheetOpen(false)}
        onPurchased={addAvailableStamps}
      />
    </>
  )
}
