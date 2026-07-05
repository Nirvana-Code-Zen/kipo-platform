'use client'

import React from 'react'

import { MobileBottomNav } from "../components/dashboard/mobile-bottom-nav"
import { Sidebar } from "../components/dashboard/sidebar"

export function DashboardShell ({ children }: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-3 md:p-4 lg:p-5 lg:ml-64 pb-24 lg:pb-5">
        {children}
      </main>

      <MobileBottomNav />
    </div>
  )
}
