'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { SLIDES, INTERVAL_MS } from './constants'

import type { AuthShellProps } from './types'

export function AuthShell({ children }: AuthShellProps) {
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
      className='min-h-screen flex flex-col md:grid bg-[var(--bg-base)] [grid-template-columns:45fr_55fr]'
    >
      <div className='flex flex-col [padding:clamp(20px,3vw,28px)] [min-height:clamp(240px,40vw,100vh)]'>
        <div className='flex items-center gap-2 flex-shrink-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/kipo-logo.svg'
            alt=''
            aria-hidden='true'
            width={126}
            height={126}
            className='shrink-0'
          />
        </div>

        <div className='relative rounded-2xl overflow-hidden flex-1 mt-5 [min-height:clamp(180px,35vw,600px)]'>
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
            className='absolute inset-x-0 bottom-0 h-[58%] pointer-events-none bg-[linear-gradient(to_top,rgba(10,6,2,0.78)_0%,transparent_100%)]'
            style={{ zIndex: 2 }}
          />

          <div
            className='absolute bottom-0 left-0 right-0 hidden md:flex flex-col [padding:clamp(20px,3vw,28px)] gap-[14px]'
            style={{ zIndex: 3 }}
          >
            <p
              className='font-display font-bold [font-size:clamp(18px,1.8vw,23px)] text-white leading-[1.3] tracking-[-0.02em] m-0'
            >
              {SLIDES[current].tagline[0]}
              <br />
              {SLIDES[current].tagline[1]}
            </p>

            <div role='tablist' aria-label='Diapositivas' className='flex gap-1.5 items-center'>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type='button'
                  role='tab'
                  aria-selected={i === current}
                  aria-label={`Imagen ${i + 1} de ${SLIDES.length}`}
                  onClick={() => goTo(i)}
                  className='h-[6px] rounded-[3px] border-0 cursor-pointer p-0 shrink-0'
                  style={{
                    width: i === current ? 22 : 6,
                    background: i === current ? '#fff' : 'rgba(255,255,255,0.42)',
                    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center px-6 py-12 bg-card'>
        <div className='w-full max-w-[420px]'>
          {children}
        </div>
      </div>
    </div>
  )
}
