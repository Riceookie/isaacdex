'use client'

import { useEffect, useState } from 'react'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'

type Cards = 'normal' | 'tainted'

/** Skin kartek: normal = jasny pergamin, tainted = ciemne „splugawione" kartki. */
export default function ThemeToggle() {
  const t = useT()
  const [cards, setCards] = useState<Cards>('tainted')

  useEffect(() => {
    const saved = localStorage.getItem('idx_cards') === 'normal' ? 'normal' : 'tainted'
    setCards(saved)
    zastosuj(saved)
  }, [])

  function zastosuj(c: Cards) {
    document.documentElement.dataset.cards = c
    // Motyw idzie ZA skinem: normal → jasne UI, tainted → ciemne (spójnie z ThemeApplier).
    document.documentElement.dataset.theme = c === 'normal' ? 'light' : 'dark'
  }

  function wybierz(c: Cards) {
    setCards(c)
    zastosuj(c)
    localStorage.setItem('idx_cards', c)
  }

  return (
    <div className="theme-toggle" role="group" aria-label={t('ustawienia.kartkiGrupa')}>
      <button
        className={'theme-opt' + (cards === 'normal' ? ' on' : '')}
        onClick={() => wybierz('normal')}
        aria-pressed={cards === 'normal'}
      >
        <Sprite name="sun" size={26} /> {t('ustawienia.kartkiNormalne')}
      </button>
      <button
        className={'theme-opt' + (cards === 'tainted' ? ' on' : '')}
        onClick={() => wybierz('tainted')}
        aria-pressed={cards === 'tainted'}
      >
        <Sprite name="moon" size={26} /> {t('ustawienia.kartkiTainted')}
      </button>
    </div>
  )
}
