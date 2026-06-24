import type { Meta, StoryObj } from '@storybook/react'
import { DocPage, DocSection } from './doc-helpers'

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Spacing: Story = {
  name: 'Spacing',
  render: () => (
    <DocPage category="Spacing">

      {/* ── Radius ── */}
      <DocSection
        title="Radius"
        subtitle="Signature soft 12–16px corners + pill"
      >
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            { name: 'xs',   px: 6,   cssVar: 'var(--radius-xs)',   size: 100 },
            { name: 'sm',   px: 8,   cssVar: 'var(--radius-sm)',   size: 100 },
            { name: 'md',   px: 12,  cssVar: 'var(--radius-md)',   size: 100 },
            { name: 'lg',   px: 16,  cssVar: 'var(--radius-lg)',   size: 100 },
            { name: 'xl',   px: 24,  cssVar: 'var(--radius-xl)',   size: 100 },
            { name: 'pill', px: 999, cssVar: 'var(--radius-pill)', size: 100 },
          ].map(({ name, px, cssVar, size }) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{
                width: size,
                height: size,
                background: 'var(--kipo-red-50)',
                border: '2px solid var(--kipo-red-300)',
                borderRadius: cssVar,
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-muted)',
                marginTop: 10,
                lineHeight: 1.4,
              }}>
                {name} · {px}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ── Shadows ── */}
      <DocSection
        title="Shadows"
        subtitle="Soft, low, plum-tinted elevation + brand glow"
        cardStyle={{ background: 'var(--bg-subtle)' }}
      >
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            { name: 'xs',          cssVar: 'var(--shadow-xs)',     bg: 'var(--surface-card)',    color: undefined },
            { name: 'sm',          cssVar: 'var(--shadow-sm)',     bg: 'var(--surface-card)',    color: undefined },
            { name: 'md',          cssVar: 'var(--shadow-md)',     bg: 'var(--surface-card)',    color: undefined },
            { name: 'lg',          cssVar: 'var(--shadow-lg)',     bg: 'var(--surface-card)',    color: undefined },
            { name: 'brand glow',  cssVar: 'var(--shadow-brand)',  bg: 'var(--kipo-red-400)',    color: undefined },
            { name: 'accent glow', cssVar: 'var(--shadow-accent)', bg: 'var(--kipo-lime-500)',   color: undefined },
          ].map(({ name, cssVar, bg }) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{
                width: 120,
                height: 88,
                background: bg,
                borderRadius: 'var(--radius-md)',
                boxShadow: cssVar,
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-muted)',
                marginTop: 14,
              }}>
                {name}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ── Spacing Scale ── */}
      <DocSection
        title="Spacing Scale"
        subtitle="4px base grid — space-1 through space-24"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                width: 220,
                flexShrink: 0,
              }}>
                --{token} · {value} · {px}px
              </div>
              <div style={{
                height: 16,
                width: px,
                background: 'var(--kipo-red-400)',
                borderRadius: 3,
                flexShrink: 0,
                minWidth: 3,
              }} />
            </div>
          ))}
        </div>
      </DocSection>

    </DocPage>
  ),
}
