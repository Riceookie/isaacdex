'use client'

import { useEffect, useRef, useState } from 'react'
import ItemSprite from '@/components/ItemSprite'
import { useT } from '@/components/JezykProvider'

// Kilkanaście kultowych itemów do wyboru (mają sprite'y w public/tboi/items).
const DO_WYBORU = [
  'Sacred Heart',
  'Brimstone',
  'Tech X',
  'Ipecac',
  'Polyphemus',
  "Mom's Knife",
  'Epic Fetus',
  'Incubus',
  'Godhead',
  'Sacred Orb',
  'The D6',
  'Magic Mushroom',
  'Mega Blast',
  'Dr. Fetus',
  "Cricket's Head",
  'Spoon Bender',
]

/** Ulubiony item (preferencja lokalna, jak avatar/companion). Klik = zmiana z listy. */
export default function FavItemBadge() {
  const t = useT()
  const [item, setItem] = useState('Sacred Heart')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const s = localStorage.getItem('idx_fav_item')
    if (s) setItem(s)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', onDoc)
    return () => window.removeEventListener('pointerdown', onDoc)
  }, [open])

  function wybierz(n: string) {
    setItem(n)
    localStorage.setItem('idx_fav_item', n)
    setOpen(false)
  }

  return (
    <span className="fav-item" ref={ref}>
      <button
        type="button"
        className="badge fav-item-btn"
        onClick={() => setOpen((v) => !v)}
        title={t('profil.ulubionyItemZmien')}
        aria-expanded={open}
      >
        <ItemSprite nazwa={item} size={20} /> {t('profil.ulubionyItemEtykieta', { nazwa: item })}
      </button>
      {open && (
        <div className="fav-item-pop" role="menu">
          {DO_WYBORU.map((n) => (
            <button
              key={n}
              type="button"
              className={'fav-opt' + (n === item ? ' on' : '')}
              onClick={() => wybierz(n)}
              title={n}
              role="menuitem"
            >
              <ItemSprite nazwa={n} size={30} />
            </button>
          ))}
        </div>
      )}
    </span>
  )
}
