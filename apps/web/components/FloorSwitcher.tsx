'use client'

import { useEffect, useState } from 'react'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'

// Akcent apki jest stały (czerwony), więc zostaje tylko przełącznik kursora-muchy.
export default function FloorSwitcher() {
  const [fly, setFly] = useState(false)
  const t = useT()

  useEffect(() => {
    const flyOn = localStorage.getItem('idx_fly') === 'on'
    setFly(flyOn)
    document.documentElement.dataset.fly = flyOn ? 'on' : 'off'
  }, [])

  function toggleFly() {
    const on = !fly
    setFly(on)
    document.documentElement.dataset.fly = on ? 'on' : 'off'
    localStorage.setItem('idx_fly', on ? 'on' : 'off')
  }

  return (
    <div className="controls">
      <button
        className={'fly-toggle' + (fly ? '' : ' off')}
        onClick={toggleFly}
        aria-pressed={fly}
        data-tip={t(fly ? 'nawigacja.wylaczMuche' : 'nawigacja.wlaczMuche')}
      >
        <Sprite name="fly" size={22} /> {t(fly ? 'nawigacja.muchaWl' : 'nawigacja.muchaWyl')}
      </button>
    </div>
  )
}
