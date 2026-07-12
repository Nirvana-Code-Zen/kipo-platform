export type StampPackError =
  | { kind: 'PackNotFound'; packId: number }
  | { kind: 'NetworkError'; message: string }
  | { kind: 'ServerError'; status: number; message: string }

export const stampPackError = {
  notFound: (packId: number): StampPackError => ({ kind: 'PackNotFound', packId }),
  network: (message: string): StampPackError => ({ kind: 'NetworkError', message }),
  server: (status: number, message: string): StampPackError => ({ kind: 'ServerError', status, message }),
}
