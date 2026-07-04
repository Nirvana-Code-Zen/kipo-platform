export type BillingError =
  | { kind: 'InvoiceNotFound'; invoiceId: string }
  | { kind: 'InvoiceAlreadyStamped'; invoiceId: string }
  | { kind: 'InvoiceAlreadyCancelled'; invoiceId: string }
  | { kind: 'NetworkError'; message: string }
  | { kind: 'ServerError'; status: number; message: string }

export const billingError = {
  notFound: (invoiceId: string): BillingError => ({ kind: 'InvoiceNotFound', invoiceId }),
  alreadyStamped: (invoiceId: string): BillingError => ({ kind: 'InvoiceAlreadyStamped', invoiceId }),
  alreadyCancelled: (invoiceId: string): BillingError => ({ kind: 'InvoiceAlreadyCancelled', invoiceId }),
  network: (message: string): BillingError => ({ kind: 'NetworkError', message }),
  server: (status: number, message: string): BillingError => ({ kind: 'ServerError', status, message }),
}
