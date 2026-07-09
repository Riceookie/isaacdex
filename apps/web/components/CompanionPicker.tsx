'use client'

import { useEffect, useState } from 'react'
import { COMPANIONS, DOMYSLNY_COMPANION } from '@/lib/companions'

/** Wybór companiona (maskotki) — zapis w localStorage, natychmiastowy podgląd. */
export default function CompanionPicker() {
  const [sel, setSel] = useState(DOMYSLNY_COMPANION.id)

  useEffect(() => {
    setSel(localStorage.getItem('idx_companion') || DOMYSLNY_COMPANION.id)
  }, [])

  function wybierz(id: string) {
    setSel(id)
    localStorage.setItem('idx_companion', id)
    window.dispatchEvent(new Event('idx-companion'))
  }

  return (
    <div className="companion-picker">
      {COMPANIONS.map((c) => (
        <button
          key={c.id}
          type="button"
          className={'comp-opt' + (sel === c.id ? ' on' : '')}
          onClick={() => wybierz(c.id)}
          title={c.nazwa}
        >
          <img src={`/tboi/${c.file}`} alt="" draggable={false} />
          <span>{c.nazwa}</span>
        </button>
      ))}
    </div>
  )
}
