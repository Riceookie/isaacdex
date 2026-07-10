'use client'

import { useEffect, useState } from 'react'
import DecorMark from '@/components/DecorMark'
import { DEFAULT_DECOR, type DecorId } from '@/lib/pfpDecor'

/**
 * Avatar profilu = własny obraz z pliku (localStorage) albo fallback (głowa postaci),
 * z opcjonalną dekoracją pfp (mucha/pająk/krew…) przypiętą w rogu. Dekoracja pojawia
 * się wszędzie, gdzie renderowany jest avatar. Kontener musi być position:relative.
 */
export default function ProfileAvatar({
  fallbackSrc,
  className = 'avatar-img',
}: {
  fallbackSrc: string
  className?: string
}) {
  const [custom, setCustom] = useState<string | null>(null)
  const [decor, setDecor] = useState<DecorId>(DEFAULT_DECOR)

  useEffect(() => {
    const odswiez = () => {
      setCustom(localStorage.getItem('idx_avatar'))
      setDecor((localStorage.getItem('idx_pfp_decor') as DecorId) || DEFAULT_DECOR)
    }
    odswiez()
    window.addEventListener('idx-avatar', odswiez)
    window.addEventListener('idx-decor', odswiez)
    return () => {
      window.removeEventListener('idx-avatar', odswiez)
      window.removeEventListener('idx-decor', odswiez)
    }
  }, [])

  return (
    <>
      <img className={className} src={custom || fallbackSrc} alt="" draggable={false} />
      <DecorMark id={decor} />
    </>
  )
}
