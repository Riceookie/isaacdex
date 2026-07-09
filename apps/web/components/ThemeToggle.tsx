'use client'

import { useEffect, useState } from 'react'
import Sprite from '@/components/Sprite'

type Cards = 'normal' | 'tainted'

/** Skin kartek: normal = jasny pergamin, tainted = ciemne „splugawione" kartki. */
export default function ThemeToggle() {
  const [cards, setCards] = useState<Cards>('normal')

  useEffect(() => {
    const saved = localStorage.getItem('idx_cards') === 'tainted' ? 'tainted' : 'normal'
    setCards(saved)
    document.documentElement.dataset.cards = saved
  }, [])

  function wybierz(c: Cards) {
    setCards(c)
    document.documentElement.dataset.cards = c
    localStorage.setItem('idx_cards', c)
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Skin kartek">
      <button
        className={'theme-opt' + (cards === 'normal' ? ' on' : '')}
        onClick={() => wybierz('normal')}
        aria-pressed={cards === 'normal'}
      >
        <Sprite name="sun" size={26} /> Normalne kartki
      </button>
      <button
        className={'theme-opt' + (cards === 'tainted' ? ' on' : '')}
        onClick={() => wybierz('tainted')}
        aria-pressed={cards === 'tainted'}
      >
        <Sprite name="moon" size={26} /> Tainted (ciemne)
      </button>
    </div>
  )
}
