import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../lib/cn'

import type { TooltipProps } from './types'

function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            data-slot="tooltip-content"
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              'z-[1000] max-w-[260px] bg-kipo-slate-900 text-white rounded-kipo px-3 py-2',
              'text-xs font-sans leading-[1.4] shadow-kipo-md',
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-kipo-slate-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export { Tooltip }
