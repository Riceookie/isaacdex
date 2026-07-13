import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/transformacje.json'
import type { EncWpis } from '@/lib/enc/typy'

type Transformacja = {
  nazwa: string
  opis?: string | null
  wymog?: string | null
  ikona?: string
  itemy: { idW: number | null; nazwa: string; trinket: boolean }[]
}

const TRANSFORMACJE = surowe as Transformacja[]

// Wiki podaje wymóg słownie i zawsze w kilku wariantach — tłumaczymy te, które faktycznie
// występują, a nieznane zostawiamy w oryginale (lepsze niż zgadywanie).
const WYMOGI: Record<string, string> = {
  'three items from this set': 'trzy itemy z tego zestawu',
  'three items': 'trzy itemy',
  'two items from this set': 'dwa itemy z tego zestawu',
}

function wymogPL(w?: string | null): string | undefined {
  if (!w) return undefined
  return WYMOGI[w.trim().toLowerCase()] ?? w
}

/**
 * Sekcja „Transformacje" — 15 przemian z wiki: co dają, ile itemów z zestawu trzeba
 * i jak Isaac wtedy wygląda (obrazek „appearance").
 */
export default function TransformacjePage() {
  const wpisy: EncWpis[] = TRANSFORMACJE.map((t) => ({
    id: t.nazwa,
    nazwa: t.nazwa,
    ikona: t.ikona,
    odznaka: `${t.itemy.length}`,
    klasa: 'transformacja',
    opis: wymogPL(t.wymog) ?? `${t.itemy.length} itemów w zestawie`,
    waga: t.itemy.length,
    szczegoly: {
      znaczniki: ['transformacja', `${t.itemy.length} itemów w zestawie`],
      pola: t.wymog ? [{ label: 'Wymóg', wartosc: wymogPL(t.wymog)! }] : undefined,
      // Itemy zestawu z ikonami — klikając transformację widzisz, czego szukać w runie.
      itemyTytul: 'Zestaw itemów',
      itemy: t.itemy
        .filter((i) => i.idW != null)
        .map((i) => ({
          idW: i.idW as number,
          nazwa: i.nazwa,
          typ: i.trinket ? 'TRINKET' : undefined,
        })),
      podglad: t.ikona ? { postac: t.ikona, podpis: 'Isaac po transformacji' } : undefined,
      pelnyOpis: t.opis ?? undefined,
    },
  }))

  return (
    <EncLista
      wpisy={wpisy}
      sortWaga="Liczba itemów"
      placeholder="Szukaj transformacji lub efektu…"
      wstep="Kliknij transformację, żeby zobaczyć jej efekt i cały zestaw itemów."
    />
  )
}
