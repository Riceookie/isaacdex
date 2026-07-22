'use client'

import { useEffect } from 'react'

/**
 * Motyw Sekretnego Pokoju — leci w tle, dopóki jesteś na /sekret, i cichnie, gdy wyjdziesz.
 *
 * Gramy przez Web Audio API (a nie `<audio loop>`), bo pętla `<audio>` robi słyszalną DZIURĘ
 * na zawinięciu — `AudioBufferSourceNode.loop` zapętla próbka-w-próbkę, więc motyw chodzi
 * gładko w kółko. Głośność trzyma GainNode.
 *
 * Przeglądarki blokują dźwięk bez gestu, ale do sekretu wchodzi się KLIKNIĘCIEM w dziurę,
 * więc kontekst zwykle wstaje od razu. Gdyby wstał wstrzymany (np. wejście prosto z adresu),
 * wznawiamy go przy pierwszym geście — w najgorszym razie jest chwilę cicho, nic się nie psuje.
 */
export default function SekretMuzyka() {
  useEffect(() => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return

    const ctx = new Ctx()
    const gain = ctx.createGain()
    gain.gain.value = 0.3
    gain.connect(ctx.destination)

    let source: AudioBufferSourceNode | null = null
    let zerwane = false

    fetch('/tboi/sfx/secret-theme.ogg')
      .then((r) => r.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((audioBuf) => {
        if (zerwane) return
        source = ctx.createBufferSource()
        source.buffer = audioBuf
        source.loop = true // pętla próbka-w-próbkę = brak dziury na zawinięciu
        source.connect(gain)
        source.start()
      })
      .catch(() => {})

    // Kontekst wstrzymany bez gestu → wznów od razu, a jak się nie da, przy pierwszym geście.
    const wznow = () => {
      if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
    }
    wznow()
    window.addEventListener('pointerdown', wznow)
    window.addEventListener('keydown', wznow)

    return () => {
      zerwane = true
      window.removeEventListener('pointerdown', wznow)
      window.removeEventListener('keydown', wznow)
      try {
        source?.stop()
      } catch {
        /* mogło jeszcze nie wystartować — nieważne */
      }
      void ctx.close().catch(() => {})
    }
  }, [])

  return null
}
