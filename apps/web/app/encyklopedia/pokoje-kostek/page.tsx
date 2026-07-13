import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/kostki.json'
import type { EncWpis } from '@/lib/enc/typy'

type Kostka = { oczka: number; krotki: string; opis: string; ikona?: string }

const KOSTKI = surowe as Kostka[]

/** „1 oczko", „4 oczka", „6 oczek" — polska odmiana zamiast sztywnego „oczek". */
function oczka(n: number): string {
  if (n === 1) return '1 oczko'
  return n < 5 ? `${n} oczka` : `${n} oczek`
}

/** Sekcja „Pokoje kostek" — co robi każda liczba oczek na podłodze Dice Roomu (wiki). */
export default function PokojeKostekPage() {
  const wpisy: EncWpis[] = KOSTKI.map((k) => ({
    id: `k${k.oczka}`,
    nazwa: oczka(k.oczka),
    ikona: k.ikona,
    odznaka: String(k.oczka),
    klasa: 'kostka',
    opis: k.krotki,
    waga: k.oczka,
    szczegoly: {
      znaczniki: ['pokój kostki', oczka(k.oczka)],
      pelnyOpis: k.opis,
    },
  }))

  return (
    <EncLista
      wpisy={wpisy}
      sortWaga="Oczka"
      placeholder="Szukaj efektu kostki…"
      wstep="Kliknij kostkę, żeby zobaczyć pełny efekt (każdy pokój działa tylko raz)."
    />
  )
}
