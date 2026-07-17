import type { ReactNode } from 'react'
import IsaacAnim from '@/components/IsaacAnim'

/**
 * Jeden pusty stan na całą apkę: rysowany Isaac + wyjaśnienie, co dalej.
 *
 * Animacja jest ZAWSZE losowana z zestawu rysunków (płaczący, zakręcony…) — to one dają
 * apce charakter. Był tu przez chwilę wariant z jedną, uśmiechniętą buźką dla „zachęt":
 * pomysł brzmiał sensownie („nie witaj nowego trupem"), a w praktyce zabrał wszystkim
 * pustym stanom osobowość i zamienił je w jeden generyczny smiley. Nie wracamy do tego.
 */
export default function PustyStan({
  tekst,
  akcja,
  maly = false,
  poza,
}: {
  /** Co się stało i co użytkownik może z tym zrobić. */
  tekst: ReactNode
  /** Opcjonalny przycisk/link wyprowadzający z pustki. */
  akcja?: ReactNode
  /** Wersja do wąskich paneli (mniejsza klatka, mniej paddingu). */
  maly?: boolean
  /** Drugi rząd — drobne „a tymczasem możesz…". Nie krzyczy, ale daje wyjście. */
  poza?: ReactNode
}) {
  return (
    <div className={'pusto' + (maly ? ' pusto-maly' : '')} role="status">
      <IsaacAnim rodzaj="empty" maly={maly} />
      <p className="pusto-tekst">{tekst}</p>
      {akcja && <div className="pusto-akcja">{akcja}</div>}
      {poza && <p className="pusto-poza muted small">{poza}</p>}
    </div>
  )
}
