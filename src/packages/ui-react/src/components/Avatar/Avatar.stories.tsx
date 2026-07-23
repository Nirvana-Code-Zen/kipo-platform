import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from './Avatar'
import { cn } from '../../lib/cn'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="Edgar Figueroa" />
      <AvatarFallback>EF</AvatarFallback>
    </Avatar>
  ),
}

export const FallbackInitials: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="Edgar Figueroa" />
      <AvatarFallback>EF</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['w-6 h-6', 'w-8 h-8', 'w-9 h-9', 'w-12 h-12', 'w-16 h-16'] as const).map((size) => (
        <Avatar key={size} className={size}>
          <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="Edgar Figueroa" />
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const InHeader: Story = {
  render: () => (
    <Avatar className="w-9 h-9 ring-2 ring-primary/20">
      <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="Edgar Figueroa" className="object-cover w-full h-full" />
      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">EF</AvatarFallback>
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <div className="flex">
      {[12, 32, 47].map((img, i) => (
        <Avatar
          key={img}
          className={cn(
            'w-9 h-9 ring-2',
            i === 0 ? 'ml-0' : '-ml-3',
            i === 0 && 'z-[3]',
            i === 1 && 'z-[2]',
            i === 2 && 'z-[1]',
          )}
        >
          <AvatarImage src={`https://i.pravatar.cc/64?img=${img}`} alt="" />
          <AvatarFallback>--</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}
