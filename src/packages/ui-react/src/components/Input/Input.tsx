import { useState } from 'react'
import { cn } from '../../lib/cn'

import type { InputProps } from './types'

export function Input({
  label,
  hint,
  error,
  mono = false,
  prefix,
  suffix,
  id,
  className,
  wrapperClassName,
  ...rest
}: InputProps) {
  const [focus, setFocus] = useState(false)
  const inputId = id ?? (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="font-sans font-semibold text-[13px] text-text-strong">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 bg-surface-card border-[1.5px] rounded-kipo px-3.5',
          'transition-[border-color,box-shadow] duration-[120ms]',
          error
            ? 'border-danger'
            : focus
              ? 'border-brand shadow-[0_0_0_4px_var(--focus-ring)]'
              : 'border-border-strong',
        )}
      >
        {prefix && (
          <span className="text-text-muted font-mono text-sm">{prefix}</span>
        )}
        <input
          id={inputId}
          className={cn(
            'flex-1 border-0 outline-none bg-transparent py-3 text-[15px] text-text-strong',
            mono ? 'font-mono tabular-nums tracking-[-0.01em]' : 'font-sans',
            className,
          )}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
        />
        {suffix && (
          <span className="text-text-muted font-mono text-sm">{suffix}</span>
        )}
      </div>
      {(error ?? hint) && (
        <span className={cn('text-xs', error ? 'text-danger' : 'text-text-muted')}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
