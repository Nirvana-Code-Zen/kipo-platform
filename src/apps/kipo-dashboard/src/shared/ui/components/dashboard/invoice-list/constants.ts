import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react'

export const statusStyles: Record<string, { color: string; icon: typeof FileText }> = {
  stamped:   { color: 'bg-emerald-500', icon: CheckCircle2 },
  draft:     { color: 'bg-blue-500',    icon: Clock },
  cancelled: { color: 'bg-red-500',     icon: XCircle },
}

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
