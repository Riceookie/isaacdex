import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Pixelify_Sans, Inter } from 'next/font/google'
import ThemeApplier from '@/components/ThemeApplier'

const display = Pixelify_Sans({
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
      data-fly="off"
      className={`${display.variable} ${hand.variable}`}
    >
      <body>
        <ThemeApplier />
        <div className="surface">
          <header className="nav">
            <Link href="/" className="brand">
              🪽 IsaacDex
            </Link>
            <div className="nav-right">
              <nav className="nav-links">
                <Link href="/">Pulpit</Link>
                <Link href="/profil">Profil</Link>
                <Link href="/kolekcja">Kolekcja</Link>
                <Link href="/doradca">Doradca</Link>
                <Link href="/statystyki">Statystyki</Link>
                <Link href="/ustawienia" aria-label="Ustawienia">
                  ⚙
                </Link>
              </nav>
            </div>
          </header>
          <main className="container">{children}</main>
        </div>
      </body>
    </html>
  )
}
