import { getDecor, type DecorId } from '@/lib/pfpDecor'

// Prezentacyjny render dekoracji ramki pfp — czysto z id (BEZ localStorage).
// Każda dekoracja to nakładka na wspólnej kanwie; pozycję/skalę/kontr-obrót robi CSS
// (.pfp-overlay), więc tu wystarczy wstawić obrazek.
// Używany przez ProfileAvatar (dekoracja utrwalona) i podgląd w edytorze/pickerze.
export default function DecorMark({ id }: { id: DecorId }) {
  const d = getDecor(id)
  if (!d.overlay) return null

  return <img className="pfp-overlay" src={d.overlay} alt="" aria-hidden="true" draggable={false} />
}
