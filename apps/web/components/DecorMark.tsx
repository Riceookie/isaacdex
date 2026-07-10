import { getDecor, type DecorId } from '@/lib/pfpDecor'

// Prezentacyjny znacznik dekoracji pfp (sprite z gry albo odręczne doodle).
// Czysto na podstawie przekazanego id — BEZ localStorage (używa go ProfileAvatar,
// który czyta preferencję, oraz podgląd w edytorze, który pokazuje wartość roboczą).
export default function DecorMark({
  id,
  className = 'pfp-decor',
}: {
  id: DecorId
  className?: string
}) {
  const d = getDecor(id)
  if (d.id === 'none') return null

  if (d.d) {
    return (
      <span className={`${className} is-doodle`} aria-hidden="true">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={d.d} />
        </svg>
      </span>
    )
  }

  return (
    <span className={className} aria-hidden="true">
      <img className="sprite" src={d.src} alt="" draggable={false} />
    </span>
  )
}
