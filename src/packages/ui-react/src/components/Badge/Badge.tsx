import { cn } from '../../lib/cn'

import { toneClasses } from './constants'
import type { BadgeProps } from './types'

export function Badge({ tone = 'neutral', solid = false, dot = false, children, className, ...rest }: BadgeProps) {
  const t = toneClasses[tone]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-kipo-pill font-sans font-semibold text-xs leading-[1.3]',
        solid ? 'text-white' : t.soft,
        solid && t.solid,
        className,
      )}
      {...rest}
    >
      {dot && (
        <span
          className={cn(
            'w-[7px] h-[7px] rounded-full shrink-0',
            solid ? 'bg-white' : t.dot,
          )}
        />
      )}
      {children}
    </span>
  )
}
