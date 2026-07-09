'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sprite from '@/components/Sprite'
import { NAV } from '@/lib/nav'

/** Pionowa nawigacja w sidebarze — jak menu The Binding of Isaac, z aktywną „zakładką". */
export default function SideNav() {
  const pathname = usePathname()
  return (
    <nav className="side-nav">
      {NAV.map((n) => {
        const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)
        return (
          <Link
            key={n.href}
            href={n.href}
            className={'side-link' + (active ? ' active' : '')}
            aria-current={active ? 'page' : undefined}
          >
            <Sprite name={n.icon} size={28} />
            <span>{n.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
