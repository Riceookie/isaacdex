import EncLista from '@/components/EncLista'
import { etykietaRodziny, PICKUPY, RODZINY, slugRodziny } from '@/lib/enc/pickupyDane'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'
import { tlumacz } from '@/lib/i18n/serwer'

/**
 * Sekcja „Pickupy" — znajdźki z 7 rodzin (serca, monety, klucze, bomby, baterie, skrzynie,
 * worki) z tabel wiki: co dają, jak je odblokować i jak często wypadają.
 */
export default function PickupyPage() {
  const t = tlumacz()

  // Slug (id filtra) liczymy z polskiej nazwy rodziny z JSON-a — to identyfikator, nie napis.
  const FILTRY: EncFiltr[] = RODZINY.map((r) => ({
    id: slugRodziny(r),
    label: etykietaRodziny(r, t),
  }))

  const wpisy: EncWpis[] = PICKUPY.map((p) => ({
    id: `${p.rodzina}-${p.nazwa}`,
    nazwa: p.nazwa,
    ikona: p.ikona ?? undefined,
    // Bez odznaki: wartości pickupów to całe frazy („1 czerwone serce"), więc rozwalały
    // narożnik karty. Idą w opis, gdzie jest na nie miejsce.
    klasa: 'pickup',
    opis: p.wartosc ?? etykietaRodziny(p.rodzina, t),
    grupy: [slugRodziny(p.rodzina)],
    szczegoly: {
      znaczniki: [
        etykietaRodziny(p.rodzina, t),
        ...(p.odblokowanie ? [t('encyklopedia.znacznikDoOdblokowania')] : []),
      ],
      pola: [
        ...(p.wartosc ? [{ label: t('encyklopedia.poleDaje'), wartosc: p.wartosc }] : []),
        ...(p.szansa
          ? [{ label: t('encyklopedia.poleSzansaWypadniecia'), wartosc: p.szansa }]
          : []),
      ],
      pelnyOpis: p.opis ?? undefined,
      // Wiki podaje warunek słownie (to nie achievement Steam), więc bez statusu „masz/nie masz".
      odblokowanie: p.odblokowanie ? { nazwa: p.odblokowanie } : undefined,
    },
  }))

  return (
    <EncLista
      sekcja={t('encyklopedia.dzialPickupy')}
      wpisy={wpisy}
      filtry={FILTRY}
      placeholder={t('encyklopedia.pickupySzukaj')}
      wstep={t('encyklopedia.pickupyWstep')}
    />
  )
}
