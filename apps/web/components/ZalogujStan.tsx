import Link from 'next/link'
import type { ReactNode } from 'react'
import PustyStan from '@/components/PustyStan'

/**
 * Pusty stan dla GOŚCIA: rysowany Isaac + zdanie w klimacie + przycisk do logowania.
 * Jedno miejsce, żeby każda personalna zakładka witała gościa tak samo.
 *
 * `poza` przechodzi niżej — służy do pokazania, co da się robić BEZ konta (Encyklopedia,
 * Kalkulator), żeby zaproszenie nie było ślepym zaułkiem.
 */
export default function ZalogujStan({
  tekst,
  cta = 'Załóż konto',
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
  return (
    <PustyStan
      maly={maly}
      tekst={tekst}
      akcja={
        <Link className="btn" href="/logowanie">
          {cta}
        </Link>
      }
      poza={poza}
    />
  )
}
