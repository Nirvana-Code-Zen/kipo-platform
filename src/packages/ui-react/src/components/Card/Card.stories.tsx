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
    className: 'w-[280px]',
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: (
      <div>
        <div className="font-display font-bold text-base text-text-strong mb-2">
          Invoice #FE-0042
        </div>
        <div className="font-sans text-sm text-text-muted">
          XAXX010101000 · VAT 16%
        </div>
        <div className="font-mono text-[22px] font-semibold text-text-strong mt-4">
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
        <div className="font-display font-bold text-[15px] text-text-strong mb-1">
          Hover over me ↑
        </div>
        <div className="font-sans text-[13px] text-text-muted">
          Card lifts with animation
        </div>
      </div>
    ),
  },
}

export const AllElevations: Story = {
  render: () => (
    <div className="flex gap-5 items-start flex-wrap">
      {(['none', 'xs', 'sm', 'md', 'lg'] as const).map((elevation) => (
        <Card key={elevation} elevation={elevation} className="w-[140px]">
          <div className="font-mono text-[11px] text-text-muted mb-2">
            {elevation}
          </div>
          <div className="text-text-strong font-sans text-sm font-semibold">
            Card
          </div>
        </Card>
      ))}
    </div>
  ),
}
