'use client'

import { useEffect } from 'react'

/**
 * Dżingiel „secret found" na ekranie nagrody — leci RAZ, gdy Shopkeeper podnosi wzrok
 * (świeże odkrycie, `?ok=1`). Ten sam dźwięk co przy rozbiciu ściany, więc odkrycie ma
 * klamrę: pękła ściana → tu Shopkeeper cię widzi.
 *
 * Na /sekret wchodzi się kliknięciem (gest), więc autoplay zwykle przejdzie; gdyby
 * przeglądarka odmówiła — po cichu odpuszczamy, sekret nie może się wywalić przez brak dźwięku.
 * Motyw pokoju (SekretMuzyka) leci równolegle w tle; to jednorazowy sting na wierzchu.
 */
export default function SekretSukcesDzwiek() {
  useEffect(() => {
    try {
      const a = new Audio('/tboi/sfx/secret-found.ogg')
      a.volume = 0.5
      void a.play().catch(() => {})
    } catch {
      /* brak Audio (SSR/edge) — trudno, lecimy dalej bez dźwięku */
    }
  }, [])
  return null
}
