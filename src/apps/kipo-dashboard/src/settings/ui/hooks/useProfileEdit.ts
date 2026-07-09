"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

export async function uploadAvatar(file: File, userId: string, accessToken: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg"
  const filename = `${Date.now()}.${ext}`
  const objectPath = `${userId}/${filename}`

  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/profiles/${objectPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": file.type,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error("No se pudo subir la imagen")
  }

  return `${SUPABASE_URL}/storage/v1/object/public/profiles/${objectPath}`
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

  async function uploadAvatarWithState(file: File, userId: string, accessToken: string): Promise<string> {
    return uploadAvatar(file, userId, accessToken)
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
