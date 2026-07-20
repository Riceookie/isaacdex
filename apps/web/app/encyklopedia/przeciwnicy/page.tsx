import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/przeciwnicy.json'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'
import { tlumacz } from '@/lib/i18n/serwer'

type Przeciwnik = {
  nazwa: string
  ikona?: string | null
  hp?: number | null
  obrazenia?: number | null
  opis?: string | null
}

const PRZECIWNICY = surowe as Przeciwnik[]

/**
 * Sekcja „Przeciwnicy" — 367 potworów: lista i opisy z wiki, statystyki (HP, obrażenia)
 * z entities2.xml.
 */
export default function PrzeciwnicyPage() {
  const t = tlumacz()

  // Id filtrów zostają — to one łączą chip z `grupy` wpisu.
  const FILTRY: EncFiltr[] = [
    { id: 'slabe', label: t('encyklopedia.filtrHpDo20') },
    { id: 'srednie', label: t('encyklopedia.filtrHp20Do60') },
    { id: 'mocne', label: t('encyklopedia.filtrHpPonad60') },
  ]

  const wpisy: EncWpis[] = PRZECIWNICY.map((p) => {
    const hp = p.hp ?? 0
    const grupa = hp === 0 ? [] : hp <= 20 ? ['slabe'] : hp <= 60 ? ['srednie'] : ['mocne']

    return {
      id: p.nazwa,
      nazwa: p.nazwa,
      ikona: p.ikona ?? undefined,
      odznaka: p.hp ? `${p.hp}` : undefined,
      klasa: 'przeciwnik',
      opis: p.hp
        ? t('encyklopedia.opisHpObrazenia', { hp: p.hp, dmg: p.obrazenia ?? 1 })
        : t('encyklopedia.znacznikPrzeciwnik'),
      grupy: grupa,
      waga: hp,
      szczegoly: {
        znaczniki: [t('encyklopedia.znacznikPrzeciwnik'), ...(p.hp ? [`${p.hp} HP`] : [])],
        pola: [
          ...(p.hp ? [{ label: t('encyklopedia.poleZdrowie'), wartosc: `${p.hp} HP` }] : []),
          ...(p.obrazenia
            ? [{ label: t('encyklopedia.poleObrazeniaOdDotkniecia'), wartosc: `${p.obrazenia}` }]
            : []),
        ],
        podglad: p.ikona
          ? { postac: p.ikona, podpis: t('encyklopedia.detalPodpisSpriteZGry') }
          : undefined,
        pelnyOpis: p.opis ?? undefined,
      },
    }
  })

  return (
    <EncLista
      sekcja={t('encyklopedia.dzialPrzeciwnicy')}
      wpisy={wpisy}
      filtry={FILTRY}
      sortWaga={t('encyklopedia.sortZdrowie')}
      placeholder={t('encyklopedia.przeciwnicySzukaj')}
      wstep={t('encyklopedia.przeciwnicyWstep')}
    />
  )
}
