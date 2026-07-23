import type { Meta, StoryObj } from '@storybook/react'
import { DocPage, DocSection, MonoMeta } from './doc-helpers'
import { cn } from '../lib/cn'

const meta: Meta = {
  title: 'Design Tokens/Typography',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const typeScaleSizeClass: Record<number, string> = {
  56: 'text-[56px]',
  40: 'text-[40px]',
  32: 'text-[32px]',
  24: 'text-2xl',
  16: 'text-base',
  12: 'text-xs',
}

const typeScaleTrackingClass = (px: number) =>
  px >= 32 ? 'tracking-[-0.025em]' : px === 12 ? 'tracking-[0.06em]' : 'tracking-[-0.01em]'

export const Typography: Story = {
  name: 'Typography',
  render: () => (
    <DocPage category="Type">

      <DocSection
        title="Body & UI — Inter"
        subtitle="Interface copy, high legibility on mobile"
      >
        <div className="max-w-[560px]">
          <div className="font-sans font-bold text-[11px] text-brand tracking-[0.1em] uppercase mb-2.5">
            New account
          </div>
          <div className="font-display font-bold text-2xl text-text-strong tracking-[-0.02em] leading-tight mb-3">
            Your RFC, your logo, and done.
          </div>
          <p className="font-sans text-base font-normal text-text-body leading-relaxed m-0 mb-4">
            Scan your Tax Status Certificate and Kipo fills in your data
            automatically. No endless forms, no odd bureaucracy — just valid
            invoices before the SAT.
          </p>
          <MonoMeta>Inter · 400 / 500 / 600 · base 16px · line-height 1.6</MonoMeta>
        </div>
      </DocSection>

      <DocSection
        title="Display — Plus Jakarta Sans"
        subtitle="Headings & hero titles, bold geometric"
      >
        <div>
          <div className="font-display font-extrabold text-[56px] text-text-strong tracking-[-0.03em] leading-none mb-3">
            Invoice. No drama.
          </div>
          <div className="font-display font-semibold text-[32px] text-text-strong tracking-[-0.02em] leading-[1.15] mb-5">
            Charge and stamp in seconds.
          </div>
          <MonoMeta>Plus Jakarta Sans · 600 / 800 · letter-spacing -0.015 to -0.03em</MonoMeta>
        </div>
      </DocSection>

      <DocSection
        title="Financial — Geist Mono"
        subtitle="Amounts, RFC, folios, tax tables — tabular"
      >
        <div>
          <div className="font-mono text-[52px] font-semibold tracking-[-0.02em] tabular-nums leading-[1.1] mb-6">
            <span className="text-text-strong">$ 12,480.</span>
            <span className="text-text-muted">00</span>
          </div>

          <table className="w-full border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                {['Item', 'Qty.', 'Amount'].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'font-mono text-xs font-medium text-text-muted pb-2.5 tracking-[0.02em]',
                      i === 0 ? 'text-left' : 'text-right',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Logo design',    '1', '8,000.00'],
                ['Photo session',  '2', '4,480.00'],
                ['VAT 16%',        '—', '1,996.80'],
              ].map(([item, qty, amount]) => (
                <tr key={item} className="border-b border-border-subtle">
                  <td className="py-3 text-text-strong font-normal">{item}</td>
                  <td className="py-3 text-text-body text-right font-mono tabular-nums">{qty}</td>
                  <td className="py-3 text-text-strong text-right font-mono tabular-nums">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <MonoMeta>Geist Mono · RFC: KIPO850101AB3 · tabular-nums</MonoMeta>
        </div>
      </DocSection>

      <DocSection
        title="Type Scale"
        subtitle="Display → caption, with role + size"
      >
        <div className="flex flex-col">
          {[
            { role: 'display', px: 56, text: 'Invoice. No drama.',        weight: 'font-extrabold' },
            { role: 'h1',      px: 40, text: 'Your business, in order',   weight: 'font-bold' },
            { role: 'h2',      px: 32, text: 'Charge in seconds',         weight: 'font-bold' },
            { role: 'h3',      px: 24, text: 'Invoice line items',        weight: 'font-bold' },
            { role: 'base',    px: 16, text: 'Interface and body text',   weight: 'font-normal' },
            { role: 'xs',      px: 12, text: 'LABEL / EYEBROW',           weight: 'font-bold' },
          ].map(({ role, px, text, weight }, i, arr) => (
            <div
              key={role}
              className={cn(
                'grid grid-cols-[130px_1fr] items-center gap-8 py-3.5',
                i < arr.length - 1 && 'border-b border-border-subtle',
              )}
            >
              <div className="font-mono text-xs text-text-muted leading-snug shrink-0">
                {role} · {px}
              </div>
              <div className={cn(
                'font-display text-text-strong leading-[1.05]',
                typeScaleSizeClass[px],
                weight,
                typeScaleTrackingClass(px),
                px === 12 && 'uppercase',
              )}>
                {text}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

    </DocPage>
  ),
}
