'use client'

import { useEffect, useState } from 'react'
import { COMPANIONS, companionZId, DOMYSLNY_COMPANION } from '@/lib/companions'
import { useT } from '@/components/JezykProvider'

/**
 * Wybór companiona (maskotki): duży podgląd wybranego + siatka do zmiany. Zapis w localStorage
 * i event `idx-companion` — TopBar od razu podmienia sprite'a i maskotka się przedstawia,
 * więc wybór „widać" w całej apce, nie tylko tutaj.
 */
export default function CompanionPicker() {
  const t = useT()
  const [sel, setSel] = useState(DOMYSLNY_COMPANION.id)

  useEffect(() => {
    setSel(localStorage.getItem('idx_companion') || DOMYSLNY_COMPANION.id)
  }, [])

  function wybierz(id: string) {
    setSel(id)
    localStorage.setItem('idx_companion', id)
    window.dispatchEvent(new Event('idx-companion'))
  }

  const wybrany = companionZId(sel)

  return (
    <div className="companion-wybor">
      {/* Podgląd: kogo aktualnie masz w pasku. */}
      <div className="comp-preview">
        <div className="comp-preview-scena">
          <img src={`/tboi/${wybrany.file}`} alt="" draggable={false} />
        </div>
        <div className="comp-preview-info">
          <span className="muted small">{t('companion.wyborTwojTowarzysz')}</span>
          <b>{wybrany.nazwa}</b>
          <span className="muted small">{t('companion.wyborOpisTowarzysza')}</span>
        </div>
      </div>

      <div className="companion-picker">
        {COMPANIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={'comp-opt' + (sel === c.id ? ' on' : '')}
            onClick={() => wybierz(c.id)}
            title={c.nazwa}
            aria-pressed={sel === c.id}
          >
            <img src={`/tboi/${c.file}`} alt="" draggable={false} />
            <span>{c.nazwa}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
