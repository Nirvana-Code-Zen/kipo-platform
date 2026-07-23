import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    tone:     { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] },
    solid:    { control: 'boolean' },
    dot:      { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'CFDI 4.0',
    tone: 'brand',
    solid: false,
    dot: false,
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Solid: Story = {
  args: { solid: true },
}

export const WithDot: Story = {
  args: { dot: true, children: 'Active' },
}

export const AllTones: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
        <Badge key={tone} tone={tone}>{tone}</Badge>
      ))}
    </div>
  ),
}

export const AllTonesSolid: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
        <Badge key={tone} tone={tone} solid>{tone}</Badge>
      ))}
    </div>
  ),
}

export const InvoiceStatuses: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge tone="success" dot>Stamped</Badge>
      <Badge tone="warning" dot>Pending</Badge>
      <Badge tone="danger"  dot>Cancelled</Badge>
      <Badge tone="info"    dot>In progress</Badge>
      <Badge tone="neutral" dot>Draft</Badge>
    </div>
  ),
}
