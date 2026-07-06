'use client'


import { Envelope, Bell, MagnifyingGlass } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from '@kipo/ui-react'

import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function Header ({ title, description, actions }: HeaderProps) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <Input
            placeholder='Buscar…'
            aria-label='Buscar en el dashboard'
            prefix={<MagnifyingGlass size={16} color='var(--text-muted)' />}
            suffix={
              <kbd
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 6px',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.6,
                  userSelect: 'none',
                }}
              >
                ⌘F
              </kbd>
            }
            style={{ margin: 0 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Button
            variant='ghost'
            size='sm'
            aria-label='Mensajes'
            style={{ width: 36, height: 36, padding: 0, borderRadius: 10 }}
          >
            <Envelope size={17} />
          </Button>

          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <Button
              variant='ghost'
              size='sm'
              aria-label='Notificaciones'
              style={{ width: 36, height: 36, padding: 0, borderRadius: 10 }}
            >
              <Bell size={17} />
            </Button>
            <span
              aria-hidden='true'
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--brand)',
                border: '1.5px solid var(--surface-card)',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingLeft: 14,
              borderLeft: '1px solid var(--border-subtle)',
              marginLeft: 4,
            }}
          >
            <Avatar className='w-9 h-9 ring-2 ring-primary/20'>
              <AvatarImage src='/profile.jpeg' alt='Edgar Figueroa' className='object-cover w-full h-full' />
              <AvatarFallback className='bg-primary text-primary-foreground text-xs font-bold'>EF</AvatarFallback>
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-strong)',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.3,
                }}
              >
                Edgar Figueroa
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.3,
                }}
              >
                edgar@kipo.mx
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(20px, 2vw, 28px)',
            color: 'var(--text-strong)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              marginTop: 4,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {actions}
        </div>
      )}
    </header>
  )
}
