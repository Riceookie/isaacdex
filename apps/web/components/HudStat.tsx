import type { ReactNode } from 'react'
import Sprite, { type SpriteName } from '@/components/Sprite'

type Props = {
  icon: SpriteName
  value: ReactNode
  label: string
  size?: number
}

/** Chip statystyki w stylu HUD-a Isaaca: ikona pickupa + liczba + podpis. */
export default function HudStat({ icon, value, label, size = 28 }: Props) {
  return (
    <div className="hud-stat">
      <Sprite name={icon} size={size} />
      <span className="hud-stat-num">{value}</span>
      <span className="hud-stat-label">{label}</span>
    </div>
  )
}
