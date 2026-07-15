import type { UIUpgradeOption } from '../components/types'

export const UPGRADE_OPTIONS: readonly UIUpgradeOption[] = [
  {
    tier: 'emprendedor',
    name: 'Emprendedor',
    priceLabel: '$299 MXN/mes',
    description: 'Para freelancers y negocios que facturan seguido.',
    highlights: [
      'Escaneo de Constancia de Situación Fiscal con OCR',
      'Alerta si un cliente aparece en la lista EFOS/EDOS del SAT',
      'Facturas recurrentes automáticas',
      'Historial completo con búsqueda avanzada',
    ],
  },
  {
    tier: 'pyme',
    name: 'PyME',
    priceLabel: '$599 MXN/mes',
    description: 'Para negocios con equipo y operación contable compleja.',
    highlights: [
      'Todo lo de Emprendedor',
      'Hasta 3 usuarios con roles y permisos',
      'REP automático y notas de crédito relacionadas',
      'Reporte pre-DIOT y dashboard de IVA',
    ],
  },
]
