# Kipo Platform — Guía para Claude

## Stack

- **Monorepo**: pnpm workspaces
- **Dashboard app**: `src/apps/kipo-dashboard` — Next.js App Router, `"use client"` explícito
- **UI package**: `src/packages/ui-react` — design system propio (`@kipo/ui-react`)
- **Styling**: Tailwind + CSS variables del design system (`var(--brand)`, `var(--surface-card)`, etc.)
- **Icons**: `lucide-react` (ya instalado; no agregar otras librerías de iconos)
- **Estado global**: ninguno por ahora — todo es estado local con hooks

---

## Arquitectura de dominios

Cada dominio sigue esta estructura (ejemplo: `customers`, `billing`):

```
src/<dominio>/
  core/
    application/
      dtos/          ← DTOs de entrada/salida hacia el API
      use-cases/     ← Casos de uso (lógica de aplicación)
    domain/
      entities/      ← Entidades de dominio (inmutables, tipadas)
      value-objects/ ← Branded types con validación (Email, TaxId, etc.)
      repositories/  ← Interfaces IXxxRepository
      exceptions/    ← Errores de dominio tipados
    infrastructure/
      mappers/       ← Transforman respuesta del API → entidad de dominio
      repositories/  ← Implementaciones HTTP de los repositorios
  ui/
    components/      ← Componentes React del dominio
    hooks/           ← Custom hooks (ver reglas abajo)
    data/            ← Datos estáticos, catálogos, mocks (NO hooks)
    views/           ← Vistas completas que se montan en las rutas
```

---

## Reglas de custom hooks

### Responsabilidad única

Cada hook tiene **una sola responsabilidad** claramente nombrada en su nombre.

| Nombre | Qué hace |
|---|---|
| `useXxxList` | Solo el estado de la lista: `items[]`, `isLoading`, `selectedItem` |
| `useAddXxx` | Solo la función para agregar un elemento a la lista |
| `useDeleteXxx` | Solo la función para eliminar un elemento |
| `useCancelXxx` | Solo la función para cancelar/cambiar estado a cancelled |
| `useXxxForm` | Todo el estado del formulario: campos, validación, `buildXxx()` |
| `useXxxSearch` | Lógica de búsqueda/filtrado para un tipo de dato |

### Lo que NO debe estar en `useXxxList`

`useInvoiceList` solo gestiona la lista y el estado de carga. Las mutaciones viven en sus propios hooks:

```ts
// MAL — todo en un hook grande
export function useInvoiceList() {
  const addInvoice = ...    // no aquí
  const cancelInvoice = ... // no aquí
  const deleteInvoice = ... // no aquí
}

// BIEN — separado por responsabilidad
export function useInvoiceList()    { /* solo lista + isLoading */ }
export function useAddInvoice()     { /* solo agregar */ }
export function useCancelInvoice()  { /* solo cancelar */ }
export function useDeleteInvoice()  { /* solo eliminar */ }
```

### Composición en el orquestador

Los hooks individuales se componen en el componente orquestador del dominio:

```tsx
// invoices.tsx — orquestador
const { invoices, setInvoices, isLoading, selectedInvoice, setSelectedInvoice } = useInvoiceList()
const addInvoice    = useAddInvoice(setInvoices)
const cancelInvoice = useCancelInvoice(setInvoices)
const deleteInvoice = useDeleteInvoice(setInvoices)
```

### Catálogos y datos estáticos

Los catálogos SAT (régimenes fiscales, formas de pago, tipos de comprobante, etc.) y los datos mock **no son hooks**. Van en `ui/data/catalogs.ts`, no en `ui/hooks/`.

```
ui/data/catalogs.ts   ← CORRECTO
ui/hooks/catalogs.ts  ← MAL — no es un hook
```

---

## Patrones de UI

### Separación de componentes

Cada componente vive en su propia subcarpeta con `index.tsx` como punto de entrada. El componente orquestador (`invoices/`, `customers/`) importa los componentes hijos y compone los hooks.

```
ui/components/
  InvoiceRow/
    index.tsx            ← SOLO JSX del componente
    types.ts             ← interface InvoiceRowProps (props del componente)
  InvoiceDetailSheet/
    index.tsx
    types.ts             ← interface InvoiceDetailSheetProps
    constants.ts         ← VOUCHER_TYPE_LABEL, STATUS_LABEL, STATUS_TONE, formatMXN
  CreateInvoiceForm/
    index.tsx
    types.ts             ← CreateInvoiceFormProps, ReceiverSearchProps, etc.
    constants.ts         ← formatMXN, resolveUnitLabel, arrays de configuración
  invoices/
    index.tsx            ← Orquestador: usa hooks + renderiza componentes hijos
  shared/
    types.ts             ← Tipos UI del dominio: UIInvoice, UIInvoiceConcept, InvoiceStatus
```

