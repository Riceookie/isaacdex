'use client'

import IsaacAnim from '@/components/IsaacAnim'
import { useT } from '@/components/JezykProvider'

/**
 * Wspólny loader: losowa dwuklatkowa animacja Isaaca + podpis „Ładowanie…".
 * Używany wszędzie, gdzie coś się wczytuje (Next `loading.tsx`).
 *
 * Komponent jest KLIENCKI, choć wszystkie `loading.tsx` są serwerowe. Powód: `tlumacz()`
 * czyta ciasteczko przez `cookies()`, a wywołanie tego w fallbacku Suspense wymusiłoby
 * dynamiczny render na trasach, które wcale go nie potrzebują (Encyklopedia). `useT()`
 * bierze język z providera w layoucie — działa tak samo w SSR i po hydratacji.
 * IsaacAnim i tak jest kliencki, więc nic tu nie dochodzi do bundla klienta.
 */
export default function Ladowanie({ tekst }: { tekst?: string }) {
  const t = useT()
  return (
    <div className="ladowanie" role="status" aria-live="polite">
      <IsaacAnim rodzaj="load" />
      <p>{tekst ?? t('klimat.ladowanie')}</p>
    </div>
  )
}
