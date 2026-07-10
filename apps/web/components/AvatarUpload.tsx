'use client'

import { useRef } from 'react'
import DecorMark from '@/components/DecorMark'
import type { DecorId } from '@/lib/pfpDecor'

const MAX = 512 // px — avatar skalowany do kwadratu, żeby localStorage nie puchł

/**
 * Wybór własnego avatara z pliku → skaluje do data URL. KONTROLOWANY: nie zapisuje
 * niczego sam, tylko zgłasza wybór przez `onPick` (rodzic – edytor profilu – trzyma
 * wartość roboczą i utrwala ją dopiero po kliknięciu „Zapisz"). Podgląd pokazuje też
 * wybraną dekorację pfp, żeby było widać, jak avatar wygląda po zapisie.
 */
export default function AvatarUpload({
  fallbackSrc,
  value,
  onPick,
  decor,
}: {
  fallbackSrc: string
  value: string | null
  onPick: (dataUrl: string | null) => void
  decor: DecorId
}) {
  const inputRef = useRef<HTMLInputElement>(null)

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
        onPick(canvas.toDataURL('image/webp', 0.85))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="avatar-upload">
      <div className="avatar-box av-preview pfp-frame">
        <img className="avatar-img" src={value || fallbackSrc} alt="Podgląd avatara" />
        <DecorMark id={decor} />
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
        {value && (
          <button type="button" className="chip" onClick={() => onPick(null)}>
            Usuń (wróć do postaci)
          </button>
        )}
      </div>
      <p className="small muted">Zapisuje się po kliknięciu „Zapisz profil".</p>
    </div>
  )
}
