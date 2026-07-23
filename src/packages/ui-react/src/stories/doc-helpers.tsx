import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export function DocPage({ category, children }: { category: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base font-sans">
      <div className="border-b border-border-subtle px-12 pt-5 pb-4">
        <span className="font-sans text-xs text-text-muted tracking-[0.02em]">
          {category}
        </span>
      </div>
      {children}
    </div>
  )
}

function DocBtn({ children }: { children: ReactNode }) {
  return (
    <button className="font-sans text-[13px] font-medium text-text-strong bg-surface-card border border-border-strong rounded-kipo-sm px-3.5 py-1.5 cursor-pointer leading-snug whitespace-nowrap">
      {children}
    </button>
  )
}

export function DocSection({
  title,
  subtitle,
  children,
  cardClassName,
}: {
  title: string
  subtitle: string
  children: ReactNode
  cardClassName?: string
}) {
  return (
    <div className="px-12 pt-10 pb-5">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="font-display font-bold text-[22px] text-text-strong m-0 tracking-[-0.02em] leading-tight">
            {title}
          </h2>
          <p className="font-sans text-[15px] text-text-muted mt-[5px] mb-0 leading-snug">
            {subtitle}
          </p>
        </div>
        <div className="flex gap-2 shrink-0 ml-8">
          <DocBtn>Feedback</DocBtn>
          <DocBtn>↗ Edit</DocBtn>
        </div>
      </div>
      <div className={cn(
        'bg-surface-card border border-border-subtle rounded-kipo-lg p-7 overflow-hidden',
        cardClassName,
      )}>
        {children}
      </div>
      <div className="mt-3 font-sans text-[13px] text-text-muted pl-0.5 cursor-pointer">
        Add usage notes
      </div>
    </div>
  )
}

export function Swatch({
  step,
  hex,
  dark = false,
  className,
}: {
  step: string | number
  hex?: string
  dark?: boolean
  className?: string
}) {
  return (
    <div className={cn(
      'rounded-kipo min-h-28 px-3.5 py-3 flex flex-col justify-end flex-1 min-w-0',
      className,
    )}>
      <span className={cn(
        'font-mono font-bold text-sm leading-snug',
        dark ? 'text-white' : 'text-kipo-slate-900',
      )}>
        {step}
      </span>
      {hex && (
        <span className={cn(
          'font-mono text-xs mt-0.5',
          dark ? 'text-white/55' : 'text-[rgba(3,38,65,0.45)]',
        )}>
          {hex}
        </span>
      )}
    </div>
  )
}

export function SwatchRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-2', className)}>
      {children}
    </div>
  )
}

export function MonoMeta({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[13px] text-text-muted mt-5 leading-normal">
      {children}
    </div>
  )
}
