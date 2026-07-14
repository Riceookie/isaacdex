import KalkulatorWidok from '@/components/KalkulatorWidok'

/**
 * Kalkulator statystyk — postać + itemy → staty na żywo. Dane są lokalne (JSON), więc
 * strona nie chodzi do bazy; całe liczenie robi `policzStaty` z @isaacdex/core.
 */
export default function KalkulatorPage() {
  return <KalkulatorWidok />
}
