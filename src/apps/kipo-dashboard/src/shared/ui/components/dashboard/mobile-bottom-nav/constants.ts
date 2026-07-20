import { LayoutDashboard, Users, WalletCards, Settings } from 'lucide-react'

export const tabs = [
  { label: 'Dashboard',   href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Clientes',    href: '/customers',  icon: Users },
  { label: 'Facturación', href: '/billing',    icon: WalletCards },
  { label: 'Ajustes',     href: '/settings',   icon: Settings },
]
