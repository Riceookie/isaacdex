import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/bossowie.json'
import type { EncWpis } from '@/lib/enc/typy'
import { tlumacz } from '@/lib/i18n/serwer'

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
  const t = tlumacz()

  const wpisy: EncWpis[] = BOSSOWIE.map((b) => ({
    id: b.nazwa,
    nazwa: b.nazwa,
    ikona: b.ikona ?? undefined,
    odznaka: b.hp ? `${b.hp} HP` : undefined,
    klasa: 'boss',
    opis: b.hp
      ? t('encyklopedia.opisHpObrazenia', { hp: b.hp, dmg: b.obrazenia ?? 1 })
      : t('encyklopedia.znacznikBoss'),
    waga: b.hp ?? 0,
    szczegoly: {
      znaczniki: [t('encyklopedia.znacznikBoss'), ...(b.hp ? [`${b.hp} HP`] : [])],
      pola: [
        ...(b.hp ? [{ label: t('encyklopedia.poleZdrowie'), wartosc: `${b.hp} HP` }] : []),
        ...(b.obrazenia
          ? [{ label: t('encyklopedia.poleObrazeniaOdDotkniecia'), wartosc: `${b.obrazenia}` }]
          : []),
      ],
      // „Wygląd": portret obok sprite'a z gry — widać i kartę bossa, i to, co spotkasz w pokoju.
      podglad: {
        postac: b.ikona ?? undefined,
        podpis: t('encyklopedia.detalPodpisPortretBossa'),
        gra: b.ingame ?? undefined,
        podpisGra: t('encyklopedia.detalPodpisWGrze'),
      },
      pelnyOpis: b.opis ?? undefined,
    },
  }))

  return (
    <EncLista
      sekcja={t('encyklopedia.dzialBossowie')}
      wpisy={wpisy}
      sortWaga={t('encyklopedia.sortZdrowie')}
      placeholder={t('encyklopedia.bossowieSzukaj')}
      wstep={t('encyklopedia.bossowieWstep')}
    />
  )
}
