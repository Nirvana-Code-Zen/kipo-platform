"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "../../../lib/utils"
import { tabs } from "./constants"

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border [padding-bottom:env(safe-area-inset-bottom)]">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
