import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PraxisNova AI - Content-Pipeline',
  description: 'Ein Text rein, 5 Formate raus. KI-gesteuerte Content-Erstellung fuer LinkedIn, Facebook, Newsletter und mehr.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-brand-bg">{children}</body>
    </html>
  )
}
