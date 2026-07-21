'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sprite from '@/components/Sprite'
import SideNav from '@/components/SideNav'
import { useT } from '@/components/JezykProvider'

/**
 * Nawigacja boczna.
 *
 * Na desktopie to zwykły sidebar (jak dotąd). Na wąskim ekranie zjeżdżał NAD treść i zjadał
 * pół pierwszego ekranu, zanim cokolwiek było widać — więc tam chowa się w szufladzie
 * wysuwanej z lewej, a zostaje po nim tylko ☰ w lewym górnym rogu.
 *
 * Cały stan jest tutaj (a nie w layoutcie), bo layout jest komponentem serwerowym.
 */
export default function Sidebar() {
  const [otwarte, setOtwarte] = useState(false)
  const pathname = usePathname()
  const t = useT()

  // Wejście na inną stronę zamyka szufladę — inaczej zasłaniałaby to, co właśnie wybrałeś.
  useEffect(() => setOtwarte(false), [pathname])

  // Samo `pathname` nie wystarcza: tapnięcie w pozycję AKTUALNEJ strony nie zmienia ścieżki,
  // więc efekt wyżej się nie odpala i szuflada zostawała otwarta — wyglądało to na zawieszony
  // klik. Dlatego każdy link w szufladzie dodatkowo zamyka ją wprost.
  const zamknij = () => setOtwarte(false)

  // Otwarta szuflada zasłania stronę, więc Escape musi ją zamykać; scroll pod spodem blokujemy,
  // żeby przewijanie nie uciekało treści za nakładkę.
  useEffect(() => {
    if (!otwarte) return
    const naKlawisz = (e: KeyboardEvent) => e.key === 'Escape' && setOtwarte(false)
    document.addEventListener('keydown', naKlawisz)
    document.body.classList.add('bez-scrolla')
    return () => {
      document.removeEventListener('keydown', naKlawisz)
      document.body.classList.remove('bez-scrolla')
    }
  }, [otwarte])

  return (
    <>
      <button
        className="ham"
        onClick={() => setOtwarte((v) => !v)}
        aria-label={t(otwarte ? 'nawigacja.zamknijMenu' : 'nawigacja.otworzMenu')}
        aria-expanded={otwarte}
        aria-controls="sidebar"
      >
        {/* Trzy kreski rysowane divami, nie glifem „☰" — font display (Upheaval) go nie ma. */}
        <span className={'ham-kreski' + (otwarte ? ' x' : '')} aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </button>

      {otwarte && <div className="sidebar-cien" onClick={() => setOtwarte(false)} aria-hidden />}

      <aside id="sidebar" className={'sidebar' + (otwarte ? ' otwarty' : '')}>
        <Link href="/" className="side-brand" onClick={zamknij}>
          <Sprite name="godhead" size={30} />
          <span>IsaacDex</span>
        </Link>
        <SideNav onNawigacja={zamknij} />

        {/* Drugie, jeszcze cichsze wejście do sekretu: rysa w ścianie na samym dole panelu.
            Bez etykiety, ledwie widoczna — trzeba ją zauważyć, dokładnie jak w grze. */}
        <Link
          href="/sekret"
          className="side-secret"
          onClick={zamknij}
          aria-label={t('sekret.wejscieTip')}
          title={t('sekret.wejscieTip')}
        >
          <span className="side-secret-crack" aria-hidden />
        </Link>
      </aside>
    </>
  )
}
