
import { Analytics } from "@vercel/analytics/next"

import type { Metadata } from 'next'

import "./globals.css"

export const metadata: Metadata = {
  title: 'Kipo — Facturación electrónica para México',
  description: 'Emite CFDIs, gestiona clientes y cumple con el SAT desde un solo lugar.'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-theme="light">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
