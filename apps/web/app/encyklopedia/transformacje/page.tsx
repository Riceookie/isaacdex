import EncLista from '@/components/EncLista'
import surowe from '@/lib/enc/transformacje.json'
import type { EncWpis } from '@/lib/enc/typy'
import { tlumacz } from '@/lib/i18n/serwer'
import type { Klucz, Tlumacz } from '@/lib/i18n/slownik'

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
const WYMOGI: Record<string, Klucz> = {
  'three items from this set': 'encyklopedia.wymogTrzyZZestawu',
  'three items': 'encyklopedia.wymogTrzyItemy',
  'two items from this set': 'encyklopedia.wymogDwaZZestawu',
}

function wymog(w: string | null | undefined, t: Tlumacz): string | undefined {
  if (!w) return undefined
  const k = WYMOGI[w.trim().toLowerCase()]
  return k ? t(k) : w
}

/**
 * Sekcja „Transformacje" — 15 przemian z wiki: co dają, ile itemów z zestawu trzeba
 * i jak Isaac wtedy wygląda (obrazek „appearance").
 */
export default function TransformacjePage() {
  const t = tlumacz()

  const wpisy: EncWpis[] = TRANSFORMACJE.map((tr) => ({
    id: tr.nazwa,
    nazwa: tr.nazwa,
    ikona: tr.ikona,
    odznaka: `${tr.itemy.length}`,
    klasa: 'transformacja',
    opis: wymog(tr.wymog, t) ?? t('encyklopedia.itemowWZestawie', { liczba: tr.itemy.length }),
    waga: tr.itemy.length,
    szczegoly: {
      znaczniki: [
        t('encyklopedia.znacznikTransformacja'),
        t('encyklopedia.itemowWZestawie', { liczba: tr.itemy.length }),
      ],
      pola: tr.wymog
        ? [{ label: t('encyklopedia.poleWymog'), wartosc: wymog(tr.wymog, t)! }]
        : undefined,
      // Itemy zestawu z ikonami — klikając transformację widzisz, czego szukać w runie.
      itemyTytul: t('encyklopedia.poleZestawItemow'),
      itemy: tr.itemy
        .filter((i) => i.idW != null)
        .map((i) => ({
          idW: i.idW as number,
          nazwa: i.nazwa,
          typ: i.trinket ? 'TRINKET' : undefined,
        })),
      podglad: tr.ikona
        ? { postac: tr.ikona, podpis: t('encyklopedia.detalPodpisPoTransformacji') }
        : undefined,
      pelnyOpis: tr.opis ?? undefined,
    },
  }))

  return (
    <EncLista
      sekcja={t('encyklopedia.dzialTransformacje')}
      wpisy={wpisy}
      sortWaga={t('encyklopedia.sortLiczbaItemow')}
      placeholder={t('encyklopedia.transformacjeSzukaj')}
      wstep={t('encyklopedia.transformacjeWstep')}
    />
  )
}
