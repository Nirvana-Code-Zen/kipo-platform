import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  argTypes: {
    elevation:   { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
  },
  args: {
    elevation: 'sm',
    interactive: false,
    style: { width: 280 },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: (
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-strong)', marginBottom: 8 }}>
          Invoice #FE-0042
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)' }}>
          XAXX010101000 · VAT 16%
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--text-strong)', marginTop: 16 }}>
          $3,450.00
        </div>
      </div>
    ),
  },
}

export const Interactive: Story = {
  args: {
    interactive: true,
    children: (
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>
          Hover over me ↑
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}>
          Card lifts with animation
        </div>
      </div>
    ),
  },
}

export const AllElevations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {(['none', 'xs', 'sm', 'md', 'lg'] as const).map((elevation) => (
        <Card key={elevation} elevation={elevation} style={{ width: 140 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
            {elevation}
          </div>
          <div style={{ color: 'var(--text-strong)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600 }}>
            Card
          </div>
        </Card>
      ))}
    </div>
  ),
}
