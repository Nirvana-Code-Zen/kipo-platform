'use client'

import { Envelope, Bell, MagnifyingGlass } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from '@kipo/ui-react'

import { useAuthStore } from '@/src/auth/ui/store/authStore'

import type { HeaderProps } from './types'

export function Header({ title, description, actions }: HeaderProps) {
  const session = useAuthStore(s => s.persistedSession)

  const displayName = session?.displayName ?? ''
  const email = session?.email ?? session?.phone ?? ''
  const avatarUrl = session?.avatarUrl
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  return (
    <header className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex-1 max-w-[360px]'>
          <Input
            placeholder='Buscar…'
            aria-label='Buscar en el dashboard'
            prefix={<MagnifyingGlass size={16} color='var(--text-muted)' />}
            suffix={
              <kbd className='inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-[var(--bg-base)] border border-border-subtle rounded-[6px] font-mono leading-snug select-none'>
                ⌘F
              </kbd>
            }
            wrapperClassName="m-0"
          />
        </div>

        <div className='flex items-center gap-1.5'>
          <Button variant='ghost' size='sm' aria-label='Mensajes' className='w-9 h-9 p-0 rounded-[10px]'>
            <Envelope size={17} />
          </Button>

          <div className='relative inline-flex'>
            <Button variant='ghost' size='sm' aria-label='Notificaciones' className='w-9 h-9 p-0 rounded-[10px]'>
              <Bell size={17} />
            </Button>
            <span
              aria-hidden='true'
              className='absolute top-2 right-2 w-[7px] h-[7px] rounded-full bg-[var(--brand)] border-[1.5px] border-card'
            />
          </div>

          <div className='flex items-center gap-2.5 pl-3.5 border-l border-border-subtle ml-1'>
            <Avatar className='w-9 h-9 ring-2 ring-primary/20'>
              {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} className='object-cover w-full h-full' />}
              <AvatarFallback className='bg-primary text-primary-foreground text-xs font-bold'>{initials}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-[13px] font-semibold text-foreground font-sans leading-tight'>
                {displayName}
              </span>
              <span className='text-[11px] text-muted-foreground font-sans leading-tight'>
                {email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className='font-display font-bold [font-size:clamp(20px,2vw,28px)] text-foreground tracking-[-0.03em] leading-[1.2] m-0'>
          {title}
        </h1>
        {description && (
          <p className='text-[13px] text-muted-foreground font-sans mt-1'>
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className='flex flex-wrap gap-2.5'>
          {actions}
        </div>
      )}
    </header>
  )
}
