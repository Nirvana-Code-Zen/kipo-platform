'use client'

import { useRef, useState } from 'react'

import Image from "next/image"
import { Button } from '@kipo/ui-react'
import { Camera } from 'lucide-react'

import { AuthInput } from '@/src/auth/ui/components/AuthInput'
import { useAuthStore } from '@/src/auth/ui/store/authStore'
import { uploadAvatar } from '@/src/settings/ui/hooks/useProfileEdit'

import { TIMEZONES, CURRENCIES } from '../data/constants'
import { useOnboardingDisplayName } from '../hooks/useOnboardingDisplayName'
import { useOnboardingForm } from '../hooks/useOnboardingForm'
import { useOnboardingProgress } from '../hooks/useOnboardingProgress'
import { FiscalDataStep } from '../components/FiscalDataStep'
import { CsdStep } from '../components/CsdStep'

export const OnboardingView = () => {
  const accessToken = useAuthStore((s) => s.accessToken)

  const { step, onTenantCreated, advanceTo, complete } = useOnboardingProgress()

  const onboardingComplete = () => {
    complete()
  }

  const nameHook = useOnboardingDisplayName(() => advanceTo(3))

  const {
    name, setName,
    timezone, setTimezone,
    currency, setCurrency,
    isLoading: tenantLoading,
    error: tenantError,
    isValid: tenantValid,
    submit: submitTenant,
  } = useOnboardingForm(onTenantCreated)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const initials = nameHook.displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setAvatarUploadError(null)
    let avatarUrl: string | undefined
    if (avatarFile && accessToken) {
      setIsUploadingAvatar(true)
      try {
        avatarUrl = await uploadAvatar(avatarFile, accessToken)
      } catch (err) {
        setAvatarUploadError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
        setIsUploadingAvatar(false)
        return
      }
      setIsUploadingAvatar(false)
    }
    void nameHook.submit(avatarUrl)
  }

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    void submitTenant()
  }

  if (step === 2) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-app px-4 py-6">
        <div className="w-full max-w-[480px]">
          <div className="mb-8">
            <p className="text-[13px] text-primary font-sans font-semibold mb-2">Paso 2 de 3</p>
            <h1 className="font-display font-bold text-[32px] text-foreground tracking-[-0.03em] leading-[1.15] mb-2.5">
              ¿Cómo te llaman?
            </h1>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Tu nombre aparecerá en tu perfil y en los documentos que generes.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="relative group focus:outline-none"
              aria-label="Subir foto de perfil"
            >
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-2 border-primary"
                style={{ background: 'var(--surface-brand-soft)' }}
              >
                {avatarPreview ? (
                  <Image width={80} height={12} src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[28px] font-bold text-primary font-display tracking-[-0.02em] leading-none">
                    {initials || '?'}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center shadow-md bg-primary group-hover:scale-110 transition-transform">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {(nameHook.error || avatarUploadError) && (
            <div
              role="alert"
              className="bg-danger-soft border-destructive rounded-xl px-3.5 py-2.5 text-[13px] text-destructive font-sans mb-5"
              style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
            >
              {avatarUploadError ?? nameHook.error}
            </div>
          )}

          <form onSubmit={handleStep1} className="flex flex-col gap-4">
            <AuthInput
              label="Tu nombre completo"
              type="text"
              required
              value={nameHook.displayName}
              onChange={(e) => nameHook.setDisplayName(e.target.value)}
              placeholder="Ej. Ana García"
              autoFocus
            />
            <div className="mt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                full
                disabled={nameHook.isLoading || isUploadingAvatar || !nameHook.isValid}
              >
                {isUploadingAvatar ? 'Subiendo foto…' : nameHook.isLoading ? 'Guardando…' : 'Continuar →'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return <FiscalDataStep onSaved={() => advanceTo(4)} onSkip={onboardingComplete} />
  }

  if (step === 4) {
    return <CsdStep onFinish={onboardingComplete} />
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-app px-4 py-6">
      <div className="w-full max-w-[480px]">
        <div className="mb-8">
          <p className="text-[13px] text-primary font-sans font-semibold mb-2">Paso 1 de 3</p>
          <h1 className="font-display font-bold text-[32px] text-foreground tracking-[-0.03em] leading-[1.15] mb-2.5">
            Configura tu empresa
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Esta información crea tu espacio de trabajo en Kipo.
          </p>
        </div>

        {tenantError && (
          <div
            role="alert"
            className="bg-danger-soft border-destructive rounded-xl px-3.5 py-2.5 text-[13px] text-destructive font-sans mb-5"
            style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
          >
            {tenantError.message}
          </div>
        )}

        <form onSubmit={handleStep2} className="flex flex-col gap-4">
          <AuthInput
            label="Nombre de la empresa"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Refaccionaria López S.A."
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-foreground font-sans">
                Zona horaria
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-muted border-transparent rounded-[14px] px-4 py-3.5 text-sm font-sans text-foreground outline-none cursor-pointer w-full"
                style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz.split('/')[1].replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-foreground font-sans">
                Moneda
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-muted border-transparent rounded-[14px] px-4 py-3.5 text-sm font-sans text-foreground outline-none cursor-pointer w-full"
                style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-2">
            <Button type="submit" variant="primary" size="md" full disabled={tenantLoading || !tenantValid}>
              {tenantLoading ? 'Creando empresa…' : 'Crear empresa y continuar →'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
