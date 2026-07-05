export function useMaturities(){
  const MATURITIES = [
    { title: 'Declaración IVA julio 2026',  sub: 'SAT — Persona Moral',      days: 3,  urgent: true },
    { title: 'Pago provisional ISR',        sub: 'SAT — Persona Física',     days: 8,  urgent: false },
    { title: 'Factura cliente Hernández',   sub: 'CFDI pendiente de cobro',  days: 14, urgent: false },
  ]

  return { maturities: MATURITIES}
}