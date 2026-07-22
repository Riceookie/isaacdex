import Sprite from '@/components/Sprite'

/**
 * Ikona „Curse of the Blind" (zasłanianie słów). Motyw-zależna: na jasnych (normalnych)
 * kartkach pokazuje Curse of the Blind, na ciemnych (tainted) — Curse of Darkness, bo
 * ciemny skin to „mroczna" odsłona apki. Przełączane CSS-em po `data-cards` na <html>,
 * więc działa i w komponentach serwerowych, i klienckich (bez czytania localStorage).
 */
export default function IkonaKlatwy({ size = 22 }: { size?: number }) {
  return (
    <>
      <Sprite name="curseblind" size={size} className="klatwa-jasna" />
      <Sprite name="cursedarkness" size={size} className="klatwa-ciemna" />
    </>
  )
}
