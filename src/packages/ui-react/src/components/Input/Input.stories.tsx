import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  argTypes: {
    mono:     { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
    hint:     { control: 'text' },
    error:    { control: 'text' },
  },
  args: {
    label: 'RFC',
    placeholder: 'XAXX010101000',
    style: { width: 320 },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithHint: Story = {
  args: {
    hint: '12-character RFC (company) or 13 (individual)',
  },
}

export const WithError: Story = {
  args: {
    error: 'Invalid RFC — check the format',
    defaultValue: 'XAXX0101',
  },
}

export const WithPrefix: Story = {
  args: {
    label: 'Amount',
    placeholder: '0.00',
    prefix: '$',
    mono: true,
    type: 'number',
  },
}

export const WithSuffix: Story = {
  args: {
    label: 'Email address',
    placeholder: 'user',
    suffix: '@company.com',
  },
}

export const Mono: Story = {
  args: {
    label: 'Total CFDI',
    placeholder: '0.00',
    mono: true,
    type: 'number',
    hint: 'Tabular numerals for financial precision',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'XAXX010101000',
    hint: 'Read-only field',
  },
}
