import { cn } from '../../lib/cn'

import { elevationClasses, paddingClasses } from './constants'
import type { CardProps } from './types'

export function Card({
  elevation = 'sm',
  padding = 'md',
  interactive = false,
  children,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-card border border-border-subtle rounded-kipo-lg',
        'transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        elevationClasses[elevation],
        paddingClasses[padding],
        interactive && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-kipo-md',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
