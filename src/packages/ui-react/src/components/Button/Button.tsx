import { cn } from '../../lib/cn'

import { ghostToneClasses, sizeClasses, variantClasses } from './constants'
import type { ButtonProps } from './types'

export function Button({
  variant = 'primary',
  tone = 'brand',
  size = 'md',
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-display font-bold leading-none tracking-[-0.01em]',
        'cursor-pointer transition-[transform,filter] duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        'active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45',
        sizeClasses[size],
        variantClasses[variant],
        variant === 'ghost' && ghostToneClasses[tone],
        full ? 'w-full' : 'w-auto',
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
