import { type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  hint?: string
  error?: string
  mono?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  wrapperClassName?: string
}
