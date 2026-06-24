import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    label: 'Receive email notifications',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}

export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}

export const NoLabel: Story = {
  args: { label: '' },
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Feature unavailable' },
  render: (args) => <Switch {...args} checked={false} />,
}

export const DisabledChecked: Story = {
  args: { disabled: true, label: 'Always on' },
  render: (args) => <Switch {...args} checked={true} />,
}

export const Group: Story = {
  render: () => {
    const [states, setStates] = useState({
      invoices: true,
      payments: false,
      reminders: true,
    })
    const toggle = (key: keyof typeof states) =>
      setStates((s) => ({ ...s, [key]: !s[key] }))

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
        <Switch label="Issued invoices"      checked={states.invoices}   onChange={() => toggle('invoices')} />
        <Switch label="Received payments"    checked={states.payments}   onChange={() => toggle('payments')} />
        <Switch label="Due date reminders"   checked={states.reminders}  onChange={() => toggle('reminders')} />
      </div>
    )
  },
}
