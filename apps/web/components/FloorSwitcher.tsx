'use client'

import { useEffect, useState } from 'react'

const PIETRA = [
  { id: 'basement', nazwa: 'Basement' },
  { id: 'caves', nazwa: 'Caves' },
  { id: 'depths', nazwa: 'Depths' },
  { id: 'blood', nazwa: 'Blood' },
] as const

type Floor = (typeof PIETRA)[number]['id']

export default function FloorSwitcher() {
  const [floor, setFloor] = useState<Floor>('basement')

  useEffect(() => {
    const zapisane = (localStorage.getItem('idx_floor') as Floor) || 'basement'
    setFloor(zapisane)
    document.documentElement.dataset.floor = zapisane
  }, [])

  function wybierz(f: Floor) {
    setFloor(f)
    document.documentElement.dataset.floor = f
    localStorage.setItem('idx_floor', f)
  }

  return (
    <div className="floors" title="Zmień piętro (motyw)">
      {PIETRA.map((p) => (
        <button
          key={p.id}
          className={'floor-dot ' + p.id + (floor === p.id ? ' active' : '')}
          onClick={() => wybierz(p.id)}
          aria-label={p.nazwa}
          data-tip={p.nazwa}
        />
      ))}
    </div>
  )
}
