import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/przeciwnicy.json'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'

type Przeciwnik = {
  nazwa: string
  ikona?: string | null
  hp?: number | null
  obrazenia?: number | null
  opis?: string | null
}

const PRZECIWNICY = surowe as Przeciwnik[]

const FILTRY: EncFiltr[] = [
  { id: 'slabe', label: 'do 20 HP' },
  { id: 'srednie', label: '20–60 HP' },
  { id: 'mocne', label: 'powyżej 60 HP' },
]

/**
 * Sekcja „Przeciwnicy" — 367 potworów: lista i opisy z wiki, statystyki (HP, obrażenia)
 * z entities2.xml.
 */
export default function PrzeciwnicyPage() {
  const wpisy: EncWpis[] = PRZECIWNICY.map((p) => {
    const hp = p.hp ?? 0
    const grupa = hp === 0 ? [] : hp <= 20 ? ['slabe'] : hp <= 60 ? ['srednie'] : ['mocne']

    return {
      id: p.nazwa,
      nazwa: p.nazwa,
      ikona: p.ikona ?? undefined,
      odznaka: p.hp ? `${p.hp}` : undefined,
      klasa: 'przeciwnik',
      opis: p.hp ? `${p.hp} HP · ${p.obrazenia ?? 1} obrażeń` : 'przeciwnik',
      grupy: grupa,
      waga: hp,
      szczegoly: {
        znaczniki: ['przeciwnik', ...(p.hp ? [`${p.hp} HP`] : [])],
        pola: [
          ...(p.hp ? [{ label: 'Zdrowie', wartosc: `${p.hp} HP` }] : []),
          ...(p.obrazenia ? [{ label: 'Obrażenia od dotknięcia', wartosc: `${p.obrazenia}` }] : []),
        ],
        podglad: p.ikona ? { postac: p.ikona, podpis: 'Sprite z gry' } : undefined,
        pelnyOpis: p.opis ?? undefined,
      },
    }
  })

  return (
    <EncLista
      wpisy={wpisy}
      filtry={FILTRY}
      sortWaga="Zdrowie"
      placeholder="Szukaj przeciwnika…"
      wstep="Kliknij przeciwnika, żeby zobaczyć jego statystyki i zachowanie."
    />
  )
}
