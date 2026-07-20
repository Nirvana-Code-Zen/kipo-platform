import type { InputHTMLAttributes, ReactNode } from 'react'

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  showLabel?: boolean
  suffix?: ReactNode
  error?: string
}
