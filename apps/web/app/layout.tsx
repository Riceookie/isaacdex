import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Caveat, Patrick_Hand } from 'next/font/google'
import FloorSwitcher from '@/components/FloorSwitcher'

const display = Caveat({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  variable: '--font-display',
})
const hand = Patrick_Hand({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-hand',
})

export const metadata = {
  title: 'IsaacDex',
  description: 'Companion do The Binding of Isaac — postęp, completion marks, doradca itemów.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" data-floor="basement" className={`${display.variable} ${hand.variable}`}>
      <body>
        <div className="surface">
          <header className="nav">
            <Link href="/" className="brand">
              🪽 IsaacDex
            </Link>
            <div className="nav-right">
              <nav className="nav-links">
                <Link href="/">Postęp</Link>
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
