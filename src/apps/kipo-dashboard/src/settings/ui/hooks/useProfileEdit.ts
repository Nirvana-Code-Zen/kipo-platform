"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function uploadAvatar(file: File, accessToken: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_BASE_URL}/api/v1/profile/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error ?? "No se pudo subir la imagen")
  }

  const { url } = await res.json() as { url: string }
  return url
}

export async function saveProfile(displayName: string, avatarUrl: string | undefined, accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ display_name: displayName, avatar_url: avatarUrl }),
  })

  if (!response.ok) {
    throw new Error("No se pudo guardar el perfil")
  }
}

export async function saveEmail(email: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile/email`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error("No se pudo actualizar el correo")
  }
}

export function useProfileEdit() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadAvatarWithState(file: File, accessToken: string): Promise<string> {
    return uploadAvatar(file, accessToken)
  }

  async function saveProfileWithState(displayName: string, avatarUrl: string | undefined, accessToken: string): Promise<void> {
    return saveProfile(displayName, avatarUrl, accessToken)
  }

  async function saveEmailWithState(email: string, accessToken: string): Promise<void> {
    return saveEmail(email, accessToken)
  }

  return {
    isSaving,
    setIsSaving,
    error,
    setError,
    uploadAvatar: uploadAvatarWithState,
    saveProfile: saveProfileWithState,
    saveEmail: saveEmailWithState,
  }
}
