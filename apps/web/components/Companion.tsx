'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { companionZId, kwestie, DOMYSLNY_COMPANION, type Companion } from '@/lib/companions'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
// „Nutki" blipów — mała skala, żeby gadanie brzmiało znośnie a nie jak modem.
const NOTY = [196, 220, 247, 262, 294, 330, 349, 392, 440]

/** Maskotka-familiar w górnym pasku: wpisuje kwestie (z dźwiękiem per literka),
 *  buja się przy gadaniu, a kliknięcie ją wycisza (X na buzi). */
export default function CompanionMascot({ nick }: { nick: string }) {
  const pathname = usePathname()
  const [comp, setComp] = useState<Companion>(DOMYSLNY_COMPANION)
  const [shown, setShown] = useState('')
  const [talking, setTalking] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<AudioContext | null>(null)
  const mutedRef = useRef(false)

  // Wybrany familiar + stan wyciszenia (z reakcją na zmianę w Ustawieniach).
  useEffect(() => {
    setComp(companionZId(localStorage.getItem('idx_companion')))
    const m = localStorage.getItem('idx_companion_mute') === '1'
    setMuted(m)
    mutedRef.current = m
    const onChange = () => setComp(companionZId(localStorage.getItem('idx_companion')))
    window.addEventListener('idx-companion', onChange)
    return () => window.removeEventListener('idx-companion', onChange)
  }, [])

  // AudioContext trzeba „odblokować" gestem — wznów przy pierwszym kliknięciu.
  useEffect(() => {
    const resume = () => {
      if (!audioRef.current) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AC) audioRef.current = new AC()
      }
      if (audioRef.current?.state === 'suspended') void audioRef.current.resume()
    }
    window.addEventListener('pointerdown', resume)
    return () => window.removeEventListener('pointerdown', resume)
  }, [])

  function blip(ch: string) {
    if (mutedRef.current || !ch || ch === ' ') return
    const ctx = audioRef.current
    if (!ctx || ctx.state !== 'running') return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const code = ch.toLowerCase().charCodeAt(0)
    o.type = 'square'
    o.frequency.value = NOTY[code % NOTY.length] * (code % 2 ? 2 : 1) // różny pitch per literka
    o.connect(g)
    g.connect(ctx.destination)
    const t = ctx.currentTime
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.022, t + 0.006) // cicho
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    o.start(t)
    o.stop(t + 0.08)
  }

  // Pętla: wpisz kwestię (z dźwiękiem), przytrzymaj, wymaż, następna.
  useEffect(() => {
    if (muted) {
      setShown('')
      setTalking(false)
      return
    }
    let cancelled = false
    const pool = kwestie(pathname, nick)
    let idx = Math.floor((pathname.length + nick.length) % pool.length)

    async function run() {
      // krótki oddech na start (żeby nie strzelało od razu przy nawigacji)
      await sleep(500)
      while (!cancelled) {
        const text = pool[idx]
        setTalking(true)
        for (let i = 1; i <= text.length && !cancelled; i++) {
          setShown(text.slice(0, i))
          blip(text[i - 1])
          await sleep(text[i - 1] === ' ' ? 24 : 55)
        }
        setTalking(false)
        if (cancelled) break
        await sleep(9000) // długo trzyma kwestię, zanim ją wymaże
        if (cancelled) break
        // Wymazywanie BEZ bounce'a (talking pozostaje false).
        for (let i = text.length - 1; i >= 0 && !cancelled; i--) {
          setShown(text.slice(0, i))
          await sleep(20)
        }
        if (cancelled) break
        await sleep(5000) // cicha przerwa zanim odezwie się znowu
        idx = (idx + 1) % pool.length
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [pathname, nick, muted])

  function toggleMute() {
    const m = !muted
    setMuted(m)
    mutedRef.current = m
    localStorage.setItem('idx_companion_mute', m ? '1' : '0')
  }

  return (
    <div className="companion-top">
      <button
        type="button"
        className={'companion-mini' + (talking ? ' talking' : '') + (muted ? ' muted' : '')}
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
        <div className="companion-bubble" role="status" aria-live="polite">
          {shown}
          <span className="companion-caret" />
        </div>
      )}
    </div>
  )
}
