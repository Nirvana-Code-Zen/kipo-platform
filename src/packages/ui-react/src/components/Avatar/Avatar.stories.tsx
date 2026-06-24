import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'range', min: 24, max: 120, step: 4 } },
    name: { control: 'text' },
    src:  { control: 'text' },
  },
  args: {
    name: 'Maria Garcia',
    size: 40,
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Initials: Story = {}

export const TwoWords: Story = {
  args: { name: 'Carlos Lopez' },
}

export const Large: Story = {
  args: { size: 80 },
}

export const Small: Story = {
  args: { size: 28 },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {[24, 32, 40, 56, 72, 96].map((size) => (
        <Avatar key={size} name="Kipo User" size={size} />
      ))}
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      {['Ana Ruiz', 'Carlos Vega', 'Diana Mora', 'Eduardo Soto'].map((name, i) => (
        <div key={name} style={{ marginLeft: i === 0 ? 0 : -12, zIndex: i }}>
          <Avatar name={name} size={40} style={{ border: '2px solid var(--surface-card)' }} />
        </div>
      ))}
    </div>
  ),
}
