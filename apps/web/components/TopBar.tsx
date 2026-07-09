'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sprite from '@/components/Sprite'
import CompanionMascot from '@/components/Companion'
import { tytulSekcji } from '@/lib/nav'

/** Górny pasek: papierowa „zakładka" z tytułem sekcji + companion + ikony narzędziowe. */
export default function TopBar({ nick }: { nick: string }) {
  const pathname = usePathname()
  const tytul = tytulSekcji(pathname)

  return (
    <div className="topbar">
      <div className="page-tab">
        <span className="page-tab-plus">+</span>
        {tytul}
      </div>

      <CompanionMascot nick={nick} />

      <div className="util">
        <span className="util-icon deco" aria-hidden="true" title="Poczta">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="1.5" />
            <path d="M3.5 6l8.5 6 8.5-6" strokeLinecap="round" />
          </svg>
        </span>
        <Link href="/czat" className="util-icon" aria-label="Czat" title="Czat">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          >
            <path d="M4 5h16v11H9l-4 3v-3H4z" strokeLinecap="round" />
          </svg>
        </Link>
        <span className="util-icon deco" aria-hidden="true" title="Powiadomienia">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          >
            <path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" strokeLinecap="round" />
            <path d="M10 20a2 2 0 004 0" strokeLinecap="round" />
          </svg>
        </span>

        <Link href="/profil" className="avatar-chip">
          <Sprite name="isaacHead" size={24} />
          <span>Profil</span>
        </Link>
      </div>
    </div>
  )
}
