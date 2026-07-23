export const VOUCHER_TYPE_LABEL: Record<string, string> = {
  I: "Ingreso",
  E: "Egreso",
  T: "Traslado",
  N: "Nómina",
  P: "Pago",
}

export const INVOICE_STATUS_TONE = {
  draft: "neutral",
  stamped: "success",
  cancelled: "danger",
} as const

export const INVOICE_STATUS_LABEL = {
  draft: "Borrador",
  stamped: "Timbrada",
  cancelled: "Cancelada",
} as const

export const formatMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)

export const ROW_STAGGER = [
  '[animation-delay:0ms]',
  '[animation-delay:60ms]',
  '[animation-delay:120ms]',
  '[animation-delay:180ms]',
  '[animation-delay:240ms]',
  '[animation-delay:300ms]',
  '[animation-delay:360ms]',
  '[animation-delay:420ms]',
  '[animation-delay:480ms]',
  '[animation-delay:540ms]',
] as const
