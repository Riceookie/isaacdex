'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { CSSProperties } from 'react'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
import { NAV } from '@/lib/nav'

/** Pionowa nawigacja w sidebarze — jak menu The Binding of Isaac, z aktywną „zakładką". */
export default function SideNav() {
  const pathname = usePathname()
  const t = useT()
  return (
    <nav className="side-nav">
      {NAV.map((n) => {
        const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)
        return (
          <Link
            key={n.href}
            href={n.href}
            className={'side-link' + (active ? ' active' : '') + (n.accent ? ' has-accent' : '')}
            aria-current={active ? 'page' : undefined}
            style={n.accent ? ({ '--nav-accent': n.accent } as CSSProperties) : undefined}
          >
            <Sprite name={n.icon} size={28} />
            <span>{t(n.klucz)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