### Reglas de estructura interna de componentes

**`index.tsx`** — solo JSX. Sin interfaces ni constantes no-triviales definidas dentro del archivo.

**`types.ts`** — interfaces de props y tipos locales del componente. Crear si hay ≥ 1 interface.

**`constants.ts`** — arrays de config, objetos de mapeo (labels, colores por estado), helpers puros sin estado. Crear si hay ≥ 1 constante no-trivial.

**`components/shared/`** — archivos `.ts` que aplican a todo el dominio (tipos UI, utilidades compartidas). Los `types.ts` que antes vivían en la raíz de `components/` van aquí.

```
// MAL — interface y constante dentro del TSX
export function InvoiceDetailSheet({ invoice }: Props) {
  const STATUS_LABEL = { active: 'Activa', cancelled: 'Cancelada' }
  interface Props { invoice: UIInvoice }
  return <div>...</div>
}

// BIEN — separado en archivos hermanos
// types.ts     → interface InvoiceDetailSheetProps { invoice: UIInvoice }
// constants.ts → export const STATUS_LABEL = { active: 'Activa', cancelled: 'Cancelada' }
// index.tsx    → import { InvoiceDetailSheetProps } from './types'
//                import { STATUS_LABEL } from './constants'
```

Excepción: una constante simple (un string, un regex corto) puede quedarse en `index.tsx`.

### Tipo UI vs entidad de dominio

El tipo UI (`types.ts`) es plano y orientado a mostrar datos. Es diferente de la entidad de dominio (`core/domain/entities/`).

```ts
// types.ts — UI: plano, strings para display
export interface UIInvoice {
  id: string
  folio: string
  status: InvoiceStatus
  issuedAt: string  // fecha ya formateada
  receiverName: string
  total: number
}

// Invoice.ts — dominio: inmutable, value objects, lógica
export type Invoice = Readonly<{
  id: InvoiceId
  issuedAt: Date
  receiverId: ReceiverId
  items: readonly InvoiceConcept[]
}>
```

### Sheets y portales

Todos los modales y bottom sheets usan `createPortal(…, document.body)`. El componente `XxxSheet` recibe `isOpen` o el dato a mostrar como prop y retorna `null` si no aplica.

### forwardRef para comunicación padre → lista

Cuando el dashboard padre necesita agregar un item a la lista (después de crear desde el sheet), se usa `forwardRef` + `useImperativeHandle`:

```tsx
// views/BillingDashboard.tsx
const invoicesRef = useRef<InvoicesHandle>(null)
// ...
invoicesRef.current?.addInvoice(newInvoice)

// components/invoices/index.tsx
export const Invoices = forwardRef<InvoicesHandle>(function Invoices(_, ref) {
  const addInvoice = useAddInvoice(setInvoices)
  useImperativeHandle(ref, () => ({ addInvoice }))
})
```

### Skeleton loaders

Cada dominio tiene su skeleton que replica la forma visual del componente real. Viven en `src/shared/ui/components/dashboard/skeletons.tsx`. El hook `useXxxList` arranca con `isLoading: true` y lo resuelve en 1200ms (simulando fetch); se reemplaza por el estado real del API cuando esté disponible.

---

## Convenciones generales

- `"use client"` explícito en todo componente o hook que use estado/efectos
- No agregar comentarios que expliquen qué hace el código — los nombres de funciones y variables deben ser suficientemente claros
- No crear abstracciones prematuras: tres archivos similares están bien antes de generalizar
- **UI nueva: solo clases de Tailwind, nada de `style={{ ... }}`.** Esto incluye colores y tokens del design system, no solo layout/spacing — no hardcodear colores.
- Los tokens del design system están mapeados como clases de Tailwind en `src/apps/kipo-dashboard/app/globals.css` (bloque `@theme inline`): `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `text-destructive`, `border-input`, `border-border-subtle`, `border-border-strong`, `rounded-md`/`rounded-sm`/`rounded-lg`, `font-sans`, `font-mono`, `shadow-lg`, etc. Usa esas clases en vez de `var(--...)` inline.
- Para tamaños que no calzan en la escala de Tailwind (ej. `13px`, `11px`) usa valores arbitrarios (`text-[13px]`) en vez de `style=`.
- Para hover/focus usa pseudo-clases de Tailwind (`hover:bg-muted`) en vez de `onMouseEnter`/`onMouseLeave` manipulando `style` por JS.
- Código legado (`StyledSelect`, `ReceiverSearch`, el propio `Input` de `@kipo/ui-react`, etc.) todavía usa `style={{ }}` con `var(--...)` — no es el patrón a seguir en componentes nuevos; no migrarlo salvo que se pida explícitamente.
