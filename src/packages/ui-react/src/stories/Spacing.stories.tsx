import type { Meta, StoryObj } from '@storybook/react'
import { DocPage, DocSection } from './doc-helpers'
import { cn } from '../lib/cn'

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const spacingWidthClass: Record<number, string> = {
  4: 'w-1',
  8: 'w-2',
  12: 'w-3',
  16: 'w-4',
  20: 'w-5',
  24: 'w-6',
  32: 'w-8',
  40: 'w-10',
  48: 'w-12',
  64: 'w-16',
  80: 'w-20',
  96: 'w-24',
}

export const Spacing: Story = {
  name: 'Spacing',
  render: () => (
    <DocPage category="Spacing">

      <DocSection
        title="Radius"
        subtitle="Signature soft 12–16px corners + pill"
      >
        <div className="flex gap-7 flex-wrap items-end">
          {[
            { name: 'xs',   px: 6,   radiusClass: 'rounded-[var(--radius-xs)]' },
            { name: 'sm',   px: 8,   radiusClass: 'rounded-[var(--radius-sm)]' },
            { name: 'md',   px: 12,  radiusClass: 'rounded-[var(--radius-md)]' },
            { name: 'lg',   px: 16,  radiusClass: 'rounded-[var(--radius-lg)]' },
            { name: 'xl',   px: 24,  radiusClass: 'rounded-[var(--radius-xl)]' },
            { name: 'pill', px: 999, radiusClass: 'rounded-[var(--radius-pill)]' },
          ].map(({ name, px, radiusClass }) => (
            <div key={name} className="text-center">
              <div className={cn('w-[100px] h-[100px] bg-[var(--kipo-red-50)] border-2 border-[var(--kipo-red-300)]', radiusClass)} />
              <div className="font-mono text-xs text-text-muted mt-2.5 leading-snug">
                {name} · {px}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        title="Shadows"
        subtitle="Soft, low, plum-tinted elevation + brand glow"
        cardClassName="bg-bg-subtle"
      >
        <div className="flex gap-7 flex-wrap items-end">
          {[
            { name: 'xs',          shadowClass: 'shadow-[var(--shadow-xs)]',     bgClass: 'bg-surface-card' },
            { name: 'sm',          shadowClass: 'shadow-[var(--shadow-sm)]',     bgClass: 'bg-surface-card' },
            { name: 'md',          shadowClass: 'shadow-[var(--shadow-md)]',     bgClass: 'bg-surface-card' },
            { name: 'lg',          shadowClass: 'shadow-[var(--shadow-lg)]',     bgClass: 'bg-surface-card' },
            { name: 'brand glow',  shadowClass: 'shadow-[var(--shadow-brand)]',  bgClass: 'bg-[var(--kipo-red-400)]' },
            { name: 'accent glow', shadowClass: 'shadow-[var(--shadow-accent)]', bgClass: 'bg-[var(--kipo-lime-500)]' },
          ].map(({ name, shadowClass, bgClass }) => (
            <div key={name} className="text-center">
              <div className={cn('w-[120px] h-[88px] rounded-[var(--radius-md)]', bgClass, shadowClass)} />
              <div className="font-mono text-xs text-text-muted mt-3.5">
                {name}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        title="Spacing Scale"
        subtitle="4px base grid — space-1 through space-24"
      >
        <div className="flex flex-col gap-2.5">
          {[
            { token: 'space-1',  value: '0.25rem', px: 4  },
            { token: 'space-2',  value: '0.5rem',  px: 8  },
            { token: 'space-3',  value: '0.75rem', px: 12 },
            { token: 'space-4',  value: '1rem',    px: 16 },
            { token: 'space-5',  value: '1.25rem', px: 20 },
            { token: 'space-6',  value: '1.5rem',  px: 24 },
            { token: 'space-8',  value: '2rem',    px: 32 },
            { token: 'space-10', value: '2.5rem',  px: 40 },
            { token: 'space-12', value: '3rem',    px: 48 },
            { token: 'space-16', value: '4rem',    px: 64 },
            { token: 'space-20', value: '5rem',    px: 80 },
            { token: 'space-24', value: '6rem',    px: 96 },
          ].map(({ token, value, px }) => (
            <div key={token} className="flex items-center gap-5">
              <div className="font-mono text-[11px] text-text-muted w-[220px] shrink-0">
                --{token} · {value} · {px}px
              </div>
              <div className={cn('h-4 bg-[var(--kipo-red-400)] rounded-[3px] shrink-0 min-w-[3px]', spacingWidthClass[px])} />
            </div>
          ))}
        </div>
      </DocSection>

    </DocPage>
  ),
}
