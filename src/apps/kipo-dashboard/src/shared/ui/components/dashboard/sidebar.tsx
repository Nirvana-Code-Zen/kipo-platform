"use client"

import { useState } from "react"

import {
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  WalletCards
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { useStampedInvoiceCount } from "@/src/billing/ui/hooks/useStampedInvoiceCount"
import { useAuthStore } from "@/src/auth/ui/store/authStore"

import { cn } from "../../lib/utils"

const menuItems = [
  { label: 'Dashboard',   href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Facturación', href: '/billing',    icon: WalletCards },
  { label: 'Clientes',    href: '/customers',  icon: Users },
]

const generalItems = [
  { icon: Settings, label: "Ajustes", href: "/settings" },
  { icon: HelpCircle, label: "Ayuda", href: "/help" },
  { icon: LogOut, label: "Logout", href: "/logout" },
]

export function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()
  const { draft: draftCount } = useStampedInvoiceCount()
  const tenantName = useAuthStore((s) => s.persistedSession?.tenantName ?? null)

  return (
    <aside className="fixed top-0 left-0 w-64 bg-card border-r border-border p-4 h-screen overflow-y-auto lg:block">
      <div className="flex items-center gap-2 mb-6 group cursor-pointer">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/kipo-logo.svg"
            width={20}
            height={20}
            alt="Kipo"
            className="h-10 w-10 transition-transform group-hover:scale-110 duration-300"
          />
          <span className="text-lg font-semibold text-foreground">{tenantName ?? 'Kipo'}</span>
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">Menu</p>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    hoveredItem === item.label && !isActive && "translate-x-1",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                  {item.href === '/billing' && draftCount !== null && draftCount > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {draftCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">General</p>
          <nav className="space-y-0.5">
            {generalItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    hoveredItem === item.label && !isActive && "translate-x-1",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
