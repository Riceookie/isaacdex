'use client'

import { useEffect, useState } from 'react'
import Sprite from '@/components/Sprite'

type Theme = 'light' | 'dark'

/** Przełącznik motywu: light = normalne (kremowe) kartki, dark = „tainted" ciemne. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('idx_theme') === 'light' ? 'light' : 'dark'
    setTheme(saved)
    document.documentElement.dataset.theme = saved
  }, [])

  function wybierz(t: Theme) {
    setTheme(t)
    document.documentElement.dataset.theme = t
    localStorage.setItem('idx_theme', t)
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Motyw kartek">
      <button
        className={'theme-opt' + (theme === 'light' ? ' on' : '')}
        onClick={() => wybierz('light')}
        aria-pressed={theme === 'light'}
      >
        <Sprite name="sun" size={26} /> Normalne kartki
      </button>
      <button
        className={'theme-opt' + (theme === 'dark' ? ' on' : '')}
        onClick={() => wybierz('dark')}
        aria-pressed={theme === 'dark'}
      >
        <Sprite name="moon" size={26} /> Tainted (ciemne)
      </button>
    </div>
  )
}
