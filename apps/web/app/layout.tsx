import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'IsaacDex',
  description: 'Companion do The Binding of Isaac — postęp, completion marks, doradca itemów.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <header className="nav">
          <Link href="/" className="brand">
            🪽 IsaacDex
          </Link>
          <nav className="nav-links">
            <Link href="/">Dashboard</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
