import type { CSSProperties } from 'react'
import { itemSpritePath, itemSpritePathById } from '@/lib/itemSprite'

type Props = {
  nazwa: string
  /** id kolekcjonerskie z gry (Item.idW) — pewne dopasowanie, ma pierwszeństwo nad nazwą. */
  idW?: number | null
  typ?: string
  size?: number
  className?: string
  style?: CSSProperties
}

/**
 * Ikona itemu z The Binding of Isaac (public/tboi/items). Dobiera sprite po idW
 * (najpewniej), a gdy brak — po nazwie. Dekoracyjna (nazwa jest obok jako tekst).
 */
export default function ItemSprite({ nazwa, idW, typ, size = 32, className, style }: Props) {
  const src = itemSpritePathById(idW, typ) ?? itemSpritePath(nazwa)
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={'sprite item-sprite' + (className ? ' ' + className : '')}
      style={style}
      aria-hidden
      draggable={false}
    />
  )
}
