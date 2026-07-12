export type StampPackId = 20 | 100 | 500

export const isStampPackId = (value: number): value is StampPackId =>
  value === 20 || value === 100 || value === 500
