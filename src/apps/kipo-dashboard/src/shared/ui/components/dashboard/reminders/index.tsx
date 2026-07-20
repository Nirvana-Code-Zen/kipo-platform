"use client"

import { Button, Card } from "@kipo/ui-react"
import { CalendarCheck } from "lucide-react"

import { useDeclarationDeadline } from "@/src/shared/ui/hooks/useDeclarationDeadline"

export function Reminders() {
  const { deadline, hasProrroga, extraBusinessDays } = useDeclarationDeadline()
  const formattedDeadline = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(deadline)

  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
      style={{ animationDelay: "500ms" }}
    >
      <h2 className="text-xl font-semibold text-foreground mb-6">Recordatorios</h2>
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <h3 className="font-semibold text-foreground mb-1">Declaración mensual SAT</h3>
          <p className="text-sm text-muted-foreground mb-1">Vence el {formattedDeadline}</p>
          {hasProrroga && (
            <p className="text-xs text-muted-foreground mb-4">
              +{extraBusinessDays} día{extraBusinessDays === 1 ? "" : "s"} hábil{extraBusinessDays === 1 ? "" : "es"} de prórroga según tu RFC
            </p>
          )}
          {!hasProrroga && <div className="mb-4" />}
          <a href="https://www.sat.gob.mx/minisitio/DeclaracionAnual/index.html" target="_new">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30">
              <CalendarCheck className="w-4 h-4 mr-2" />
              Ir al portal SAT
            </Button>
          </a>
        </div>
      </div>
    </Card>
  )
}
