'use client'

import { useEffect, useState } from 'react'

/** Avatar profilu = własny obraz z pliku (localStorage) albo fallback (głowa postaci). */
export default function ProfileAvatar({
  fallbackSrc,
  className = 'avatar-img',
}: {
  fallbackSrc: string
  className?: string
}) {
  const [custom, setCustom] = useState<string | null>(null)

  useEffect(() => {
    setCustom(localStorage.getItem('idx_avatar'))
    const onChange = () => setCustom(localStorage.getItem('idx_avatar'))
    window.addEventListener('idx-avatar', onChange)
    return () => window.removeEventListener('idx-avatar', onChange)
  }, [])

  return <img className={className} src={custom || fallbackSrc} alt="" draggable={false} />
}
