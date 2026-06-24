import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StampCard } from './StampCard'

const meta: Meta<typeof StampCard> = {
  title: 'Components/Billing/StampCard',
  component: StampCard,
  parameters: { layout: 'centered' },
  argTypes: {
    qty:       { control: { type: 'number', min: 1, max: 1000 } },
    unitPrice: { control: { type: 'number', min: 0.5, max: 10, step: 0.5 } },
    label:     { control: 'text' },
    featured:  { control: 'boolean' },
    selected:  { control: 'boolean' },
  },
  args: {
    qty: 50,
    unitPrice: 3.5,
    featured: false,
    selected: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StampCard>

export const Default: Story = {}

export const Featured: Story = {
  args: { qty: 100, unitPrice: 3.0, label: 'Most popular', featured: true },
}

export const Selected: Story = {
  args: { selected: true, label: 'Selected' },
}

export const WithLabel: Story = {
  args: { qty: 500, unitPrice: 2.0, label: 'Pro' },
}

export const PricingGrid: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null)
    const plans = [
      { qty: 10,   unitPrice: 5.0, label: 'Starter' },
      { qty: 50,   unitPrice: 3.5 },
      { qty: 100,  unitPrice: 3.0, label: 'Most popular', featured: true },
      { qty: 250,  unitPrice: 2.5 },
      { qty: 500,  unitPrice: 2.0, label: 'Pro' },
      { qty: 1000, unitPrice: 1.5, label: 'Enterprise' },
    ] as const

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: 16 }}>
        {plans.map((plan) => (
          <StampCard
            key={plan.qty}
            {...plan}
            selected={selected === plan.qty}
            onSelect={setSelected}
          />
        ))}
      </div>
    )
  },
  parameters: { layout: 'padded' },
}
