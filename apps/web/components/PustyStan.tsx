import type { ReactNode } from 'react'
import IsaacAnim from '@/components/IsaacAnim'

/**
 * Jeden pusty stan na całą apkę: losowa dwuklatkowa animacja Isaaca + wyjaśnienie, co dalej.
 * Używany przy pustym feedzie, zerowych wynikach szukania i błędach — żeby „nic tu nie ma"
 * zawsze wyglądało spójnie i nie było zwykłym szarym akapitem.
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
      <IsaacAnim rodzaj="empty" maly={maly} />
      <p className="pusto-tekst">{tekst}</p>
      {akcja && <div className="pusto-akcja">{akcja}</div>}
    </div>
  )
}
