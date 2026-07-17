'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Sprite, { NAZWY_SPRITEOW, type SpriteName } from '@/components/Sprite'

const KLUCZ = 'idx_ostatnie_reakcje'
const ILE_OSTATNICH = 4

/** Ostatnio używane reakcje (localStorage) — jak avatar czy gablota, bez backendu. */
export function ostatnieReakcje(domyslne: SpriteName[]): SpriteName[] {
  if (typeof window === 'undefined') return domyslne.slice(0, ILE_OSTATNICH)
  try {
    const raw = JSON.parse(localStorage.getItem(KLUCZ) ?? '[]')
    const lista: SpriteName[] = Array.isArray(raw)
      ? raw.filter((x) => NAZWY_SPRITEOW.includes(x))
      : []
    // Uzupełniamy domyślnymi, żeby zawsze były 4 — świeże konto też ma co pokazać.
    return [...lista, ...domyslne.filter((d) => !lista.includes(d))].slice(0, ILE_OSTATNICH)
  } catch {
    return domyslne.slice(0, ILE_OSTATNICH)
  }
}

/** Dopisuje reakcję na początek „ostatnio używanych". */
export function zapamietajReakcje(ikona: SpriteName) {
  const teraz = ostatnieReakcje([])
  const next = [ikona, ...teraz.filter((x) => x !== ikona)].slice(0, ILE_OSTATNICH)
  localStorage.setItem(KLUCZ, JSON.stringify(next))
  window.dispatchEvent(new Event('idx-reakcje'))
}

/**
 * Popover z reakcjami: 4 ostatnio używane + „Więcej" rozwijające pełną siatkę sprite'ów.
 *
 * Leci przez PORTAL i `position: fixed`, a nie inline przy przycisku — lista wiadomości
 * (`.cz-msgs`) ma `overflow-y: auto`, więc każdy popover wypuszczony w niej byłby
 * PRZYCINANY przy górnej i dolnej krawędzi (a pod nagłówkiem czatu jeszcze i zasłaniany).
 * Pozycję liczymy z prostokąta kotwicy i odbijamy w dół, gdy nad nią brakuje miejsca.
 */
export default function WybieraczkaReakcji({
  kotwica,
  domyslne,
  tryb = 'reakcje',
  onWybierz,
  onZamknij,
}: {
  /** Element, przy którym ma stanąć popover (przycisk „+" albo „naklejki"). */
  kotwica: HTMLElement | null
  domyslne: SpriteName[]
  /**
   * `reakcje` — 4 ostatnio używane + „Więcej…" (reakcja to jeden klik, więc skrót ma sens).
   * `naklejki` — od razu pełna siatka z szukajką: naklejkę się WYBIERA, a nie powtarza,
   *   więc „ostatnio używane" tylko zabierałoby miejsce.
   */
  tryb?: 'reakcje' | 'naklejki'
  onWybierz: (ikona: SpriteName) => void
  onZamknij: () => void
}) {
  const naklejki = tryb === 'naklejki'
  const [pelna, setPelna] = useState(naklejki)
  const [fraza, setFraza] = useState('')
  const [ostatnie, setOstatnie] = useState<SpriteName[]>(domyslne.slice(0, ILE_OSTATNICH))
  const [poz, setPoz] = useState<{ left: number; top: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setOstatnie(ostatnieReakcje(domyslne)), [domyslne])

  // Pozycja liczona PO wyrenderowaniu (znamy własną wysokość) i przeliczana, gdy
  // popover urośnie po kliknięciu „Więcej".
  useLayoutEffect(() => {
    if (!kotwica || !ref.current) return
    const k = kotwica.getBoundingClientRect()
    const p = ref.current.getBoundingClientRect()
    const margines = 6
    const nadKotwica = k.top - p.height - margines
    const top = nadKotwica >= 8 ? nadKotwica : k.bottom + margines
    const left = Math.max(8, Math.min(k.right - p.width, window.innerWidth - p.width - 8))
    setPoz({ left, top })
  }, [kotwica, pelna, fraza])

  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Node
      if (ref.current?.contains(t) || kotwica?.contains(t)) return
      onZamknij()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onZamknij()
    window.addEventListener('pointerdown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [onZamknij, kotwica])

  const klik = (i: SpriteName) => {
    // „Ostatnio używane" prowadzimy tylko dla reakcji — naklejki ich nie mają.
    if (!naklejki) zapamietajReakcje(i)
    onWybierz(i)
  }

  const widoczne = fraza.trim()
    ? NAZWY_SPRITEOW.filter((i) => i.toLowerCase().includes(fraza.trim().toLowerCase()))
    : NAZWY_SPRITEOW

  return createPortal(
    <div
      className={'cz-picker' + (pelna ? ' pelna' : '')}
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
                aria-label={`Reakcja ${i}`}
              >
                <Sprite name={i} size={20} />
              </button>
            ))}
          </div>
          <button type="button" className="cz-picker-wiecej" onClick={() => setPelna(true)}>
            Więcej…
          </button>
        </>
      ) : (
        <>
          <div className="cz-picker-head">
            <input
              className="cz-picker-szukaj"
              type="search"
              placeholder={naklejki ? 'Szukaj naklejki…' : 'Szukaj…'}
              value={fraza}
              onChange={(e) => setFraza(e.target.value)}
              autoFocus
            />
            {/* Powrót do skrótów tylko przy reakcjach — naklejki nie mają dokąd wracać. */}
            {!naklejki && (
              <button type="button" className="cz-picker-wroc" onClick={() => setPelna(false)}>
                ←
              </button>
            )}
          </div>
          <div className="cz-picker-siatka">
            {widoczne.length === 0 && <p className="muted small cz-picker-pusto">Nic takiego.</p>}
            {widoczne.map((i) => (
              <button
                key={i}
                type="button"
                className="cz-picker-btn"
                onClick={() => klik(i)}
                title={i}
                aria-label={`Reakcja ${i}`}
              >
                <Sprite name={i} size={20} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>,
    document.body,
  )
}
