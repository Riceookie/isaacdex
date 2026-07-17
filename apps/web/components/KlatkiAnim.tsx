import type { CSSProperties } from 'react'

/**
 * Nazwana dwuklatkowa animacja Isaaca (public/anim/<nazwa>1.png + <nazwa>2.png), migająca
 * co 0.7 s. Rysunek wchodzi jako maska (kształt z alfy), więc bierze kolor z `currentColor`
 * i dopasowuje się do motywu. W odróżnieniu od IsaacAnim nie losuje — pokazuje KONKRETNĄ.
 */
export default function KlatkiAnim({
  nazwa,
  className,
  style,
}: {
  nazwa: string
  className?: string
  style?: CSSProperties
}) {
  const maska = (n: number): CSSProperties => ({
    WebkitMaskImage: `url('/anim/${nazwa}${n}.png')`,
    maskImage: `url('/anim/${nazwa}${n}.png')`,
  })
  return (
    <span className={'ianim' + (className ? ' ' + className : '')} style={style} aria-hidden>
      <span className="ianim-frame ianim-a" style={maska(1)} />
      <span className="ianim-frame ianim-b" style={maska(2)} />
    </span>
  )
}
