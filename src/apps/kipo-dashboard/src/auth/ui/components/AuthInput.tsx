'use client'

import { useState } from 'react'

import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  showLabel?: boolean
  suffix?: ReactNode
  error?: string
}

export function AuthInput ({ label, showLabel, suffix, error, id, style, ...rest }: AuthInputProps) {
  const [focus, setFocus] = useState(false)
  const inputId = id ?? 'auth-' + label.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className="flex flex-col gap-1" style={style}>
      <label
        htmlFor={inputId}
        className={showLabel ? 'text-[13px] font-semibold text-muted-foreground font-sans' : 'sr-only'}
      >
        {label}
      </label>
      <div
        className={[
          'flex items-center gap-2 bg-muted rounded-[14px] px-4 transition-[border-color,box-shadow] duration-150',
          error ? 'border-destructive' : focus ? 'border-primary' : 'border-transparent',
          focus && !error ? 'shadow-[0_0_0_3px_var(--focus-ring)]' : '',
        ].join(' ')}
        style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
      >
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="flex-1 border-0 outline-none bg-transparent py-[15px] text-[15px] text-foreground font-sans"
          {...rest}
        />
        {suffix && (
          <span className="text-muted-foreground flex leading-none shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive font-sans m-0">
          {error}
        </p>
      )}
    </div>
  )
}
