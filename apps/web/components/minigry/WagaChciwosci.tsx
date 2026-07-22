'use client'

import { useEffect, useRef, useState } from 'react'
import { useT } from '@/components/JezykProvider'

/**
 * Mini-gra 2 — „Waga Chciwości". Po lewej szali wisi towar z ceną; przeciągasz (albo dotykasz)
 * monety z tacy na prawą szalę, aż zrównoważysz cenę CO DO GROSZA. Za mało → szala lekka, za
 * dużo → chciwość, dopiero równo → waga spoczywa i gra woła `onWin`. Monety na szali można
 * zdjąć kliknięciem.
 *
 * Przeciąganie jest wskaźnikowe (pointer capture na monecie), więc działa myszą i dotykiem;
 * krótkie tapnięcie bez ruchu też dokłada monetę (wygodne dla klawiatury/czytnika i na telefonie).
 */

type Denom = { key: string; value: number; sprite: string; start: number }
const DENOMY: Denom[] = [
  { key: 'penny', value: 1, sprite: 'pickupy/penny.png', start: 9 },
  { key: 'nickel', value: 5, sprite: 'pickupy/nickel.png', start: 3 },
  { key: 'dime', value: 10, sprite: 'pickupy/dime.png', start: 2 },
]
const CENY = [7, 11, 13, 15]

type Polozona = { id: number; value: number; sprite: string; key: string }

export default function WagaChciwosci({ onWin }: { onWin: () => void }) {
  const t = useT()
  const [cena] = useState(() => CENY[Math.floor(Math.random() * CENY.length)])
  const [taca, setTaca] = useState<Record<string, number>>(() =>
    Object.fromEntries(DENOMY.map((d) => [d.key, d.start])),
  )
  const [polozone, setPolozone] = useState<Polozona[]>([])
  const [drag, setDrag] = useState<{ value: number; sprite: string; cx: number; cy: number } | null>(
    null,
  )
  const [wygrana, setWygrana] = useState(false)
  const ruszony = useRef(false)
  const nid = useRef(0)
  const szalaRef = useRef<HTMLDivElement>(null)

  const suma = polozone.reduce((s, p) => s + p.value, 0)
  const roznica = suma - cena // <0 za mało, >0 za dużo, 0 równo

  useEffect(() => {
    if (!wygrana && suma > 0 && roznica === 0) {
      setWygrana(true)
      const id = window.setTimeout(onWin, 1000)
      return () => window.clearTimeout(id)
    }
  }, [roznica, suma, wygrana, onWin])

  function doloz(d: Denom) {
    if (wygrana || taca[d.key] <= 0) return
    setTaca((tr) => ({ ...tr, [d.key]: tr[d.key] - 1 }))
    setPolozone((p) => [...p, { id: nid.current++, value: d.value, sprite: d.sprite, key: d.key }])
  }
  function zdejmij(p: Polozona) {
    if (wygrana) return
    setPolozone((arr) => arr.filter((x) => x.id !== p.id))
    setTaca((tr) => ({ ...tr, [p.key]: tr[p.key] + 1 }))
  }

  function start(e: React.PointerEvent, d: Denom) {
    if (wygrana || taca[d.key] <= 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    ruszony.current = false
    setDrag({ value: d.value, sprite: `/tboi/${d.sprite}`, cx: e.clientX, cy: e.clientY })
  }
  function move(e: React.PointerEvent) {
    if (!drag) return
    ruszony.current = true
    setDrag((dd) => (dd ? { ...dd, cx: e.clientX, cy: e.clientY } : dd))
  }
  function end(e: React.PointerEvent, d: Denom) {
    if (drag) {
      if (!ruszony.current) {
        doloz(d) // tapnięcie bez ruchu → dokładamy (fallback bez przeciągania)
      } else {
        const r = szalaRef.current?.getBoundingClientRect()
        const wSzali =
          r &&
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        if (wSzali) doloz(d)
      }
    }
    setDrag(null)
  }

  const status = wygrana
    ? 'sekret.gra2Win'
    : roznica === 0 && suma > 0
      ? 'sekret.gra2Rowno'
      : roznica > 0
        ? 'sekret.gra2Duzo'
        : 'sekret.gra2Malo'

  // Przechył: dodatnia różnica (chciwość) → prawa szala w dół.
  const przechyl = Math.max(-14, Math.min(14, roznica * 1.6))
  const opad = Math.max(-24, Math.min(24, roznica * 2.4))

  return (
    <div className="mg mg-waga">
      <p className="mg-opis small">{t('sekret.gra2Opis')}</p>

      <div className={'mg-waga-scena' + (wygrana ? ' mg-wygrana' : '')}>
        {/* Słupek + belka, która się przechyla */}
        <span className="mg-waga-slup" aria-hidden />
        <div className="mg-belka" style={{ transform: `rotate(${przechyl}deg)` }} aria-hidden>
          <span className="mg-cieciwa lewa" />
          <span className="mg-cieciwa prawa" />
        </div>

        {/* Lewa szala — towar z ceną (cel) */}
        <div className="mg-szala lewa" style={{ transform: `translateY(${-opad}px)` }}>
          <div className="mg-szala-talerz">
            <img src="/tboi/pickupy/chest.png" alt="" className="mg-towar" draggable={false} />
          </div>
          <span className="mg-metka">
            {t('sekret.gra2Cena')}: {cena}¢
          </span>
        </div>

        {/* Prawa szala — twoje monety (drop zone) */}
        <div
          className={'mg-szala prawa' + (drag ? ' mg-drop-akt' : '')}
          style={{ transform: `translateY(${opad}px)` }}
        >
          <div ref={szalaRef} className="mg-szala-talerz mg-drop">
            {polozone.map((p, i) => (
              <img
                key={p.id}
                src={`/tboi/${p.sprite}`}
                alt=""
                className="mg-moneta-pol"
                style={{ left: `${12 + (i % 5) * 13}px`, bottom: `${4 + Math.floor(i / 5) * 8}px` }}
                onClick={() => zdejmij(p)}
                draggable={false}
              />
            ))}
          </div>
          <span className="mg-metka">
            {t('sekret.gra2Twoje')}: {suma}¢
          </span>
        </div>
      </div>

      {/* Status: za mało / za dużo / równo */}
      <p className={'mg-status small' + (wygrana ? ' mg-status-win' : '')} aria-live="polite">
        {t(status)}
      </p>

      {/* Taca monet do przeciągania / dotykania */}
      <div className="mg-taca">
        {DENOMY.map((d) => (
          <button
            key={d.key}
            type="button"
            className="mg-chip"
            disabled={taca[d.key] <= 0 || wygrana}
            onPointerDown={(e) => start(e, d)}
            onPointerMove={move}
            onPointerUp={(e) => end(e, d)}
            aria-label={`${d.value}¢ ×${taca[d.key]}`}
          >
            <img src={`/tboi/${d.sprite}`} alt="" draggable={false} />
            <span className="mg-chip-liczba">×{taca[d.key]}</span>
          </button>
        ))}
      </div>
      <p className="mg-cofnij small">{t('sekret.gra2Cofnij')}</p>

      {/* Podgląd przeciąganej monety — leci za wskaźnikiem */}
      {drag && (
        <img
          className="mg-drag-podglad"
          src={drag.sprite}
          alt=""
          style={{ left: drag.cx, top: drag.cy }}
          draggable={false}
        />
      )}
    </div>
  )
}
