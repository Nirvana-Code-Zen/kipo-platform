"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

import Image from 'next/image'
import { Button } from "@kipo/ui-react"
import { X, Camera } from "lucide-react"

import { useAuthStore } from "@/src/auth/ui/store/authStore"

import { useProfileEdit } from "../hooks/useProfileEdit"

interface ProfileEditSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileEditSheet({ isOpen, onClose }: ProfileEditSheetProps) {
  const session = useAuthStore((s) => s.persistedSession)
  const accessToken = useAuthStore((s) => s.accessToken)
  const updateProfile = useAuthStore((s) => s.updateProfile)

  const { isSaving, setIsSaving, error, setError, uploadAvatar, saveProfile, saveEmail } = useProfileEdit()

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setDisplayName(session?.displayName ?? "")
      setEmail(session?.email ?? "")
      setAvatarPreview(null)
      setAvatarFile(null)
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const currentAvatarUrl = avatarPreview ?? session?.avatarUrl ?? null
  const originalEmail = session?.email ?? ""
  const emailChanged = email.trim() !== originalEmail

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    e.target.value = ""
  }

  async function handleSave() {
    if (!accessToken) {
      setError("No hay sesión activa")
      return
    }

    const finalName = displayName.trim() || session?.displayName || ""
    const finalEmail = email.trim() || session?.email || ""

    setIsSaving(true)
    setError(null)

    try {
      let finalAvatarUrl: string | undefined = session?.avatarUrl

      if (avatarFile && session?.userId) {
        finalAvatarUrl = await uploadAvatar(avatarFile, accessToken)
      }

      await saveProfile(finalName, finalAvatarUrl, accessToken)
      updateProfile?.(finalName, finalAvatarUrl)

      if (finalEmail !== (session?.email ?? "")) {
        await saveEmail(finalEmail, accessToken)
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios")
    } finally {
      setIsSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[92dvh]">
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
          <h2 className="font-semibold text-base">Editar perfil</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div
            className="mx-5 mt-4 px-3.5 py-2.5 rounded-md text-[13px] flex-shrink-0 border"
            style={{
              background: "var(--kipo-danger-bg)",
              borderColor: "var(--kipo-danger)",
              color: "var(--kipo-danger)",
              fontFamily: "var(--font-body)",
            }}
          >
            {error}
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-5 py-6">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group focus:outline-none"
                aria-label="Cambiar foto de perfil"
              >
                <div
                  className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-primary/20"
                  style={{ background: "var(--surface-brand-soft)" }}
                >
                  {currentAvatarUrl ? (
                    <Image
                      src={currentAvatarUrl}
                      alt={displayName}
                      width={50}
                      height={50}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-xl font-bold"
                      style={{ color: "var(--brand)" }}
                    >
                      {initials || "?"}
                    </span>
                  )}
                </div>
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: "var(--brand)" }}
                >
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--text-strong)",
                }}
              >
                Nombre
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))}
                autoComplete="name"
                style={{
                  width: "100%",
                  background: "var(--surface-card)",
                  border: "1.5px solid var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  fontSize: 15,
                  fontFamily: "var(--font-body)",
                  color: "var(--text-strong)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--text-strong)",
                }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{
                  width: "100%",
                  background: "var(--surface-card)",
                  border: "1.5px solid var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  fontSize: 15,
                  fontFamily: "var(--font-body)",
                  color: "var(--text-strong)",
                  outline: "none",
                }}
              />
              {emailChanged && (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Al cambiar, deberás iniciar sesión nuevamente.
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <Button type="button" variant="secondary" size="md" full onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                full
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
