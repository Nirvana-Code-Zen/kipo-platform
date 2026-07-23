import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DocPage, DocSection } from './doc-helpers'
import { Input } from '../components/Input/Input'
import { Switch } from '../components/Switch/Switch'
import { StampCard } from '../components/billing/StampCard'

const meta: Meta = {
  title: 'Design Tokens/Components',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Components: Story = {
  name: 'Components',
  render: () => {
    const [auto, setAuto] = useState(true)
    const [copy, setCopy] = useState(false)
    const [selected, setSelected] = useState<number | null>(100)

    return (
      <DocPage category="Components">

        <DocSection
          title="Inputs & Switch"
          subtitle="Labelled fields, mono fiscal inputs, toggle"
        >
          <div className="bg-bg-base rounded-kipo-lg p-6 grid grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Client RFC"
              defaultValue="VEGL900312H45"
              className="font-mono"
            />
            <Input
              label="Amount"
              placeholder="0.00"
              prefix="$"
              suffix="MXN"
              defaultValue="1,200.00"
              mono
            />
            <Input
              label="Email"
              defaultValue="hello@"
              error="Check the format"
            />
            <div className="flex flex-col justify-center gap-5 pt-[22px]">
              <Switch
                label="Auto stamp"
                checked={auto}
                onChange={setAuto}
              />
              <Switch
                label="Receive email copy"
                checked={copy}
                onChange={setCopy}
              />
            </div>
          </div>
        </DocSection>

        <DocSection
          title="Stamp Packs — Pay as you go"
          subtitle="$3.50 MXN per CFDI stamp checkout cards"
        >
          <div className="grid grid-cols-3 gap-4">
            <StampCard
              qty={20}
              unitPrice={3.5}
              label="Starter"
              selected={selected === 20}
              onSelect={setSelected}
            />
            <StampCard
              qty={100}
              unitPrice={3.5}
              label="Most popular"
              featured
              selected={selected === 100}
              onSelect={setSelected}
            />
            <StampCard
              qty={500}
              unitPrice={2.9}
              label="Best price"
              selected={selected === 500}
              onSelect={setSelected}
            />
          </div>
        </DocSection>

      </DocPage>
    )
  },
}
