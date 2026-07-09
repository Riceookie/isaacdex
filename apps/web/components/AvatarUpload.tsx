'use client'

import { useEffect, useRef, useState } from 'react'

const MAX = 512 // px — avatar skalowany do kwadratu, żeby localStorage nie puchł

/** Wybór własnego avatara z pliku → skaluje do data URL i zapisuje w localStorage. */
export default function AvatarUpload({ fallbackSrc }: { fallbackSrc: string }) {
  const [custom, setCustom] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCustom(localStorage.getItem('idx_avatar'))
  }, [])

  function zapisz(dataUrl: string | null) {
    if (dataUrl) localStorage.setItem('idx_avatar', dataUrl)
    else localStorage.removeItem('idx_avatar')
    setCustom(dataUrl)
    window.dispatchEvent(new Event('idx-avatar'))
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Przeskaluj do kwadratu MAX×MAX (crop do środka), żeby oszczędzić miejsce.
        const canvas = document.createElement('canvas')
        canvas.width = MAX
        canvas.height = MAX
        const ctx = canvas.getContext('2d')!
        const side = Math.min(img.width, img.height)
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          0,
          0,
          MAX,
          MAX,
        )
        zapisz(canvas.toDataURL('image/webp', 0.85))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="avatar-upload">
      <div className="avatar-box av-preview pfp-frame">
        <img className="avatar-img" src={custom || fallbackSrc} alt="Podgląd avatara" />
      </div>
      <div className="avatar-upload-btns">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          style={{ display: 'none' }}
        />
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          Wybierz obraz…
        </button>
        {custom && (
          <button type="button" className="chip" onClick={() => zapisz(null)}>
            Usuń (wróć do postaci)
          </button>
        )}
      </div>
      <p className="small muted">Obraz zapisuje się w Twojej przeglądarce.</p>
    </div>
  )
}
