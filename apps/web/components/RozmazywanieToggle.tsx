'use client'

import { useEffect, useState } from 'react'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
import { czytajBlur, ustawBlur } from '@/lib/blur'

/**
 * Przełącznik „Curse of the Blind" — czy zasłaniać przekleństwa na czacie znakami „???".
 * Ten sam „przełącznik dwóch kartek", co motyw i język, żeby ustawienia wyglądały spójnie.
 * Domyślnie WŁĄCZONY; zmiana rozgłasza się do otwartego czatu od razu (patrz lib/blur).
 */
export default function RozmazywanieToggle() {
  const t = useT()
  const [on, setOn] = useState(true)

  useEffect(() => setOn(czytajBlur()), [])

  function wybierz(v: boolean) {
    setOn(v)
    ustawBlur(v)
  }

  return (
    <div className="theme-toggle" role="group" aria-label={t('ustawienia.blurGrupa')}>
      <button
        className={'theme-opt' + (on ? ' on' : '')}
        onClick={() => wybierz(true)}
        aria-pressed={on}
      >
        <Sprite name="cursedeye" size={26} /> {t('ustawienia.blurWlaczone')}
      </button>
      <button
        className={'theme-opt' + (!on ? ' on' : '')}
        onClick={() => wybierz(false)}
        aria-pressed={!on}
      >
        <Sprite name="momsEye" size={26} /> {t('ustawienia.blurWylaczone')}
      </button>
    </div>
  )
}
