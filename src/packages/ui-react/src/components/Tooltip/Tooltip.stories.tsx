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
      <button className="border-0 bg-transparent cursor-pointer text-base">?</button>
    </Tooltip>
  ),
}

export const Sides: Story = {
  render: () => (
    <div className="flex gap-10">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip on ${side}`} side={side}>
          <button className="border-0 bg-transparent cursor-pointer">{side}</button>
        </Tooltip>
      ))}
    </div>
  ),
}
