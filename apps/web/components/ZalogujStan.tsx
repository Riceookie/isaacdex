'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import PustyStan from '@/components/PustyStan'
import { useT } from '@/components/JezykProvider'

/**
 * Pusty stan dla GOŚCIA: rysowany Isaac + zdanie w klimacie + przycisk do logowania.
 * Jedno miejsce, żeby każda personalna zakładka witała gościa tak samo.
 *
 * `poza` przechodzi niżej — służy do pokazania, co da się robić BEZ konta (Encyklopedia,
 * Kalkulator), żeby zaproszenie nie było ślepym zaułkiem.
 *
 * Komponent KLIENCKI, bo domyślnego napisu na przycisku nie da się przetłumaczyć tłumaczem
 * serwerowym: renderuje go też `KolekcjaWidok`, który jest klientem — a tam `cookies()` nie ma.
 */
export default function ZalogujStan({
  tekst,
  cta,
  maly = false,
  poza,
}: {
  /** Co jest zablokowane i czemu warto się zalogować — w tonie apki. */
  tekst: ReactNode
  /** Napis na przycisku (domyślnie „Załóż konto"). */
  cta?: string
  /** Wersja do wąskich paneli (mniejszy Isaac). */
  maly?: boolean
  poza?: ReactNode
}) {
  const t = useT()
  return (
    <PustyStan
      maly={maly}
      tekst={tekst}
      akcja={
        <Link className="btn" href="/logowanie">
          {cta ?? t('konto.zalozKonto')}
        </Link>
      }
      poza={poza}
    />
  )
}
