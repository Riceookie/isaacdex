import type { ReactNode } from 'react'

/**
 * Jeden pusty stan na całą apkę: martwy Isaac (2 klatki) + wyjaśnienie, co dalej.
 * Używany przy pustym feedzie, zerowych wynikach szukania i błędach — żeby „nic tu nie ma"
 * zawsze wyglądało tak samo i nie było zwykłym szarym akapitem.
 *
 * Animacja jest czysto CSS-owa (mask + keyframes), więc komponent zostaje serwerowy —
 * można go wstawić do dowolnej strony bez 'use client'.
 */
export default function PustyStan({
  tekst,
  akcja,
  maly = false,
}: {
  /** Co się stało i co użytkownik może z tym zrobić. */
  tekst: ReactNode
  /** Opcjonalny przycisk/link wyprowadzający z pustki. */
  akcja?: ReactNode
  /** Wersja do wąskich paneli (mniejsza klatka, mniej paddingu). */
  maly?: boolean
}) {
  return (
    <div className={'pusto' + (maly ? ' pusto-maly' : '')} role="status">
      <div className="pusto-anim" aria-hidden>
        <span className="pusto-klatka pusto-k1" />
        <span className="pusto-klatka pusto-k2" />
      </div>
      <p className="pusto-tekst">{tekst}</p>
      {akcja && <div className="pusto-akcja">{akcja}</div>}
    </div>
  )
}
