import EncLista from '@/components/EncLista'
import { getItemyZOcena, getOdblokowaneAchievementy } from '@/lib/queries'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'
import { opisItemu } from '@/lib/enc/tagi'
import {
  daneItemu,
  etykietaPuli,
  etykietaStatu,
  obrazekLez,
  obrazekWygladu,
} from '@/lib/enc/itemyDane'

export const dynamic = 'force-dynamic'

const FILTRY: EncFiltr[] = [
  { id: 'q4', label: 'Q4' },
  { id: 'q3', label: 'Q3' },
  { id: 'q2', label: 'Q2' },
  { id: 'q1', label: 'Q1' },
  { id: 'q0', label: 'Q0' },
  { id: 'aktywny', label: 'Aktywne' },
  { id: 'pasywny', label: 'Pasywne' },
]

/**
 * Sekcja „Przedmioty": lista itemów z bazy + szczegóły w stylu wiki (cytat, ID, jakość,
 * typ, pule, staty, wygląd, opis efektu, warunek odblokowania).
 */
export default async function PrzedmiotyPage() {
  const [items, odblokowane] = await Promise.all([getItemyZOcena(), getOdblokowaneAchievementy()])

  const wpisy: EncWpis[] = items.map((i) => {
    const typ = i.typ.toLowerCase()
    const d = daneItemu(i.idW, i.nazwa)

    // Typ i ładunek są już w znacznikach pod nazwą — w tabelce zostaje ID i jakość.
    const pola = i.idW ? [{ label: 'ID', wartosc: `#${i.idW}` }] : []

    return {
      id: String(i.idW ?? i.nazwa),
      nazwa: i.nazwa,
      idW: i.idW,
      typ: i.typ,
      odznaka: `Q${i.jakosc}`,
      klasa: `q${i.jakosc}`,
      // Na karcie: krótki tekst z gry, a gdy go brak — znaczące tagi.
      opis: d?.cytat ?? i.opis ?? opisItemu(i.tagi, typ),
      grupy: [`q${i.jakosc}`, typ],
      waga: i.jakosc,
      szczegoly: {
        cytat: d?.cytat,
        znaczniki: [
          d?.familiar ? 'chowaniec' : typ,
          ...(d?.ladunek ? [`ładunek ${d.ladunek}`] : []),
          ...(d?.pule?.length ? [etykietaPuli(d.pule[0])] : []),
        ],
        jakosc: i.jakosc,
        pola,
        pule: d?.pule?.map(etykietaPuli),
        efekty: d?.staty?.map(etykietaStatu),
        // „Wygląd" = obrazki z wiki (Isaac w kostiumie itemu, efekt łez). Sekcja znika,
        // gdy item nie zmienia wyglądu — wtedy wiki nie ma dla niego takiego obrazka.
        podglad: { postac: obrazekWygladu(d), lzy: obrazekLez(d) },
        pelnyOpis: d?.opis ?? i.opis ?? undefined,
        odblokowanie: d?.achievement
          ? {
              nazwa: d.achievement,
              warunek: d.warunek,
              zdobyte: odblokowane.has(d.achievement),
            }
          : undefined,
      },
    }
  })

  return (
    <EncLista
      wpisy={wpisy}
      filtry={FILTRY}
      sortWaga="Jakość"
      placeholder="Szukaj itemu (nazwa lub opis)…"
      wstep="Kliknij item, żeby zobaczyć pełne szczegóły."
    />
  )
}
