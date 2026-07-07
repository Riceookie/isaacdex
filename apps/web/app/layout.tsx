import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Space_Grotesk, Inter } from 'next/font/google'
import FloorSwitcher from '@/components/FloorSwitcher'

const display = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})
const hand = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata = {
  title: 'IsaacDex',
  description: 'Companion do The Binding of Isaac — postęp, completion marks, doradca itemów.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pl"
      data-floor="basement"
      data-fly="on"
      className={`${display.variable} ${hand.variable}`}
    >
      <body>
        <div className="surface">
          <header className="nav">
            <Link href="/" className="brand">
              🪽 IsaacDex
            </Link>
            <div className="nav-right">
              <nav className="nav-links">
                <Link href="/">Postęp</Link>
                <Link href="/profil">Profil</Link>
                <Link href="/kolekcja">Kolekcja</Link>
                <Link href="/statystyki">Statystyki</Link>
              </nav>
              <FloorSwitcher />
            </div>
          </header>
          <main className="container">{children}</main>
        </div>
      </body>
    </html>
  )
}
