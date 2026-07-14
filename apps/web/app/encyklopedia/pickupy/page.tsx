import EncLista from '@/components/EncLista'
import { PICKUPY, RODZINY, slugRodziny } from '@/lib/enc/pickupyDane'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'

const FILTRY: EncFiltr[] = RODZINY.map((r) => ({ id: slugRodziny(r), label: r }))

/**
 * Sekcja „Pickupy" — znajdźki z 7 rodzin (serca, monety, klucze, bomby, baterie, skrzynie,
 * worki) z tabel wiki: co dają, jak je odblokować i jak często wypadają.
 */
export default function PickupyPage() {
  const wpisy: EncWpis[] = PICKUPY.map((p) => ({
    id: `${p.rodzina}-${p.nazwa}`,
    nazwa: p.nazwa,
    ikona: p.ikona ?? undefined,
    // Bez odznaki: wartości pickupów to całe frazy („1 czerwone serce"), więc rozwalały
    // narożnik karty. Idą w opis, gdzie jest na nie miejsce.
    klasa: 'pickup',
    opis: p.wartosc ?? p.rodzina,
    grupy: [slugRodziny(p.rodzina)],
    szczegoly: {
      znaczniki: [p.rodzina, ...(p.odblokowanie ? ['do odblokowania'] : [])],
      pola: [
        ...(p.wartosc ? [{ label: 'Daje', wartosc: p.wartosc }] : []),
        ...(p.szansa ? [{ label: 'Szansa wypadnięcia', wartosc: p.szansa }] : []),
      ],
      pelnyOpis: p.opis ?? undefined,
      // Wiki podaje warunek słownie (to nie achievement Steam), więc bez statusu „masz/nie masz".
      odblokowanie: p.odblokowanie ? { nazwa: p.odblokowanie } : undefined,
    },
  }))

  return (
    <EncLista
      sekcja="Pickupy"
      wpisy={wpisy}
      filtry={FILTRY}
      placeholder="Szukaj znajdźki (nazwa lub efekt)…"
      wstep="Kliknij znajdźkę, żeby zobaczyć, co daje i jak często wypada."
    />
  )
}
