"use client"

import { useState, useEffect } from "react"

import { Card, Button } from "@kipo/ui-react"

function getTargetDate(): Date {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), 17, 23, 59, 59)
  if (now >= target) {
    target.setMonth(target.getMonth() + 1)
  }
  return target
}

export function DeclarationCountdown() {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function tick() {
      const now = new Date()
      const diff = Math.max(0, getTargetDate().getTime() - now.getTime())
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setRemaining({ days, hours, minutes, seconds })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <Card
      className="bg-foreground text-background p-4 transition-all duration-500 hover:shadow-2xl animate-slide-in-up overflow-hidden relative group"
      style={{ animationDelay: "1000ms", background: "var(--color-foreground)", color: "var(--color-background)" }}
    >
      <div className="absolute top-0 right-0 w-48 h-full opacity-15">
        {[...Array(6)].map((_, i) => (
          <svg
            key={i}
            className="absolute"
            style={{ top: `${i * 50}px`, right: `-${i * 10}px`, width: "150px", height: "80px" }}
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
          >
            <path
              d="M0,25 Q12.5,10 25,25 T50,25 T75,25 T100,25"
              fill="none"
              stroke="#2d6a9f"
              strokeWidth="2"
            />
          </svg>
        ))}
      </div>

      <div className="relative z-10">
        <h2 className="text-lg font-semibold mb-1">Límite declaración</h2>
        <p className="text-xs opacity-60 mb-4">Declaración mensual SAT — día 17</p>
        <div className="text-4xl sm:text-5xl font-mono font-bold mb-1 tracking-tight">
          {remaining.days}d {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
        </div>
        <p className="text-xs opacity-50 mb-4">días restantes</p>
        <Button
          size="md"
          className="bg-background text-foreground hover:bg-background/90 transition-all duration-300 hover:scale-105"
        >
          Ver declaración
        </Button>
      </div>
    </Card>
  )
}
