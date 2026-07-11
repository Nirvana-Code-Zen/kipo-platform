import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'accent', 'secondary', 'ghost', 'danger'] },
    tone:    { control: 'select', options: ['brand', 'accent', 'danger'], if: { arg: 'variant', eq: 'ghost' } },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    full:     { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Issue invoice',
    variant: 'primary',
    size: 'md',
    disabled: false,
    full: false,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {}

export const Accent: Story = {
  args: { variant: 'accent', children: 'Add stamp' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'View details' },
}

export const GhostTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="ghost" tone="brand">Brand</Button>
      <Button variant="ghost" tone="accent">Accent</Button>
      <Button variant="ghost" tone="danger">Danger</Button>
    </div>
  ),
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete RFC' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const FullWidth: Story = {
  args: { full: true },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
