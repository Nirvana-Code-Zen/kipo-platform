'use client'

import { Card } from '@kipo/ui-react'
import { ExternalLink, Mail, MessageCircle } from 'lucide-react'

import { Header } from '@/src/shared/ui/components/dashboard/header'

const articles = [
  { title: '¿Cómo emitir mi primer CFDI?', href: '#' },
  { title: 'Configurar mi RFC y datos fiscales', href: '#' },
  { title: 'Cancelar una factura en el SAT', href: '#' },
  { title: 'Diferencia entre CFDI 4.0 y versiones anteriores', href: '#' },
  { title: 'Cómo usar el portal del SAT', href: 'https://www.sat.gob.mx' },
]

export default function HelpPage() {
  return (
    <>
      <Header title="Ayuda" description="Encuentra respuestas y contacta a nuestro equipo." />

      <div className="mt-4 md:mt-5 max-w-2xl space-y-4">
        <Card className="divide-y divide-border overflow-hidden p-0">
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Artículos frecuentes</p>
          </div>
          {articles.map((a) => (
            <a
              key={a.title}
              href={a.href}
              target={a.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-secondary transition-colors group"
            >
              <span className="flex-1 text-sm text-foreground">{a.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </Card>

        <Card className="divide-y divide-border overflow-hidden p-0">
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contacto</p>
          </div>
          <a
            href="mailto:soporte@kipo.com.mx"
            className="flex items-center gap-3 px-5 py-4 hover:bg-secondary transition-colors"
          >
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Correo electrónico</p>
              <p className="text-xs text-muted-foreground">soporte@kipo.com.mx</p>
            </div>
          </a>
          <a
            href="https://wa.me/521XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-4 hover:bg-secondary transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Lunes a viernes, 9am - 6pm</p>
            </div>
          </a>
        </Card>
      </div>
    </>
  )
}
