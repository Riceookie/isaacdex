'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sprite from '@/components/Sprite'
import CompanionMascot from '@/components/Companion'
import NotificationsBell from '@/components/NotificationsBell'
import { tytulSekcji } from '@/lib/nav'

/** Górny pasek: papierowa „zakładka" z tytułem sekcji + companion + ikony narzędziowe. */
export default function TopBar({ steamConnected }: { steamConnected: boolean }) {
  const pathname = usePathname()
  const tytul = tytulSekcji(pathname)

  return (
    <div className="topbar">
      <div className="page-tab">
        <span className="page-tab-plus">+</span>
        {tytul}
      </div>

      <CompanionMascot steamConnected={steamConnected} />

      <div className="util">
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
        <NotificationsBell />

        <Link href="/profil" className="avatar-chip">
          <Sprite name="isaacHead" size={24} />
          <span>Profil</span>
        </Link>
      </div>
    </div>
  )
}
