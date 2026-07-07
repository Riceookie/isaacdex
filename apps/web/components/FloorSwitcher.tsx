'use client'

import { useEffect, useState } from 'react'

const PIETRA = [
  { id: 'basement', nazwa: 'Basement' },
  { id: 'cellar', nazwa: 'Cellar' },
  { id: 'caves', nazwa: 'Caves' },
  { id: 'catacombs', nazwa: 'Catacombs' },
  { id: 'flooded', nazwa: 'Flooded Caves' },
  { id: 'depths', nazwa: 'Depths' },
  { id: 'necropolis', nazwa: 'Necropolis' },
  { id: 'womb', nazwa: 'Womb' },
  { id: 'sheol', nazwa: 'Sheol' },
  { id: 'cathedral', nazwa: 'Cathedral' },
  { id: 'chest', nazwa: 'Chest' },
  { id: 'void', nazwa: 'The Void' },
] as const

type Floor = (typeof PIETRA)[number]['id']

export default function FloorSwitcher() {
  const [floor, setFloor] = useState<Floor>('basement')
  const [fly, setFly] = useState(true)

  useEffect(() => {
    const zapisaneFloor = (localStorage.getItem('idx_floor') as Floor) || 'basement'
    setFloor(zapisaneFloor)
    document.documentElement.dataset.floor = zapisaneFloor

    const flyOn = localStorage.getItem('idx_fly') === 'on'
    setFly(flyOn)
    document.documentElement.dataset.fly = flyOn ? 'on' : 'off'
  }, [])

  function wybierzFloor(f: Floor) {
    setFloor(f)
    document.documentElement.dataset.floor = f
    localStorage.setItem('idx_floor', f)
  }

  function toggleFly() {
    const on = !fly
    setFly(on)
    document.documentElement.dataset.fly = on ? 'on' : 'off'
    localStorage.setItem('idx_fly', on ? 'on' : 'off')
  }

  return (
    <div className="controls">
      <div className="floors" title="Zmień piętro (motyw)">
        {PIETRA.map((p) => (
          <button
            key={p.id}
            className={'floor-dot ' + p.id + (floor === p.id ? ' active' : '')}
            onClick={() => wybierzFloor(p.id)}
            aria-label={p.nazwa}
            data-tip={p.nazwa}
          />
        ))}
      </div>
      <button
        className={'fly-toggle' + (fly ? '' : ' off')}
        onClick={toggleFly}
        aria-pressed={fly}
        data-tip={fly ? 'Wyłącz muchę' : 'Włącz muchę'}
      >
        🪰
      </button>
    </div>
  )
}
