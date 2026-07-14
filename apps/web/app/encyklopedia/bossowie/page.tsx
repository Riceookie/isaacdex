import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/bossowie.json'
import type { EncWpis } from '@/lib/enc/typy'

type Boss = {
  nazwa: string
  ikona?: string | null // portret (z plików gry)
  ingame?: string | null // sprite bossa tak, jak wygląda w pokoju (z wiki)
  hp?: number | null
  obrazenia?: number | null
  opis?: string | null
}

const BOSSOWIE = surowe as Boss[]

/**
 * Sekcja „Bossowie" — 103 bossów: portrety i statystyki z plików gry (bossportraits.xml,
 * entities2.xml), opisy z wiki.
 */
export default function BossowiePage() {
  const wpisy: EncWpis[] = BOSSOWIE.map((b) => ({
    id: b.nazwa,
    nazwa: b.nazwa,
    ikona: b.ikona ?? undefined,
    odznaka: b.hp ? `${b.hp} HP` : undefined,
    klasa: 'boss',
    opis: b.hp ? `${b.hp} HP · ${b.obrazenia ?? 1} obrażeń` : 'boss',
    waga: b.hp ?? 0,
    szczegoly: {
      znaczniki: ['boss', ...(b.hp ? [`${b.hp} HP`] : [])],
      pola: [
        ...(b.hp ? [{ label: 'Zdrowie', wartosc: `${b.hp} HP` }] : []),
        ...(b.obrazenia ? [{ label: 'Obrażenia od dotknięcia', wartosc: `${b.obrazenia}` }] : []),
      ],
      // „Wygląd": portret obok sprite'a z gry — widać i kartę bossa, i to, co spotkasz w pokoju.
      podglad: {
        postac: b.ikona ?? undefined,
        podpis: 'Portret bossa',
        gra: b.ingame ?? undefined,
        podpisGra: 'W grze',
      },
      pelnyOpis: b.opis ?? undefined,
    },
  }))

  return (
    <EncLista
      sekcja="Bossowie"
      wpisy={wpisy}
      sortWaga="Zdrowie"
      placeholder="Szukaj bossa…"
      wstep="Kliknij bossa, żeby zobaczyć jego portret, statystyki i opis."
    />
  )
}
