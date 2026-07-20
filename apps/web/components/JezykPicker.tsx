'use client'

import { useTransition } from 'react'
import Sprite from '@/components/Sprite'
import { useJezyk, useT } from '@/components/JezykProvider'
import { ustawJezyk } from '@/app/actions/jezyk'
import { JEZYKI, NAZWY_JEZYKOW, type Jezyk } from '@/lib/i18n/jezyk'

/**
 * Wybór języka — ten sam „przełącznik dwóch kartek", co skin motywu, żeby ustawienia
 * wyglądały spójnie. Ikony z gry zamiast flag: flaga oznacza kraj, nie język (angielski
 * to nie tylko Wielka Brytania), a do tego wypada z pixelartowej konwencji reszty apki.
 *
 * Angielski dostaje The Sun, polski The Moon — te same sprite'y, które w apce oznaczają
 * „jasne / ciemne kartki", więc czytają się jako para wyboru, a nie przypadkowe obrazki.
 */
const IKONY: Record<Jezyk, 'sun' | 'moon'> = { en: 'sun', pl: 'moon' }

export default function JezykPicker() {
  const jezyk = useJezyk()
  const t = useT()
  const [czekam, start] = useTransition()

  const wybierz = (j: Jezyk) => {
    if (j === jezyk) return
    start(() => {
      void ustawJezyk(j)
    })
  }

  return (
    <div
      className={'theme-toggle jezyk-toggle' + (czekam ? ' czeka' : '')}
      role="group"
      aria-label={t('ustawienia.jezykGrupa')}
    >
      {JEZYKI.map((j) => (
        <button
          key={j}
          type="button"
          className={'theme-opt' + (jezyk === j ? ' on' : '')}
          onClick={() => wybierz(j)}
          aria-pressed={jezyk === j}
          disabled={czekam}
        >
          <Sprite name={IKONY[j]} size={26} /> {NAZWY_JEZYKOW[j]}
        </button>
      ))}
    </div>
  )
}
