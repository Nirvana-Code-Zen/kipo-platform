import type { Meta, StoryObj } from '@storybook/react'
import { DocPage, DocSection, Swatch, SwatchRow } from './doc-helpers'
import { Button } from '../components/Button/Button'
import { Badge } from '../components/Badge/Badge'

const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Colors: Story = {
  name: 'Colors',
  render: () => (
    <DocPage category="Colors">

      {/* ── Accent: Neon Lime ── */}
      <DocSection
        title="Accent — Neon Lime CTA"
        subtitle="High-conversion call-to-action accent"
      >
        <SwatchRow style={{ alignItems: 'stretch' }}>
          <Swatch step="300" style={{ background: 'var(--kipo-lime-300)' }} />
          <Swatch step="400" style={{ background: 'var(--kipo-lime-400)' }} />
          <Swatch step="500" style={{ background: 'var(--kipo-lime-500)' }} />
          <Swatch step="600" style={{ background: 'var(--kipo-lime-600)' }} />
          {/* usage example */}
          <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 8px' }}>
            <Button variant="accent" style={{ width: '100%', justifyContent: 'center' }}>
              Charge now
            </Button>
          </div>
        </SwatchRow>
      </DocSection>

      {/* ── Brand: Red ── */}
      <DocSection
        title="Brand — Red"
        subtitle="Core identity scale + signature gradient"
      >
        <SwatchRow style={{ marginBottom: 8 }}>
          <Swatch step="50"  style={{ background: 'var(--kipo-red-50)'  }} />
          <Swatch step="200" style={{ background: 'var(--kipo-red-200)' }} />
          <Swatch step="400" style={{ background: 'var(--kipo-red-400)' }} dark />
          <Swatch step="500" style={{ background: 'var(--kipo-red-500)' }} dark />
          <Swatch step="600" style={{ background: 'var(--kipo-red-600)' }} dark />
          <Swatch step="800" style={{ background: 'var(--kipo-red-800)' }} dark />
        </SwatchRow>
        <div style={{
          background: 'var(--kipo-gradient)',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 15,
            color: '#fff',
            letterSpacing: '-0.01em',
          }}>
            --kipo-gradient · #CE0D2F → #9F0824
          </span>
        </div>
      </DocSection>

      {/* ── Neutrals: Slate Darks ── */}
      <DocSection
        title="Neutrals — Slate Darks"
        subtitle="Slate-blue ink scale for dark surfaces"
        cardStyle={{ background: 'var(--kipo-slate-900)', border: '1px solid var(--kipo-slate-700)' }}
      >
        <SwatchRow>
          <Swatch step="900" hex="#182230" dark style={{ background: 'var(--kipo-slate-900)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
          <Swatch step="800" hex="#1F2C3A" dark style={{ background: 'var(--kipo-slate-800)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
          <Swatch step="700" hex="#2B3A4B" dark style={{ background: 'var(--kipo-slate-700)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
          <Swatch step="600" hex="#3A4C5F" dark style={{ background: 'var(--kipo-slate-600)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
          <Swatch step="500" hex="#4C6075" dark style={{ background: 'var(--kipo-slate-500)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
        </SwatchRow>
      </DocSection>

      {/* ── Neutrals: Warm Cream ── */}
      <DocSection
        title="Neutrals — Warm Cream"
        subtitle="Light app surfaces, borders & text"
      >
        <SwatchRow>
          <Swatch step="0"   hex="#FFFFFF" style={{ background: 'var(--kipo-cream-0)',   border: '1px solid var(--border-subtle)', borderRadius: 12 }} />
          <Swatch step="100" hex="#F1EAE0" style={{ background: 'var(--kipo-cream-100)', border: '1px solid var(--border-subtle)', borderRadius: 12 }} />
          <Swatch step="200" hex="#E4D9C9" style={{ background: 'var(--kipo-cream-200)', border: '1px solid var(--border-subtle)', borderRadius: 12 }} />
          <Swatch step="400" hex="#A99E8C" style={{ background: 'var(--kipo-cream-400)', borderRadius: 12 }} />
          <Swatch step="600" hex="#574F44" dark style={{ background: 'var(--kipo-cream-600)', borderRadius: 12 }} />
          <Swatch step="900" hex="#1A150F" dark style={{ background: 'var(--kipo-cream-900)', borderRadius: 12 }} />
        </SwatchRow>
      </DocSection>

      {/* ── Semantic: Status ── */}
      <DocSection
        title="Semantic — Status"
        subtitle="Paid, pending, rejected, info states"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Stamped',  token: 'success', dot: 'var(--kipo-success)', text: 'var(--kipo-success)', bg: 'var(--kipo-success-bg)' },
            { label: 'Pending',  token: 'warning', dot: 'var(--kipo-warning)', text: 'var(--kipo-warning)', bg: 'var(--kipo-warning-bg)' },
            { label: 'Rejected', token: 'danger',  dot: 'var(--kipo-danger)',  text: 'var(--kipo-danger)',  bg: 'var(--kipo-danger-bg)'  },
            { label: 'Draft',    token: 'info',    dot: 'var(--kipo-info)',    text: 'var(--kipo-info)',    bg: 'var(--kipo-info-bg)'    },
          ].map(({ label, token, dot, text, bg }) => (
            <div key={token} style={{
              background: bg,
              borderRadius: 16,
              padding: '24px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: dot,
              }} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 17,
                  color: text,
                  lineHeight: 1.2,
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: text,
                  opacity: 0.6,
                  marginTop: 4,
                }}>
                  {token}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ── Semantic: Badges ── */}
      <DocSection
        title="Semantic — Badges"
        subtitle="All tones in soft + solid variants"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map(t => (
              <Badge key={t} tone={t} dot>{t}</Badge>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map(t => (
              <Badge key={t} tone={t} solid>{t}</Badge>
            ))}
          </div>
        </div>
      </DocSection>

    </DocPage>
  ),
}
