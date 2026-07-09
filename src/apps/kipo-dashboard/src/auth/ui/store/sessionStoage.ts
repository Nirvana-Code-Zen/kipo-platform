import { Session } from "../../core/domain/entities/Session";

const SESSION_KEY = 'KIPO_SESSION'

export function setAuthSession(session: Session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getAuthSession(){
  if (typeof window === 'undefined') return {}
  const session = sessionStorage.getItem(SESSION_KEY)
  const auth = JSON.parse(session)

  auth.expiresAt = new Date(auth.expiresAt)
  return auth
}

export function removeAuthSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
