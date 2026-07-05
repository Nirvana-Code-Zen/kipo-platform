'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import type { ReactNode } from 'react'

type AuthShellProps = {
  children: ReactNode
}

// Curated Unsplash photos: entrepreneurs, freelancers, invoicing/work context
const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Empresaria gestionando su negocio',
    tagline: ['Factura más rápido,', 'crece más seguro.'],
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=950&fit=crop&q=80',
    alt: 'Freelancer revisando sus finanzas y facturas',
    tagline: ['Todo tu SAT', 'en un solo lugar.'],
  },
  {
    src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=700&h=950&fit=crop&q=80',
    alt: 'Emprendedor emitiendo comprobantes fiscales',
    tagline: ['CFDIs en segundos,', 'no en horas.'],
  },
]

const INTERVAL_MS = 5000

export function AuthShell ({ children }: AuthShellProps) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, INTERVAL_MS)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  const goTo = (i: number) => {
    setCurrent(i)
    startTimer()
  }

  return (
    <div
      className='min-h-screen flex flex-col md:grid'
      style={{
        gridTemplateColumns: '45fr 55fr',
        background: 'var(--bg-base)',
      }}
    >
      <div
        className='flex flex-col'
        style={{
          padding: 'clamp(20px, 3vw, 28px)',
          minHeight: 'clamp(240px, 40vw, 100vh)',
        }}
      >
        <div className='flex items-center gap-2 flex-shrink-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/kipo-logo.svg'
            alt=''
            aria-hidden='true'
            width={126}
            height={126}
            style={{ flexShrink: 0 }}
          />
        </div>

        <div
          className='relative rounded-2xl overflow-hidden flex-1 mt-5'
          style={{ minHeight: 'clamp(180px, 35vw, 600px)' }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className='absolute inset-0'
              aria-hidden={i !== current}
              style={{
                opacity: i === current ? 1 : 0,
                transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: i === current ? 1 : 0,
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes='(max-width: 768px) 100vw, 45vw'
                className='object-cover'
                priority={i === 0}
              />
            </div>
          ))}

          <div
            aria-hidden='true'
            className='absolute inset-x-0 bottom-0'
            style={{
              zIndex: 2,
              height: '58%',
              background: 'linear-gradient(to top, rgba(10, 6, 2, 0.78) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          <div
            className='absolute bottom-0 left-0 right-0 hidden md:flex flex-col'
            style={{ zIndex: 3, padding: 'clamp(20px, 3vw, 28px)', gap: 14 }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(18px, 1.8vw, 23px)',
                color: '#fff',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {SLIDES[current].tagline[0]}
              <br />
              {SLIDES[current].tagline[1]}
            </p>

            <div role='tablist' aria-label='Diapositivas' style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type='button'
                  role='tab'
                  aria-selected={i === current}
                  aria-label={`Imagen ${i + 1} de ${SLIDES.length}`}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === current ? 22 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === current ? '#fff' : 'rgba(255,255,255,0.42)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className='flex items-center justify-center px-6 py-12'
        style={{ background: 'var(--surface-card)' }}
      >
        <div className='w-full' style={{ maxWidth: 420 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
