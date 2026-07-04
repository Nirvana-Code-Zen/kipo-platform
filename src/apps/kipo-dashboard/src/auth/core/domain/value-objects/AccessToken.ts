// In-memory only — never persisted to localStorage
// The backend issues this as a short-lived JWT
export type AccessToken = string & { readonly _brand: 'AccessToken' }

export type OtpToken = string & { readonly _brand: 'OtpToken' }

export const toAccessToken = (raw: string): AccessToken => raw as AccessToken
export const toOtpToken = (raw: string): OtpToken => raw as OtpToken
