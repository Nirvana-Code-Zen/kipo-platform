export interface StampCardProps {
  qty?: number
  unitPrice?: number
  label?: string
  featured?: boolean
  selected?: boolean
  onSelect?: (qty: number) => void
  className?: string
}
