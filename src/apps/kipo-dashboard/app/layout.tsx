import { Analytics } from "@vercel/analytics/next"

import { AuthSessionManager } from "@/src/auth/ui/components/AuthSessionManager"
import { PwaInstaller } from "@/src/shared/ui/components/PwaInstaller"
import { QueryProvider } from "@/src/shared/ui/providers/QueryProvider"

import type { Metadata, Viewport } from 'next'

import "./globals.css"

export const metadata: Metadata = {
  title: 'Kipo — Facturación electrónica para México',
  description: 'Emite CFDIs, gestiona clientes y cumple con el SAT desde un solo lugar.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kipo',
  },
}

export const viewport: Viewport = {
  themeColor: '#032641',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-theme="light">
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        <AuthSessionManager />
        <PwaInstaller />
        <Analytics />
      </body>
    </html>
  )
}
