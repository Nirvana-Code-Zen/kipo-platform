import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip content="Un CSD es tu Certificado de Sello Digital emitido por el SAT.">
      <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>?</button>
    </Tooltip>
  ),
}

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip on ${side}`} side={side}>
          <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>{side}</button>
        </Tooltip>
      ))}
    </div>
  ),
}
