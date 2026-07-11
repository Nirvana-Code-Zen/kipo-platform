import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../lib/cn'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
}

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
            className={cn(className)}
            style={{
              background: 'var(--kipo-slate-900)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              lineHeight: 1.4,
              maxWidth: 260,
              boxShadow: 'var(--shadow-md)',
              zIndex: 1000,
            }}
          >
            {content}
            <TooltipPrimitive.Arrow style={{ fill: 'var(--kipo-slate-900)' }} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export { Tooltip }
