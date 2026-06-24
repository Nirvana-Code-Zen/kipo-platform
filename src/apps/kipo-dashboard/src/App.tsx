import { Button, Input, Badge } from '@kipo/ui-react'

export function App() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-12">
        <h1 className="font-plus-jakarta text-4xl font-bold text-brand-secondary">
          Kipo <span className="text-brand-primary">App</span>
        </h1>
        <p className="mt-2 font-inter text-brand-secondary/60">
          Tu plataforma financiera
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="font-plus-jakarta text-2xl font-semibold text-brand-secondary">
          Componentes
        </h2>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Pagar</Button>
          <Button variant="secondary">Ver detalle</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="primary" isLoading>Procesando</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">Pendiente</Badge>
          <Badge variant="secondary">Aprobado</Badge>
          <Badge variant="mono">RFC-001</Badge>
          <Badge>Neutral</Badge>
        </div>

        <div className="max-w-sm space-y-4">
          <Input label="RFC" placeholder="XAXX010101000" />
          <Input label="Concepto" placeholder="Servicio de consultoría" />
          <Input label="Total" placeholder="$0.00" error="Campo requerido" />
        </div>
      </section>

      <section className="rounded-lg bg-neutral-base p-6">
        <h3 className="font-geist-mono font-medium text-brand-secondary">
          RFC-2024-001
        </h3>
        <p className="mt-1 font-geist-mono text-sm text-brand-secondary/60">
          Monto total: $12,500.00 MXN
        </p>
      </section>
    </div>
  )
}
