import type { Meta, StoryObj } from '@storybook/react'
import { DocPage, DocSection, Swatch, SwatchRow } from './doc-helpers'
import { Button } from '../components/Button/Button'
import { Badge } from '../components/Badge/Badge'
import { cn } from '../lib/cn'

const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const statusStyles = {
  success: { card: 'bg-success-soft', dot: 'bg-success', text: 'text-success' },
  warning: { card: 'bg-warning-soft', dot: 'bg-warning', text: 'text-warning' },
  danger:  { card: 'bg-danger-soft',  dot: 'bg-danger',  text: 'text-danger'  },
  info:    { card: 'bg-info-soft',    dot: 'bg-info',    text: 'text-info'    },
} as const

export const Colors: Story = {
  name: 'Colors',
  render: () => (
    <DocPage category="Colors">

      <DocSection
        title="Accent — Neon Lime CTA"
        subtitle="High-conversion call-to-action accent"
      >
        <SwatchRow className="items-stretch">
          <Swatch step="300" className="bg-[var(--kipo-lime-300)]" />
          <Swatch step="400" className="bg-[var(--kipo-lime-400)]" />
          <Swatch step="500" className="bg-[var(--kipo-lime-500)]" />
          <Swatch step="600" className="bg-[var(--kipo-lime-600)]" />
          <div className="flex-1 flex items-center justify-center px-2 py-3">
            <Button variant="accent" className="w-full justify-center">
              Charge now
            </Button>
          </div>
        </SwatchRow>
      </DocSection>

      <DocSection
        title="Brand — Red"
        subtitle="Core identity scale + signature gradient"
      >
        <SwatchRow className="mb-2">
          <Swatch step="50"  className="bg-[var(--kipo-red-50)]"  />
          <Swatch step="200" className="bg-[var(--kipo-red-200)]" />
          <Swatch step="400" className="bg-[var(--kipo-red-400)]" dark />
          <Swatch step="500" className="bg-[var(--kipo-red-500)]" dark />
          <Swatch step="600" className="bg-[var(--kipo-red-600)]" dark />
          <Swatch step="800" className="bg-[var(--kipo-red-800)]" dark />
        </SwatchRow>
        <div className="bg-kipo-gradient rounded-kipo px-6 py-5 flex items-center">
          <span className="font-mono font-bold text-[15px] text-white tracking-[-0.01em]">
            --kipo-gradient · #e00b26 → #bc0921
          </span>
        </div>
      </DocSection>

      <DocSection
        title="Neutrals — Navy Ink"
        subtitle="Deep navy scale for dark surfaces and heading text"
        cardClassName="bg-kipo-slate-900 border-[var(--kipo-slate-700)]"
      >
        <SwatchRow>
          <Swatch step="900" hex="#032641" dark className="bg-kipo-slate-900 border border-white/[0.08] rounded-kipo" />
          <Swatch step="800" hex="#0a3352" dark className="bg-[var(--kipo-slate-800)] border border-white/[0.08] rounded-kipo" />
          <Swatch step="700" hex="#124066" dark className="bg-[var(--kipo-slate-700)] border border-white/[0.08] rounded-kipo" />
          <Swatch step="600" hex="#1c4f78" dark className="bg-[var(--kipo-slate-600)] border border-white/[0.08] rounded-kipo" />
          <Swatch step="500" hex="#2d6a9f" dark className="bg-[var(--kipo-slate-500)] border border-white/[0.08] rounded-kipo" />
        </SwatchRow>
      </DocSection>

      <DocSection
        title="Neutrals — Near-White"
        subtitle="Light app surfaces, borders & text"
      >
        <SwatchRow>
          <Swatch step="0"   hex="#FFFFFF" className="bg-[var(--kipo-cream-0)]   border border-border-subtle rounded-kipo" />
          <Swatch step="100" hex="#f8f6f5" className="bg-[var(--kipo-cream-100)] border border-border-subtle rounded-kipo" />
          <Swatch step="200" hex="#edeae8" className="bg-[var(--kipo-cream-200)] border border-border-subtle rounded-kipo" />
          <Swatch step="400" hex="#aba4a0" className="bg-[var(--kipo-cream-400)] rounded-kipo" />
          <Swatch step="600" hex="#4d4744" dark className="bg-[var(--kipo-cream-600)] rounded-kipo" />
          <Swatch step="900" hex="#0d0c0b" dark className="bg-[var(--kipo-cream-900)] rounded-kipo" />
        </SwatchRow>
      </DocSection>

      <DocSection
        title="Semantic — Status"
        subtitle="Paid, pending, rejected, info states"
      >
        <div className="grid grid-cols-4 gap-3">
          {([
            { label: 'Stamped',  token: 'success' as const },
            { label: 'Pending',  token: 'warning' as const },
            { label: 'Rejected', token: 'danger'  as const },
            { label: 'Draft',    token: 'info'    as const },
          ]).map(({ label, token }) => {
            const styles = statusStyles[token]
            return (
              <div key={token} className={cn('rounded-kipo-lg px-5 pt-6 pb-5 flex flex-col gap-2.5', styles.card)}>
                <div className={cn('w-9 h-9 rounded-full', styles.dot)} />
                <div>
                  <div className={cn('font-display font-bold text-[17px] leading-tight', styles.text)}>
                    {label}
                  </div>
                  <div className={cn('font-mono text-xs opacity-60 mt-1', styles.text)}>
                    {token}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </DocSection>

      <DocSection
        title="Semantic — Badges"
        subtitle="All tones in soft + solid variants"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map(t => (
              <Badge key={t} tone={t} dot>{t}</Badge>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map(t => (
              <Badge key={t} tone={t} solid>{t}</Badge>
            ))}
          </div>
        </div>
      </DocSection>

    </DocPage>
  ),
}
