import EncLista from '@/components/EncLista'
import { getOdblokowaneAchievementy } from '@/lib/queries'
import { TRINKETY } from '@/lib/enc/itemyDane'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'

export const dynamic = 'force-dynamic'

const FILTRY: EncFiltr[] = [
  { id: 'masz', label: 'Odblokowane' },
  { id: 'zablokowane', label: 'Zablokowane' },
]

/**
 * Sekcja „Trinkety" — 188 bibelotów z plików gry (cytat) + opisem efektu i warunkiem
 * odblokowania z wiki. Trinkety nie mają jakości ani pul, więc tych sekcji nie pokazujemy.
 */
export default async function TrinketyPage() {
  const odblokowane = await getOdblokowaneAchievementy()

  const wpisy: EncWpis[] = TRINKETY.map((t) => {
    // Trinket bez achievementu jest dostępny od początku.
    const zdobyte = t.achievement ? odblokowane.has(t.achievement) : true

    return {
      id: `t${t.id}`,
      nazwa: t.nazwa,
      idW: t.id,
      typ: 'TRINKET',
      // Odznaka i kolor krawędzi jak przy itemach — spójna siatka w całej Encyklopedii.
      // Zablokowane wyszarzamy klasą (żadnych emoji — apka jest na sprite'ach z gry).
      odznaka: 'T',
      klasa: zdobyte ? 'trinket' : 'trinket zablokowany',
      opis: t.cytat ?? t.opis ?? 'bibelot',
      grupy: [zdobyte ? 'masz' : 'zablokowane'],
      waga: zdobyte ? 1 : 0,
      szczegoly: {
        cytat: t.cytat,
        // Typ jest już w znacznikach — w tabelce zostaje samo ID.
        znaczniki: ['trinket', zdobyte ? 'odblokowany' : 'zablokowany'],
        pola: [{ label: 'ID', wartosc: `#${t.id}` }],
        pelnyOpis: t.opis,
        odblokowanie: t.achievement
          ? { nazwa: t.achievement, warunek: t.warunek, zdobyte }
          : undefined,
      },
    }
  })

  return (
    <EncLista
      wpisy={wpisy}
      filtry={FILTRY}
      sortWaga="Odblokowane"
      placeholder="Szukaj trinketu (nazwa lub efekt)…"
      wstep="Kliknij trinket, żeby zobaczyć jego efekt i sposób odblokowania."
    />
  )
}
