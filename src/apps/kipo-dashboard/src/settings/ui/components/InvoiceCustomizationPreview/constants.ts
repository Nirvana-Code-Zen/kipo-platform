import type { MockLineItem } from "./types"

export const MOCK_LINE_ITEMS: MockLineItem[] = [
  {
    productKey: "01010101",
    description: "Servicio de consultoría administrativa",
    unitKey: "E48",
    unitLabel: "Unidad de servicio",
    quantity: 1,
    unitPrice: 1500.5,
    iva: 240.08,
    ieps: 0,
  },
  {
    productKey: "43211500",
    description: "Licencia de software anual",
    unitKey: "H87",
    unitLabel: "Pieza",
    quantity: 2,
    unitPrice: 899.25,
    iva: 287.76,
    ieps: 89.93,
  },
  {
    productKey: "81112501",
    description: "Soporte técnico remoto",
    unitKey: "E48",
    unitLabel: "Unidad de servicio",
    quantity: 3,
    unitPrice: 350.0,
    iva: 168.0,
    ieps: 0,
  },
]

export const MOCK_UUID = "3F2A9C1E-7B4D-4E8A-9C2F-1D5E6A7B8C9D"
export const MOCK_SEAL_CFDI =
  "kJ8sX2mQ9pL4vN6rT1wY3zA5bC7dE0fG2hI4jK6lM8nO0pQ2rS4tU6vW8xY0zA2b=="
export const MOCK_SEAL_SAT =
  "aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7aB9cD1eF3gH5iJ7kL9mN1oP3q=="
export const MOCK_CERT_NUMBER = "00001000000504654321"

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}

export function formatUnitPrice(amount: number, roundUnitPrice: boolean): string {
  return amount.toFixed(roundUnitPrice ? 2 : 4)
}
