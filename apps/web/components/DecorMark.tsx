import { getDecor, type DecorId } from '@/lib/pfpDecor'

// Prezentacyjny render dekoracji ramki pfp — czysto z id (BEZ localStorage).
// Overlay = pełna nakładka na ramkę; sprite pozycjonowany = pojedynczy obrazek w rogu.
// Używany przez ProfileAvatar (dekoracja utrwalona) i podgląd w edytorze/pickerze.
export default function DecorMark({ id }: { id: DecorId }) {
  const d = getDecor(id)
  if (d.id === 'none') return null

  if (d.overlay) {
    return (
      <img className="pfp-overlay" src={d.overlay} alt="" aria-hidden="true" draggable={false} />
    )
  }

  const pos = d.pos ?? 'br'
  return (
    <span className={`pfp-decor pos-${pos}`} aria-hidden="true">
      <img className="sprite" src={d.src} alt="" draggable={false} />
    </span>
  )
}
