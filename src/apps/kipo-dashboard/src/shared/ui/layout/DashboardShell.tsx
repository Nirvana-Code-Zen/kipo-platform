'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SquaresFour,
  Users,
  Receipt,
  UserCircle,
  Gear,
  Question,
  SignOut,
  MagnifyingGlass,
  Bell,
} from '@phosphor-icons/react'

import type { ReactNode } from 'react'

interface DashboardShellProps {
  children: ReactNode
}

const SIDEBAR_W = 240

const NAV_ITEMS = [
  { label: 'Dashboard',   href: '/dashboard',  Icon: SquaresFour },
  { label: 'Clientes',    href: '/customers',  Icon: Users },
  { label: 'Facturación', href: '/billing',    Icon: Receipt },
  { label: 'Usuarios',    href: '/users',      Icon: UserCircle },
]

const GENERAL_ITEMS = [
  { label: 'Ajustes', href: '/settings', Icon: Gear },
  { label: 'Ayuda',   href: '/help',     Icon: Question },
]

function NavItem ({
  href, label, Icon, active,
}: { href: string; label: string; Icon: React.ElementType; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 10,
        textDecoration: 'none',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--text-on-brand)' : 'var(--text-body)',
        background: active ? 'var(--brand)' : 'transparent',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      <Icon size={18} weight={active ? 'fill' : 'regular'} style={{ flexShrink: 0 }} />
      {label}
    </Link>
  )
}

export function DashboardShell ({ children }: DashboardShellProps) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg-base)' }}>
      <aside
        style={{
          width: SIDEBAR_W,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface-card)',
          borderRight: '1px solid var(--border-subtle)',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          overflowY: 'auto',
          zIndex: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '20px 16px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/kipo-logo.svg' alt='' aria-hidden='true' width={22} height={22} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 20,
              color: 'var(--brand)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            kipo
          </span>
        </div>

        <nav style={{ padding: '16px 10px', flex: 1 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              padding: '0 12px',
              marginBottom: 6,
            }}
          >
            Menu
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
            {NAV_ITEMS.map(({ href, label, Icon }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                Icon={Icon}
                active={pathname === href || (href !== '/dashboard' && pathname.startsWith(href))}
              />
            ))}
          </div>

          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              padding: '0 12px',
              marginBottom: 6,
            }}
          >
            General
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {GENERAL_ITEMS.map(({ href, label, Icon }) => (
              <NavItem key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
            ))}
            <button
              type='button'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--text-body)',
                textAlign: 'left',
                width: '100%',
                transition: 'color 0.15s',
              }}
            >
              <SignOut size={18} style={{ flexShrink: 0 }} />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </aside>

      <div style={{ marginLeft: SIDEBAR_W, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            background: 'var(--surface-card)',
            borderBottom: '1px solid var(--border-subtle)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: '8px 14px',
              width: 280,
            }}
          >
            <MagnifyingGlass size={16} color='var(--text-muted)' />
            <input
              type='search'
              placeholder='Buscar factura, cliente, RFC...'
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 13,
                color: 'var(--text-strong)',
                fontFamily: 'var(--font-body)',
                flex: 1,
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type='button'
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
              aria-label='Notificaciones'
            >
              <Bell size={18} color='var(--text-body)' />
              <span
                aria-hidden='true'
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--brand)',
                  border: '1.5px solid var(--surface-card)',
                }}
              />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--kipo-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                E
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)', lineHeight: 1.2 }}>
                  Edgar F.
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.2 }}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 28, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
