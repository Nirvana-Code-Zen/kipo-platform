export const AUTH_PROVIDER = {
  email: 'email',
  phone: 'phone',
  google: 'google',
  apple: 'apple',
  facebook: 'facebook',
} as const

export type AuthProvider = keyof typeof AUTH_PROVIDER

export const SOCIAL_PROVIDERS: AuthProvider[] = ['google', 'apple', 'facebook']

export const isSocialProvider = (p: AuthProvider): boolean =>
  SOCIAL_PROVIDERS.includes(p)
