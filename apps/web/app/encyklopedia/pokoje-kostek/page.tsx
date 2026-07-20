import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/kostki.json'
import type { EncWpis } from '@/lib/enc/typy'
import { tlumacz } from '@/lib/i18n/serwer'

type Kostka = { oczka: number; krotki: string; opis: string; ikona?: string }

const KOSTKI = surowe as Kostka[]

/** Sekcja „Pokoje kostek" — co robi każda liczba oczek na podłodze Dice Roomu (wiki). */
export default function PokojeKostekPage() {
  const t = tlumacz()
  // „1 oczko" / „4 oczka" / „6 oczek" — odmianę robi `Intl.PluralRules` w tłumaczu,
  // więc angielski dostaje swoje dwie formy za darmo.
  const oczka = (n: number) => t('encyklopedia.oczka', { liczba: n })

  const wpisy: EncWpis[] = KOSTKI.map((k) => ({
    id: `k${k.oczka}`,
    nazwa: oczka(k.oczka),
    ikona: k.ikona,
    odznaka: String(k.oczka),
    klasa: 'kostka',
    opis: k.krotki,
    waga: k.oczka,
    szczegoly: {
      znaczniki: [t('encyklopedia.znacznikPokojKostki'), oczka(k.oczka)],
      pelnyOpis: k.opis,
    },
  }))

  return (
    <EncLista
      sekcja={t('encyklopedia.dzialPokojeKostek')}
      wpisy={wpisy}
      sortWaga={t('encyklopedia.sortOczka')}
      placeholder={t('encyklopedia.kostkiSzukaj')}
      wstep={t('encyklopedia.kostkiWstep')}
    />
  )
}
