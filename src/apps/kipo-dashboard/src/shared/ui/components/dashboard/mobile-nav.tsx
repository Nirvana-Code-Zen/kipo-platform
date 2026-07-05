'use client'

import { useState } from 'react'

import { List, X } from '@phosphor-icons/react'

import { Sidebar } from './sidebar'

export function MobileNav () {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        aria-label='Abrir menú'
        onClick={() => setOpen(true)}
        className='lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary transition-colors'
      >
        <List size={20} className='text-foreground' />
      </button>

      {open && (
        <>
          <div
            aria-hidden='true'
            onClick={() => setOpen(false)}
            className='fixed inset-0 z-40 bg-black/40'
          />
          <div className='fixed top-0 left-0 bottom-0 w-64 z-50 bg-card shadow-xl'>
            <button
              aria-label='Cerrar menú'
              onClick={() => setOpen(false)}
              className='absolute top-3 right-3 p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground'
            >
              <X size={18} />
            </button>
            <Sidebar />
          </div>
        </>
      )}
    </>
  )
}
