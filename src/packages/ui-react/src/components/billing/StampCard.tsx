import { cn } from '../../lib/cn'

import type { StampCardProps } from './StampCard.types'

export function StampCard({
  qty = 50,
  unitPrice = 3.5,
  label = '',
  featured = false,
  selected = false,
  onSelect,
  className,
}: StampCardProps) {
  const totalParts = (qty * unitPrice).toLocaleString('es-MX', { minimumFractionDigits: 2 })

  return (
    <button
      onClick={() => onSelect?.(qty)}
      className={cn(
        'relative text-left w-full cursor-pointer rounded-kipo-lg p-5',
        'transition-transform duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]',
        featured
          ? 'bg-kipo-gradient text-white border-2 border-transparent shadow-kipo-brand'
          : cn(
              'bg-surface-card text-text-strong shadow-kipo-xs',
              selected ? 'border-2 border-brand' : 'border-[1.5px] border-border-subtle',
            ),
        className,
      )}
    >
      {label && (
        <span
          className={cn(
            'absolute top-3.5 right-3.5 text-[11px] font-bold font-sans uppercase tracking-wide',
            'px-2 py-0.5 rounded-kipo-pill',
            featured
              ? 'bg-[var(--kipo-lime-500)] text-kipo-slate-900'
              : 'bg-[var(--kipo-red-50)] text-brand-strong',
          )}
        >
          {label}
        </span>
      )}

      <div className="font-mono font-semibold text-[34px] tracking-[-0.02em]">
        {qty}
      </div>
      <div className={cn('text-[13px] mt-0.5', featured ? 'opacity-85' : 'opacity-60')}>
        timbres CFDI
      </div>

      <div
        className={cn(
          'mt-4 pt-3.5 flex items-baseline justify-between',
          featured ? 'border-t border-white/25' : 'border-t border-border-subtle',
        )}
      >
        <span className="font-mono font-semibold text-[22px]">${totalParts}</span>
        <span className="text-xs opacity-70 font-mono">
          ${unitPrice.toFixed(2)} c/u
        </span>
      </div>
    </button>
  )
}
