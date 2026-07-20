import { LayoutDashboard, Users, Settings, HelpCircle, LogOut, WalletCards } from 'lucide-react'

export const menuItems = [
  { label: 'Dashboard',   href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Facturación', href: '/billing',    icon: WalletCards },
  { label: 'Clientes',    href: '/customers',  icon: Users },
]

export const generalItems = [
  { icon: Settings,   label: 'Ajustes', href: '/settings' },
  { icon: HelpCircle, label: 'Ayuda',   href: '/help' },
  { icon: LogOut,     label: 'Logout',  href: '/logout' },
]
