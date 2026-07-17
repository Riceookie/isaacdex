import Link from 'next/link'
import type { ReactNode } from 'react'
import PustyStan from '@/components/PustyStan'

/**
 * Pusty stan dla GOŚCIA: martwy Isaac (jak wszędzie) + zdanie w klimacie i przycisk do
 * logowania. Jedno miejsce, żeby każda personalna zakładka witała gościa tak samo — ciepło
 * i z humorem, zamiast pokazywać cudze dane albo suchy komunikat „brak profilu".
 */
export default function ZalogujStan({
  tekst,
  cta = 'Załóż konto',
  maly = false,
}: {
  /** Co jest zablokowane i czemu warto się zalogować — w tonie apki. */
  tekst: ReactNode
  /** Napis na przycisku (domyślnie „Załóż konto"). */
  cta?: string
  /** Wersja do wąskich paneli (mniejszy Isaac). */
  maly?: boolean
}) {
  return (
    <PustyStan
      maly={maly}
      tekst={tekst}
      akcja={
        <Link className="btn" href="/logowanie">
          {cta}
        </Link>
      }
    />
  )
}
