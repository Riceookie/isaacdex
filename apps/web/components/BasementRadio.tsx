'use client'

import { useRef, useState } from 'react'
import Sprite from '@/components/Sprite'
import { ikonaPostaci } from '@/lib/chars'
import { seedDnia } from '@/lib/dailySeed'
import { useT } from '@/components/JezykProvider'

/** „Basement Radio" — seed dnia + polecana postać i trudność (nasze wyzwanie, liczone z daty).
 *  Kliknięcie „gra" radio: krótki jingle (Web Audio, bez pliku) + animacja „ON AIR". */
export default function BasementRadio() {
  const t = useT()
  const s = seedDnia(new Date())
  const [playing, setPlaying] = useState(false)
  const acRef = useRef<AudioContext | null>(null)

  function zagraj() {
    if (playing) return
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ac = acRef.current ?? new AC()
      acRef.current = ac
      const t0 = ac.currentTime

      // Krótki „radiowy" trzask (przefiltrowany szum) na start.
      const noiseLen = 0.12
      const buf = ac.createBuffer(1, ac.sampleRate * noiseLen, ac.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
      const noise = ac.createBufferSource()
      noise.buffer = buf
      const nf = ac.createBiquadFilter()
      nf.type = 'bandpass'
      nf.frequency.value = 1400
      const ng = ac.createGain()
      ng.gain.value = 0.14
      noise.connect(nf).connect(ng).connect(ac.destination)
      noise.start(t0)

      // Jingle: trzy nutki (chiptune) — A, C#, E.
      const nuty = [440, 554, 659]
      nuty.forEach((f, i) => {
        const osc = ac.createOscillator()
        osc.type = 'square'
        osc.frequency.value = f
        const g = ac.createGain()
        const start = t0 + 0.1 + i * 0.12
        g.gain.setValueAtTime(0, start)
        g.gain.linearRampToValueAtTime(0.12, start + 0.02)
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.16)
        osc.connect(g).connect(ac.destination)
        osc.start(start)
        osc.stop(start + 0.18)
      })

      setPlaying(true)
      window.setTimeout(() => setPlaying(false), 700)
    } catch {
      // brak Web Audio → po prostu odpal animację
      setPlaying(true)
      window.setTimeout(() => setPlaying(false), 700)
    }
  }

  return (
    <div className={'note radio-card pin-featured' + (playing ? ' on-air' : '')}>
      <h3>
        <Sprite name="d6" size={22} /> Basement Radio
        <button
          type="button"
          className="radio-play"
          onClick={zagraj}
          aria-label={t('companion.radioWlacz')}
          title={t('companion.radioWlacz')}
        >
          {playing ? '♪' : '▶'}
        </button>
      </h3>

      <div className="radio-seed">
        <span className="muted small">{t('companion.radioSeedDnia')}</span>
        <b className="radio-code">{s.seed}</b>
      </div>

      <div className="radio-facts">
        <span className="radio-fact">
          <img src={ikonaPostaci(s.postac)} alt="" />
          {s.postac}
        </span>
        <span className="radio-fact">
          <Sprite name={s.trudnosc === 'Hard' ? 'skull' : 'moon'} size={18} />
          {s.trudnosc}
        </span>
      </div>

      {/* Bez „X osób ukończyło dziś" — ta liczba była losowana z daty. Nie zliczamy runów,
          więc nie mamy skąd wiedzieć, ilu graczy zamknęło wyzwanie. */}
    </div>
  )
}
