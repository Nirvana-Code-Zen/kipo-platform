export function capitalizeWords(value: string): string {
  return value.replace(/(^|\s)(\p{L})/gu, (_, boundary, letter) => boundary + letter.toUpperCase())
}
