import IsaacAnim from '@/components/IsaacAnim'

/**
 * Wspólny loader: losowa dwuklatkowa animacja Isaaca + podpis „Loading…".
 * Używany wszędzie, gdzie coś się wczytuje (Next `loading.tsx`).
 */
export default function Ladowanie({ tekst = 'Ładowanie…' }: { tekst?: string }) {
  return (
    <div className="ladowanie" role="status" aria-live="polite">
      <IsaacAnim rodzaj="load" />
      <p>{tekst}</p>
    </div>
  )
}
