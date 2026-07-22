'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { useT } from '@/components/JezykProvider'

/**
 * Mini-gra 1 — „Łapanie Monet". Z góry spadają monety (Keeper krwawi bilonem); przesuwasz
 * sklepikarza w poziomie (wskaźnik/palec albo strzałki) i łapiesz je, zanim dotkną podłogi.
 * Po złapaniu CELu monet gra wygrywa i woła `onWin`.
 *
 * Stan gry (monety, wynik, pozycja łapacza) trzymamy w refach i przeliczamy w pętli rAF —
 * `tick()` wymusza tylko przerysowanie, więc nie walczymy ze stale-closurami setState. Pozycje
 * w poziomie są ułamkowe (0..1), niezależne od szerokości; pion w px względem wysokości sceny.
 */

const CEL = 8 // ile monet trzeba złapać
const WYS = 240 // wysokość sceny (px) — spójna z CSS
const PAS_LAPACZA = 34 // od dołu: w tym pasie moneta może być złapana
const TOLERANCJA = 0.1 // jak blisko w poziomie (ułamek szerokości) łapie łapacz
const MONETY = ['icons/coin.webp', 'pickupy/penny.png', 'pickupy/nickel.png', 'pickupy/dime.png']

type Moneta = { id: number; x: number; y: number; vy: number; sprite: string; zlapana?: boolean }

export default function KoszenieMonet({ onWin }: { onWin: () => void }) {
  const t = useT()
  const scenaRef = useRef<HTMLDivElement>(null)
  const monetyRef = useRef<Moneta[]>([])
  const wynikRef = useRef(0)
  const lapaczRef = useRef(0.5) // pozycja X łapacza (0..1)
  const nastId = useRef(0)
  const spawnAcc = useRef(0)
  const [, tick] = useReducer((n: number) => n + 1, 0)
  const [wygrana, setWygrana] = useState(false)
  const wygranaRef = useRef(false)
  // Krótki „pop" przy złapaniu (skalowanie stosu).
  const [pop, bump] = useReducer((n: number) => n + 1, 0)

  useEffect(() => {
    let raf = 0
    let last = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const lap = lapaczRef.current

      if (!wygranaRef.current) {
        // Spawn co ~0.72 s w losowej kolumnie.
        spawnAcc.current += dt
        if (spawnAcc.current > 0.72) {
          spawnAcc.current = 0
          monetyRef.current.push({
            id: nastId.current++,
            x: 0.09 + Math.random() * 0.82,
            y: -16,
            vy: 120 + Math.random() * 55,
            sprite: MONETY[Math.floor(Math.random() * MONETY.length)],
          })
        }
      }

      const przetrwale: Moneta[] = []
      for (const m of monetyRef.current) {
        m.y += m.vy * dt
        // W pasie łapacza i w zasięgu w poziomie → złapana.
        if (!m.zlapana && m.y >= WYS - PAS_LAPACZA && Math.abs(m.x - lap) < TOLERANCJA) {
          m.zlapana = true
          wynikRef.current += 1
          bump()
          if (wynikRef.current >= CEL && !wygranaRef.current) {
            wygranaRef.current = true
            setWygrana(true)
            window.setTimeout(onWin, 1100)
          }
          continue // znika (złapana)
        }
        if (m.y < WYS + 20) przetrwale.push(m) // reszta leci dalej; poniżej dna — spudłowana
      }
      monetyRef.current = przetrwale
      tick()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // onWin jest stabilne z orkiestratora; celowo montujemy pętlę raz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function ustawZWskaznika(clientX: number) {
    const r = scenaRef.current?.getBoundingClientRect()
    if (!r) return
    lapaczRef.current = Math.max(0.06, Math.min(0.94, (clientX - r.left) / r.width))
  }

  return (
    <div className="mg mg-koszenie">
      <p className="mg-opis small">{t('sekret.gra1Opis')}</p>

      <div
        ref={scenaRef}
        className={'mg-scena' + (wygrana ? ' mg-wygrana' : '')}
        style={{ height: WYS }}
        role="application"
        aria-label={t('sekret.gra1Tytul')}
        tabIndex={0}
        onPointerMove={(e) => ustawZWskaznika(e.clientX)}
        onPointerDown={(e) => ustawZWskaznika(e.clientX)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') lapaczRef.current = Math.max(0.06, lapaczRef.current - 0.07)
          if (e.key === 'ArrowRight') lapaczRef.current = Math.min(0.94, lapaczRef.current + 0.07)
        }}
      >
        {/* Spadające monety */}
        {monetyRef.current.map((m) => (
          <img
            key={m.id}
            className="mg-moneta"
            src={`/tboi/${m.sprite}`}
            alt=""
            style={{ left: `${m.x * 100}%`, top: `${m.y}px` }}
            draggable={false}
          />
        ))}

        {/* Łapacz — sklepikarz sunący po dnie */}
        <img
          className="mg-lapacz"
          src="/tboi/sekret/shopkeeper.png"
          alt=""
          style={{ left: `${lapaczRef.current * 100}%` }}
          draggable={false}
        />

        {/* Stos złapanych monet w rogu + licznik */}
        <div className="mg-stos" aria-hidden>
          {Array.from({ length: Math.min(wynikRef.current, CEL) }).map((_, i) => (
            <span key={i} className="mg-stos-m" style={{ bottom: `${i * 5}px` }} />
          ))}
        </div>
        <div className="mg-licznik" key={pop} aria-live="polite">
          {t('sekret.gra1Cel')}: {Math.min(wynikRef.current, CEL)} / {CEL}
        </div>

        {wygrana && <div className="mg-win">{t('sekret.gra1Win')}</div>}
      </div>
    </div>
  )
}
