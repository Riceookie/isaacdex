'use client'

import { useTransition } from 'react'
import Sprite, { type SpriteName } from '@/components/Sprite'
import { useJezyk, useT } from '@/components/JezykProvider'
import { ustawJezyk } from '@/app/actions/jezyk'
import { JEZYKI, NAZWY_JEZYKOW, type Jezyk } from '@/lib/i18n/jezyk'

/**
 * Wybór języka — ten sam „przełącznik dwóch kartek", co skin motywu, żeby ustawienia
 * wyglądały spójnie. Ikony z gry zamiast flag: flaga oznacza kraj, nie język (angielski
 * to nie tylko Wielka Brytania), a do tego wypada z pixelartowej konwencji reszty apki.
 *
 * Ikona to Dad's Note (odręczna karteczka „od słowa") dla obu języków. Wcześniej były tu
 * The Sun / The Moon — ale te same sprite'y oznaczają w apce „jasne / ciemne kartki", więc
 * język mylił się z motywem.
 */
const IKONY: Record<Jezyk, SpriteName> = { en: 'dadsnote', pl: 'dadsnote' }

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
