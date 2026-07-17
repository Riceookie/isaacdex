import type { ReactNode } from 'react'
import IsaacAnim from '@/components/IsaacAnim'
import KlatkiAnim from '@/components/KlatkiAnim'

/**
 * Jeden pusty stan na całą apkę: rysowany Isaac + wyjaśnienie, co dalej.
 *
 * `nastroj` decyduje, KTÓRY Isaac wita:
 *  - `pusto` (domyślnie) — martwy/zakręcony, do prawdziwej pustki: zero wyników, błąd, cisza.
 *  - `zacheta` — uśmiechnięty, do miejsc, gdzie nic nie jest zepsute, tylko czeka na Ciebie
 *    (świeże konto, niepodpięty Steam). Nowego użytkownika nie wita się trupem — „nic tu
 *    jeszcze nie ma" to zaproszenie, a nie awaria.
 */
export default function PustyStan({
  tekst,
  akcja,
  maly = false,
  nastroj = 'pusto',
  poza,
}: {
  /** Co się stało i co użytkownik może z tym zrobić. */
  tekst: ReactNode
  /** Opcjonalny przycisk/link wyprowadzający z pustki. */
  akcja?: ReactNode
  /** Wersja do wąskich paneli (mniejsza klatka, mniej paddingu). */
  maly?: boolean
  nastroj?: 'pusto' | 'zacheta'
  /** Drugi rząd — drobne „a tymczasem możesz…". Nie krzyczy, ale daje wyjście. */
  poza?: ReactNode
}) {
  return (
    <div className={'pusto' + (maly ? ' pusto-maly' : '')} role="status">
      {nastroj === 'zacheta' ? (
        <KlatkiAnim nazwa="happy" className={maly ? 'ianim-maly' : ''} />
      ) : (
        <IsaacAnim rodzaj="empty" maly={maly} />
      )}
      <p className="pusto-tekst">{tekst}</p>
      {akcja && <div className="pusto-akcja">{akcja}</div>}
      {poza && <p className="pusto-poza muted small">{poza}</p>}
    </div>
  )
}
