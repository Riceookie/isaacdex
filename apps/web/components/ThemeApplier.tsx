'use client'

import { useEffect } from 'react'

// Bez UI — tylko utrzymuje wybrany motyw (piętro) i muchę na każdej stronie.
// Kontrolki są w /ustawienia; tu wczytujemy zapis z localStorage przy wejściu.
export default function ThemeApplier() {
  useEffect(() => {
    const floor = localStorage.getItem('idx_floor') || 'basement'
    document.documentElement.dataset.floor = floor
    document.documentElement.dataset.theme = 'dark'
    // Skin kartek: 'tainted' = ciemne splugawione (DOMYŚLNIE), 'normal' = jasny pergamin.
    const cards = localStorage.getItem('idx_cards') === 'normal' ? 'normal' : 'tainted'
    document.documentElement.dataset.cards = cards
    // Mucha DOMYŚLNIE wyłączona — włącza się tylko gdy user ją zapisał jako 'on'.
    const fly = localStorage.getItem('idx_fly') === 'on' ? 'on' : 'off'
    document.documentElement.dataset.fly = fly
  }, [])
  return null
}
