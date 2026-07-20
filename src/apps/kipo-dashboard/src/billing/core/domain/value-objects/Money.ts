export const roundSat = (value: number, decimals = 6): number => {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export const calcImporte = (quantity: number, unitPrice: number): number =>
  roundSat(quantity * unitPrice)

export const calcImpuesto = (base: number, rate: number): number =>
  roundSat(base * rate)

export const calcSubtotal = (amounts: number[]): number =>
  roundSat(amounts.reduce((acc, i) => acc + i, 0))

export const calcTotal = (
  subtotal: number,
  transferred: number,
  withheld: number
): number => roundSat(subtotal + transferred - withheld)
