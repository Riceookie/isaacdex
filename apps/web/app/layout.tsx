import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { Inter, Pixelify_Sans } from 'next/font/google'
import ThemeApplier from '@/components/ThemeApplier'
import Ambience from '@/components/Ambience'
import Sprite from '@/components/Sprite'
import SideNav from '@/components/SideNav'
import TopBar from '@/components/TopBar'
import { getCompanionInfo } from '@/lib/queries'
import { mojGracz } from '@/lib/konto'
import { KontoProvider } from '@/components/KontoProvider'

// Upheaval TT (BRK) — font menu The Binding of Isaac (Brian Kent / aenigma, freeware).
const display = localFont({
  src: './fonts/upheaval.ttf',
  variable: '--font-display',
})
// Upheaval nie ma polskich znaków (ł, ą, ę…) — Pixelify Sans (też pixelowy, z latin-ext)
// służy jako fallback per-glif dla diakrytyków w stacku --dsp.
const displayFb = Pixelify_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-display-fb',
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [{ steamConnected }, ja] = await Promise.all([
    getCompanionInfo().catch(() => ({ steamConnected: true })),
    mojGracz().catch(() => null),
  ])
  return (
    <html
      lang="pl"
      data-floor="basement"
      data-theme="dark"
      data-cards="tainted"
      data-fly="off"
      className={`${display.variable} ${displayFb.variable} ${hand.variable}`}
    >
      <body>
        <ThemeApplier />
        <Ambience />
        <KontoProvider zalogowany={ja !== null}>
          <div className="app">
            <aside className="sidebar">
              <Link href="/" className="side-brand">
                <Sprite name="godhead" size={30} />
                <span>IsaacDex</span>
              </Link>
              <SideNav />
            </aside>
            <div className="main-wrap">
              <TopBar steamConnected={steamConnected} nick={ja?.nick ?? null} />
              <main className="container">{children}</main>
            </div>
          </div>
        </KontoProvider>
      </body>
    </html>
  )
}
