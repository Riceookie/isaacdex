// packages/core — logika biznesowa IsaacDex ("serce aplikacji").
//
// Zadanie 2/3 (fundament): doradca itemów wg jakości + liczenie postępu.
// Pełna logika (reguły synergii/pułapek, statystyki, streak) dojdzie w zadaniu 4.

/** Jakość itemu w The Binding of Isaac: 0 (najsłabszy) – 4 (najlepszy). */
export type Jakosc = 0 | 1 | 2 | 3 | 4

export type OcenaItemu = {
  rekomendacja: 'BIERZ' | 'ZWYKLE_WARTO' | 'SYTUACYJNIE' | 'RACZEJ_POMIN' | 'UWAGA'
  powod: string
}

/**
 * Doradca „brać czy zostawić" — na razie w oparciu o jakość itemu (0–4).
 * W zadaniu 4 dojdą reguły synergii i znane pułapki.
 * @example ocenItem(4) // { rekomendacja: 'BIERZ', ... }
 */
export function ocenItem(jakosc: Jakosc): OcenaItemu {
  switch (jakosc) {
    case 4:
      return { rekomendacja: 'BIERZ', powod: 'Jakość 4 — prawie zawsze wzmacnia run, bierz w ciemno.' }
    case 3:
      return { rekomendacja: 'ZWYKLE_WARTO', powod: 'Jakość 3 — solidny item, zwykle warto.' }
    case 2:
      return { rekomendacja: 'SYTUACYJNIE', powod: 'Jakość 2 — zależy od buildu.' }
    case 1:
      return { rekomendacja: 'RACZEJ_POMIN', powod: 'Jakość 1 — słaby, bierz gdy pusto.' }
    case 0:
      return { rekomendacja: 'UWAGA', powod: 'Jakość 0 — może rozwodnić pulę lub zepsuć run.' }
  }
}

/** Procent ukończenia = odblokowane / wszystkie (0–100, zaokrąglony). */
export function procentUkonczenia(odblokowane: number, wszystkie: number): number {
  if (wszystkie <= 0) return 0
  return Math.round((odblokowane / wszystkie) * 100)
}
