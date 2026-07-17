'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  companionZId,
  kwestie,
  nastrojStrony,
  wejscie,
  DOMYSLNY_COMPANION,
  type Companion,
} from '@/lib/companions'
import { nasluchujGlosu, type Nastroj, type GlosWtret } from '@/lib/companionGlos'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Maskotka-familiar w górnym pasku: wpisuje kwestie zależne od strony, robi miny
 *  (radość/smutek/ekscytacja) i reaguje na zdarzenia w apce; klik ją wycisza (X na buzi). */
export default function CompanionMascot({
  steamConnected = true,
  zalogowany = true,
}: {
  steamConnected?: boolean
  zalogowany?: boolean
}) {
  const pathname = usePathname()
  const [comp, setComp] = useState<Companion>(DOMYSLNY_COMPANION)
  const [shown, setShown] = useState('')
  const [talking, setTalking] = useState(false)
  const [muted, setMuted] = useState(false)
  const [mood, setMood] = useState<Nastroj>('zwykly')
  // Kwestia „na żądanie" z innej części apki (np. czat, unlock, klik w achievement).
  // Trzymana w refie + tick, bo ma PRZERWAĆ trwającą pętlę, a nie czekać na jej koniec.
  const wtret = useRef<GlosWtret | null>(null)
  const [wtretTick, setWtretTick] = useState(0)

  useEffect(
    () =>
      nasluchujGlosu((w) => {
        wtret.current = w
        setWtretTick((t) => t + 1)
      }),
    [],
  )

  // Wybrany familiar + stan wyciszenia (z reakcją na zmianę w Ustawieniach).
  // Zmiana familiara = maskotka od razu się przedstawia (żeby wybór był „żywy").
  useEffect(() => {
    setComp(companionZId(localStorage.getItem('idx_companion')))
    setMuted(localStorage.getItem('idx_companion_mute') === '1')
    const onChange = () => {
      const nowy = companionZId(localStorage.getItem('idx_companion'))
      setComp(nowy)
      wtret.current = { tekst: `Cześć! Teraz to ja — ${nowy.nazwa}.`, nastroj: 'excited' }
      setWtretTick((t) => t + 1)
    }
    window.addEventListener('idx-companion', onChange)
    return () => window.removeEventListener('idx-companion', onChange)
  }, [])

  // Pętla: wpisz kwestię (litera po literze), przytrzymaj, wymaż, następna.
  useEffect(() => {
    if (muted) {
      setShown('')
      setTalking(false)
      return
    }
    let cancelled = false
    const pool = kwestie(pathname, steamConnected, zalogowany)
    const idleMood = nastrojStrony(pathname, zalogowany)
    // Losowy start + losowa kolejność, żeby nie powtarzał w kółko tego samego.
    let idx = Math.floor(Math.random() * pool.length)

    // Wypisanie i wymazanie kwestii — tak samo dla wtrętu i dla kwestii z puli.
    async function pisz(text: string, nastroj: Nastroj) {
      setMood(nastroj)
      setTalking(true)
      for (let i = 1; i <= text.length && !cancelled; i++) {
        setShown(text.slice(0, i))
        await sleep(text[i - 1] === ' ' ? 24 : 45)
      }
      setTalking(false)
    }
    async function wymaz(text: string) {
      for (let i = text.length - 1; i >= 0 && !cancelled; i--) {
        setShown(text.slice(0, i))
        await sleep(18)
      }
    }

    async function run() {
      // Wtręt (reakcja) wchodzi natychmiast, z własną miną, przed kwestiami z puli.
      if (wtret.current) {
        const { tekst, nastroj } = wtret.current
        wtret.current = null
        await pisz(tekst, nastroj)
        if (!cancelled) await sleep(5000)
        if (!cancelled) await wymaz(tekst)
        if (!cancelled) await sleep(1500)
      } else {
        // Wejście w sekcję: jednorazowa reakcja „witająca" stronę (z własną miną),
        // dopiero potem maskotka wchodzi w spokojną pętlę idle.
        await sleep(400)
        const e = wejscie(pathname, steamConnected, zalogowany)
        await pisz(e.tekst, e.nastroj)
        if (!cancelled) await sleep(6000)
        if (!cancelled) await wymaz(e.tekst)
        if (!cancelled) await sleep(3000)
      }
      while (!cancelled) {
        const text = pool[idx]
        await pisz(text, idleMood)
        if (cancelled) break
        await sleep(9000) // długo trzyma kwestię, zanim ją wymaże
        if (cancelled) break
        await wymaz(text) // wymazywanie BEZ bounce'a (talking pozostaje false)
        if (cancelled) break
        await sleep(5000) // cicha przerwa zanim odezwie się znowu
        idx = (idx + 1) % pool.length
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [pathname, steamConnected, zalogowany, muted, wtretTick])

  function toggleMute() {
    const m = !muted
    setMuted(m)
    localStorage.setItem('idx_companion_mute', m ? '1' : '0')
  }

  return (
    <div className="companion-top">
      <button
        type="button"
        className={
          'companion-mini' +
          (talking ? ' talking' : '') +
          (muted ? ' muted' : '') +
          (!muted ? ` mood-${mood}` : '')
        }
        onClick={toggleMute}
        aria-label={muted ? `Odcisz ${comp.nazwa}` : `Wycisz ${comp.nazwa}`}
        title={muted ? 'Kliknij, by odciszyć' : 'Kliknij, by wyciszyć'}
      >
        <img src={`/tboi/${comp.file}`} alt="" draggable={false} />
        {muted && (
          <span className="companion-x" aria-hidden="true">
            ✕
          </span>
        )}
      </button>
      {!muted && shown && (
        <div className={'companion-bubble mood-' + mood} role="status" aria-live="polite">
          {shown}
          <span className="companion-caret" />
        </div>
      )}
    </div>
  )
}
