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
import { tlumacz } from '@/lib/i18n/serwer'

export const dynamic = 'force-dynamic'

/**
 * Sekcja „Przedmioty": lista itemów z bazy + szczegóły w stylu wiki (cytat, ID, jakość,
 * typ, pule, staty, wygląd, opis efektu, warunek odblokowania).
 */
export default async function PrzedmiotyPage() {
  const [items, odblokowane] = await Promise.all([getItemyZOcena(), getOdblokowaneAchievementy()])
  const t = tlumacz()

  // Id filtrów są danymi (dopasowują się do `grupy` wpisu), więc zostają — tłumaczymy etykiety.
  const FILTRY: EncFiltr[] = [
    { id: 'q4', label: 'Q4' },
    { id: 'q3', label: 'Q3' },
    { id: 'q2', label: 'Q2' },
    { id: 'q1', label: 'Q1' },
    { id: 'q0', label: 'Q0' },
    { id: 'aktywny', label: t('encyklopedia.filtrAktywne') },
    { id: 'pasywny', label: t('encyklopedia.filtrPasywne') },
    // Pule pokojów — najczęściej pytane „skąd to wpada": anielski i diabelski.
    { id: 'angel', label: t('encyklopedia.pulaAngel') },
    { id: 'devil', label: t('encyklopedia.pulaDevil') },
    { id: 'treasure', label: t('encyklopedia.pulaTreasure') },
    { id: 'shop', label: t('encyklopedia.pulaShop') },
  ]

  const wpisy: EncWpis[] = items.map((i) => {
    const typ = i.typ.toLowerCase()
    const d = daneItemu(i.idW, i.nazwa)

    // Typ i ładunek są już w znacznikach pod nazwą — w tabelce zostaje ID i jakość.
    const pola = i.idW ? [{ label: t('encyklopedia.poleId'), wartosc: `#${i.idW}` }] : []

    // `typ` z bazy (PASYWNY/AKTYWNY) jest identyfikatorem — na chip idzie przetłumaczone słowo.
    const typEtykieta = t(typ === 'aktywny' ? 'encyklopedia.typAktywny' : 'encyklopedia.typPasywny')

    return {
      id: String(i.idW ?? i.nazwa),
      nazwa: i.nazwa,
      idW: i.idW,
      typ: i.typ,
      odznaka: `Q${i.jakosc}`,
      klasa: `q${i.jakosc}`,
      // Na karcie: krótki tekst z gry, a gdy go brak — znaczące tagi.
      opis: d?.cytat ?? i.opis ?? opisItemu(i.tagi, typ, t),
      // Grupy = jakość + typ + pule pokojów (pule dokładają filtr „anielski/diabelski/…").
      grupy: [`q${i.jakosc}`, typ, ...(d?.pule ?? [])],
      waga: i.jakosc,
      szczegoly: {
        cytat: d?.cytat,
        znaczniki: [
          d?.familiar ? t('encyklopedia.znacznikChowaniec') : typEtykieta,
          ...(d?.ladunek ? [t('encyklopedia.znacznikLadunek', { ile: d.ladunek })] : []),
          ...(d?.pule?.length ? [etykietaPuli(d.pule[0], t)] : []),
        ],
        jakosc: i.jakosc,
        pola,
        pule: d?.pule?.map((p) => etykietaPuli(p, t)),
        efekty: d?.staty?.map((e) => etykietaStatu(e, t)),
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
      sekcja={t('encyklopedia.dzialPrzedmioty')}
      wpisy={wpisy}
      filtry={FILTRY}
      sortWaga={t('encyklopedia.sortJakosc')}
      placeholder={t('encyklopedia.przedmiotySzukaj')}
      wstep={t('encyklopedia.przedmiotyWstep')}
    />
  )
}
