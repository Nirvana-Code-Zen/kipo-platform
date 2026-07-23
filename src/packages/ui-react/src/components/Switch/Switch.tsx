import { cn } from '../../lib/cn'

import type { SwitchProps } from './types'

export function Switch({ checked = false, onChange, disabled = false, label = '', className }: SwitchProps) {
  const toggle = () => { if (!disabled && onChange) onChange(!checked) }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2.5',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <span
        onClick={toggle}
        role="switch"
        aria-checked={checked}
        className={cn(
          'relative w-[46px] h-7 rounded-kipo-pill shrink-0 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          checked ? 'bg-kipo-gradient' : 'bg-[var(--kipo-cream-300)]',
        )}
      >
        <span
          className={cn(
            'absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-kipo-sm',
            'transition-[left] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
            checked ? 'left-[21px]' : 'left-[3px]',
          )}
        />
      </span>
      {label && (
        <span className="font-sans text-sm text-text-body">{label}</span>
      )}
    </label>
  )
}
