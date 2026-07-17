/**
 * Głos companiona: sposób, w jaki dowolna strona może kazać maskotce z TopBara powiedzieć
 * coś konkretnego — i z jaką MINĄ. Dzięki temu w apce jest JEDEN familiar (ten na górze),
 * a nie osobny zwierzak w każdej sekcji, a mimo to reaguje na to, co się dzieje.
 *
 * Idzie to eventem na `window`, a nie kontekstem/propsem, bo TopBar i treść strony to dwa
 * niezależne poddrzewa Reacta — nie mają wspólnego rodzica, przez który dałoby się to przekazać.
 */

/** Mina maskotki: neutralna, radosna, smutna, podekscytowana, w zamyśleniu. Steruje animacją sprite'a. */
export type Nastroj = 'zwykly' | 'happy' | 'sad' | 'excited' | 'thinking'

export type GlosWtret = { tekst: string; nastroj: Nastroj }

const KANAL = 'idx-companion-mow'

export function powiedz(tekst: string, nastroj: Nastroj = 'zwykly') {
  window.dispatchEvent(new CustomEvent<GlosWtret>(KANAL, { detail: { tekst, nastroj } }))
}

export function nasluchujGlosu(handler: (w: GlosWtret) => void): () => void {
  const on = (e: Event) => handler((e as CustomEvent<GlosWtret>).detail)
  window.addEventListener(KANAL, on)
  return () => window.removeEventListener(KANAL, on)
}
