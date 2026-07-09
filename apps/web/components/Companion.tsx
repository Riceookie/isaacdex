'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { companionZId, kwestie, DOMYSLNY_COMPANION, type Companion } from '@/lib/companions'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Maskotka-familiar w górnym pasku: wpisuje kwestie zależne od strony,
 *  buja się przy gadaniu, a kliknięcie ją wycisza (X na buzi). */
export default function CompanionMascot({ steamConnected = true }: { steamConnected?: boolean }) {
  const pathname = usePathname()
  const [comp, setComp] = useState<Companion>(DOMYSLNY_COMPANION)
  const [shown, setShown] = useState('')
  const [talking, setTalking] = useState(false)
  const [muted, setMuted] = useState(false)

  // Wybrany familiar + stan wyciszenia (z reakcją na zmianę w Ustawieniach).
  useEffect(() => {
    setComp(companionZId(localStorage.getItem('idx_companion')))
    setMuted(localStorage.getItem('idx_companion_mute') === '1')
    const onChange = () => setComp(companionZId(localStorage.getItem('idx_companion')))
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
    const pool = kwestie(pathname, steamConnected)
    let idx = pathname.length % pool.length

    async function run() {
      // krótki oddech na start (żeby nie strzelało od razu przy nawigacji)
      await sleep(500)
      while (!cancelled) {
        const text = pool[idx]
        setTalking(true)
        for (let i = 1; i <= text.length && !cancelled; i++) {
          setShown(text.slice(0, i))
          await sleep(text[i - 1] === ' ' ? 24 : 45)
        }
        setTalking(false)
        if (cancelled) break
        await sleep(9000) // długo trzyma kwestię, zanim ją wymaże
        if (cancelled) break
        // Wymazywanie BEZ bounce'a (talking pozostaje false).
        for (let i = text.length - 1; i >= 0 && !cancelled; i--) {
          setShown(text.slice(0, i))
          await sleep(18)
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
  }, [pathname, steamConnected, muted])

  function toggleMute() {
    const m = !muted
    setMuted(m)
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
