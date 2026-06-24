import type { Meta, StoryObj } from '@storybook/react'
import { DocPage, DocSection, MonoMeta } from './doc-helpers'

const meta: Meta = {
  title: 'Design Tokens/Typography',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Typography: Story = {
  name: 'Typography',
  render: () => (
    <DocPage category="Type">

      {/* ── Body & UI — Inter ── */}
      <DocSection
        title="Body & UI — Inter"
        subtitle="Interface copy, high legibility on mobile"
      >
        <div style={{ maxWidth: 560 }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 11,
            color: 'var(--brand)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            New account
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 24,
            color: 'var(--text-strong)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 12,
          }}>
            Your RFC, your logo, and done.
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 400,
            color: 'var(--text-body)',
            lineHeight: 1.6,
            margin: '0 0 16px',
          }}>
            Scan your Tax Status Certificate and Kipo fills in your data
            automatically. No endless forms, no odd bureaucracy — just valid
            invoices before the SAT.
          </p>
          <MonoMeta>Inter · 400 / 500 / 600 · base 16px · line-height 1.6</MonoMeta>
        </div>
      </DocSection>

      {/* ── Display — Plus Jakarta Sans ── */}
      <DocSection
        title="Display — Plus Jakarta Sans"
        subtitle="Headings & hero titles, bold geometric"
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 56,
            color: 'var(--text-strong)',
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            marginBottom: 12,
          }}>
            Invoice. No drama.
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 32,
            color: 'var(--text-strong)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            Charge and stamp in seconds.
          </div>
          <MonoMeta>Plus Jakarta Sans · 600 / 800 · letter-spacing -0.015 to -0.03em</MonoMeta>
        </div>
      </DocSection>

      {/* ── Financial — Geist Mono ── */}
      <DocSection
        title="Financial — Geist Mono"
        subtitle="Amounts, RFC, folios, tax tables — tabular"
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            <span style={{ color: 'var(--text-strong)' }}>$ 12,480.</span>
            <span style={{ color: 'var(--text-muted)' }}>00</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Item', 'Qty.', 'Amount'].map((h, i) => (
                  <th key={h} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    textAlign: i === 0 ? 'left' : 'right',
                    padding: '0 0 10px',
                    letterSpacing: '0.02em',
                  }}>
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
                <tr key={item} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 0', color: 'var(--text-strong)', fontWeight: 400 }}>{item}</td>
                  <td style={{ padding: '12px 0', color: 'var(--text-body)', textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{qty}</td>
                  <td style={{ padding: '12px 0', color: 'var(--text-strong)', textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <MonoMeta>Geist Mono · RFC: KIPO850101AB3 · tabular-nums</MonoMeta>
        </div>
      </DocSection>

      {/* ── Type Scale ── */}
      <DocSection
        title="Type Scale"
        subtitle="Display → caption, with role + size"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { role: 'display', px: 56, text: 'Invoice. No drama.',        weight: 800 },
            { role: 'h1',      px: 40, text: 'Your business, in order',   weight: 700 },
            { role: 'h2',      px: 32, text: 'Charge in seconds',         weight: 700 },
            { role: 'h3',      px: 24, text: 'Invoice line items',        weight: 700 },
            { role: 'base',    px: 16, text: 'Interface and body text',   weight: 400 },
            { role: 'xs',      px: 12, text: 'LABEL / EYEBROW',           weight: 700 },
          ].map(({ role, px, text, weight }, i, arr) => (
            <div
              key={role}
              style={{
                display: 'grid',
                gridTemplateColumns: '130px 1fr',
                alignItems: 'center',
                gap: 32,
                padding: '14px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, flexShrink: 0 }}>
                {role} · {px}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: px,
                fontWeight: weight,
                color: 'var(--text-strong)',
                letterSpacing: px >= 32 ? '-0.025em' : px === 12 ? '0.06em' : '-0.01em',
                lineHeight: 1.05,
                textTransform: px === 12 ? 'uppercase' : 'none',
              } as React.CSSProperties}>
                {text}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

    </DocPage>
  ),
}
