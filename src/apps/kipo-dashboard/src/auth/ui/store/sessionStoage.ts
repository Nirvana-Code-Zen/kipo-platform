import { Session } from "../../core/domain/entities/Session";

const SESSION_KEY = 'KIPO_SESSION'

export function setAuthSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getAuthSession(){
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem(SESSION_KEY)

  if (!session) return null

  const auth = JSON.parse(session)
  auth.expiresAt = new Date(auth.expiresAt)
  return auth
}

export function patchAuthSession(patch: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...JSON.parse(raw), ...patch }))
}

export function removeAuthSession() {
  localStorage.removeItem(SESSION_KEY)
}
