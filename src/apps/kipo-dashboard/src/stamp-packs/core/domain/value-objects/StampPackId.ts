export type StampPackId = 25 | 100 | 200

export const isStampPackId = (value: number): value is StampPackId =>
  value === 25 || value === 100 || value === 200
