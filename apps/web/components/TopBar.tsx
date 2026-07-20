'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sprite from '@/components/Sprite'
import CompanionMascot from '@/components/Companion'
import NotificationsBell from '@/components/NotificationsBell'
import { useT } from '@/components/JezykProvider'
import { tytulSekcji } from '@/lib/nav'
import { wyloguj } from '@/app/actions/auth'

/**
 * Górny pasek: papierowa „zakładka" z tytułem sekcji + companion + ikony narzędziowe.
 *
 * `nick` mówi, kto jest zalogowany (null = gość). Gość widzi apkę, ale zamiast swojego
 * profilu ma zaproszenie do logowania — bez tego klikałby w „Obserwuj" i nic by się nie działo.
 */
export default function TopBar({
  steamConnected,
  nick,
}: {
  steamConnected: boolean
  nick: string | null
}) {
  const pathname = usePathname()
  const t = useT()
  const tytul = t(tytulSekcji(pathname))

  return (
    <div className="topbar">
      <div className="page-tab">
        <span className="page-tab-plus">+</span>
        {tytul}
      </div>

      <CompanionMascot steamConnected={steamConnected} zalogowany={!!nick} />

      <div className="util">
        <Link
          href="/czat"
          className="util-icon"
          aria-label={t('wspolne.navCzat')}
          title={t('wspolne.navCzat')}
        >
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

        {nick ? (
          <>
            <Link href="/profil" className="avatar-chip">
              <Sprite name="isaacHead" size={24} />
              <span>{nick}</span>
            </Link>
            <form action={wyloguj}>
              <button
                className="util-icon"
                type="submit"
                aria-label={t('nawigacja.wyloguj')}
                title={t('nawigacja.wyloguj')}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4" />
                  <path d="M15 12H10M18 12l-3-3M18 12l-3 3" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <Link href="/logowanie" className="avatar-chip">
            <Sprite name="isaacHead" size={24} />
            <span>{t('wspolne.zaloguj')}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
