'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import IkonaCzatu from '@/components/IkonaCzatu'
import KatalogNaklejek from '@/components/KatalogNaklejek'
import { NAZWY_SPRITEOW } from '@/components/Sprite'
import { naklejka } from '@/lib/naklejki'
import { usePozycjaPopovera, useZamykanie } from '@/lib/popover'
import { useT } from '@/components/JezykProvider'

const KLUCZ = 'idx_ostatnie_reakcje'
const ILE_OSTATNICH = 4

/** Czy identyfikator da się w ogóle narysować — ikona interfejsu albo naklejka z katalogu. */
const znana = (id: unknown): id is string =>
  typeof id === 'string' && ((NAZWY_SPRITEOW as string[]).includes(id) || Boolean(naklejka(id)))

/** Ostatnio używane reakcje (localStorage) — jak avatar czy gablota, bez backendu. */
export function ostatnieReakcje(domyslne: string[]): string[] {
  if (typeof window === 'undefined') return domyslne.slice(0, ILE_OSTATNICH)
  try {
    const raw = JSON.parse(localStorage.getItem(KLUCZ) ?? '[]')
    // Filtr po katalogu, nie po samym rejestrze sprite'ów — od kiedy reakcją może być
    // dowolny item, w localStorage leżą też tokeny naklejek.
    const lista: string[] = Array.isArray(raw) ? raw.filter(znana) : []
    // Uzupełniamy domyślnymi, żeby zawsze były 4 — świeże konto też ma co pokazać.
    return [...lista, ...domyslne.filter((d) => !lista.includes(d))].slice(0, ILE_OSTATNICH)
  } catch {
    return domyslne.slice(0, ILE_OSTATNICH)
  }
}

/** Dopisuje reakcję na początek „ostatnio używanych". */
export function zapamietajReakcje(ikona: string) {
  const teraz = ostatnieReakcje([])
  const next = [ikona, ...teraz.filter((x) => x !== ikona)].slice(0, ILE_OSTATNICH)
  localStorage.setItem(KLUCZ, JSON.stringify(next))
  window.dispatchEvent(new Event('idx-reakcje'))
}

/**
 * Popover z reakcjami: 4 ostatnio używane + „Więcej" rozwijające PEŁNY katalog — te same
 * ~950 itemów, trinketów i pickupów, co naklejki. Reagować można więc dowolnym itemem
 * z gry, a nie tylko garstką ikon interfejsu.
 *
 * Skrót „ostatnio używane" zostaje, bo reakcja to jeden klik i zwykle powtarza się tę samą;
 * przeglądanie katalogu jest dla przypadku „chcę konkretny item".
 */
export default function WybieraczkaReakcji({
  kotwica,
  domyslne,
  onWybierz,
  onZamknij,
}: {
  /** Element, przy którym ma stanąć popover (przycisk „+" przy wiadomości). */
  kotwica: HTMLElement | null
  domyslne: string[]
  onWybierz: (ikona: string) => void
  onZamknij: () => void
}) {
  const t = useT()
  const [pelna, setPelna] = useState(false)
  const [ostatnie, setOstatnie] = useState<string[]>(domyslne.slice(0, ILE_OSTATNICH))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setOstatnie(ostatnieReakcje(domyslne)), [domyslne])

  // Popover rośnie po kliknięciu „Więcej" — wtedy trzeba przeliczyć pozycję.
  const poz = usePozycjaPopovera(kotwica, ref, [pelna])
  useZamykanie(kotwica, ref, onZamknij)

  const klik = (i: string) => {
    zapamietajReakcje(i)
    onWybierz(i)
  }

  return createPortal(
    <div
      className={'cz-picker' + (pelna ? ' pelna cz-naklejki' : '')}
      ref={ref}
      role="menu"
      // Do czasu pomiaru trzymamy popover niewidocznym, żeby nie mrugnął w lewym górnym rogu.
      style={poz ? { left: poz.left, top: poz.top } : { opacity: 0, pointerEvents: 'none' }}
    >
      {!pelna ? (
        <>
          <div className="cz-picker-rzad">
            {ostatnie.map((i) => (
              <button
                key={i}
                type="button"
                className="cz-picker-btn"
                onClick={() => klik(i)}
                aria-label={t('czat.etykietaReakcji', { nazwa: i })}
              >
                <IkonaCzatu id={i} size={20} />
              </button>
            ))}
          </div>
          <button type="button" className="cz-picker-wiecej" onClick={() => setPelna(true)}>
            {t('czat.wiecej')}
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="cz-picker-wroc cz-picker-wroc-gora"
            onClick={() => setPelna(false)}
          >
            {t('czat.wrocDoOstatnich')}
          </button>
          <KatalogNaklejek etykieta="Reakcja" onWybierz={klik} />
        </>
      )}
    </div>,
    document.body,
  )
}
