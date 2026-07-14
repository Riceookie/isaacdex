/**
 * Głos companiona: sposób, w jaki dowolna strona może kazać maskotce z TopBara powiedzieć
 * coś konkretnego. Dzięki temu w apce jest JEDEN familiar (ten na górze), a nie osobny
 * zwierzak w każdej sekcji.
 *
 * Idzie to eventem na `window`, a nie kontekstem/propsem, bo TopBar i treść strony to dwa
 * niezależne poddrzewa Reacta — nie mają wspólnego rodzica, przez który dałoby się to przekazać.
 */

const KANAL = 'idx-companion-mow'

export function powiedz(tekst: string) {
  window.dispatchEvent(new CustomEvent<string>(KANAL, { detail: tekst }))
}

export function nasluchujGlosu(handler: (tekst: string) => void): () => void {
  const on = (e: Event) => handler((e as CustomEvent<string>).detail)
  window.addEventListener(KANAL, on)
  return () => window.removeEventListener(KANAL, on)
}
