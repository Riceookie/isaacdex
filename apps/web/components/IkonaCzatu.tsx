import Sprite, { NAZWY_SPRITEOW, type SpriteName } from '@/components/Sprite'
import { naklejka } from '@/lib/naklejki'

/**
 * Ikona reakcji/naklejki po jej identyfikatorze — jedno miejsce, które wie, że w czacie
 * żyją DWA rodzaje identyfikatorów:
 *
 *  - nazwa sprite'a interfejsu (`heart`, `coin`) — tak wyglądają starsze reakcje w bazie
 *    i domyślna czwórka pod przyciskiem „+",
 *  - token naklejki (`c105`, `t1`, `predheart`) — komplet itemów/trinketów/pickupów.
 *
 * Nieznany identyfikator nie renderuje nic zamiast wywalać widok: reakcja mogła zostać
 * dodana wersją, która znała ikonę usuniętą później z katalogu.
 */
export default function IkonaCzatu({
  id,
  size = 14,
  className,
}: {
  id: string
  size?: number
  className?: string
}) {
  if ((NAZWY_SPRITEOW as string[]).includes(id)) {
    return <Sprite name={id as SpriteName} size={size} className={className} />
  }

  const n = naklejka(id)
  if (!n) return null

  return (
    <img
      src={n.src}
      alt=""
      title={n.nazwa}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={'sprite' + (className ? ' ' + className : '')}
      aria-hidden
      draggable={false}
    />
  )
}
