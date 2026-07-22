'use client'

import { useEffect } from 'react'

/**
 * Motyw Sekretnego Pokoju — leci w tle, dopóki jesteś na /sekret, i cichnie, gdy wyjdziesz.
 *
 * Przeglądarki blokują autoodtwarzanie dźwięku bez gestu, ale do sekretu wchodzi się
 * KLIKNIĘCIEM w dziurę, więc próba `play()` przy wejściu zwykle przechodzi. Gdyby jednak
 * została odrzucona (np. wejście prosto z adresu), podpinamy jednorazowy nasłuch na pierwszy
 * gest i wtedy startujemy — muzyka nigdy nie zawiesza strony, w najgorszym razie jest cicho.
 */
export default function SekretMuzyka() {
  useEffect(() => {
    const audio = new Audio('/tboi/sfx/secret-theme.ogg')
    audio.loop = true
    audio.volume = 0.3

    let sprzatnietoGest: (() => void) | null = null

    const graj = () => audio.play()

    graj().catch(() => {
      // Autoplay zablokowany — poczekaj na pierwszy gest gdziekolwiek na stronie.
      const naGest = () => {
        void audio.play().catch(() => {})
      }
      window.addEventListener('pointerdown', naGest, { once: true })
      window.addEventListener('keydown', naGest, { once: true })
      sprzatnietoGest = () => {
        window.removeEventListener('pointerdown', naGest)
        window.removeEventListener('keydown', naGest)
      }
    })

    return () => {
      sprzatnietoGest?.()
      audio.pause()
      audio.src = ''
    }
  }, [])

  return null
}
