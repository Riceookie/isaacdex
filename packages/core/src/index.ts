// packages/core — logika biznesowa PizzaFlow ("serce aplikacji").
//
// Zadanie 2 (fundament): startowa reguła wyceny koszyka + formatowanie ceny.
// Pełna logika (dostępność ze stanów magazynowych, maszyna statusów zamówienia,
// promocje) dojdzie w zadaniu 4 — tu pokazujemy, że pakiet buduje się w monorepo
// i jest używany przez aplikację (apps/api).

/** Pojedyncza pozycja w koszyku klienta. */
export type PozycjaKoszyka = {
  nazwa: string
  /** cena jednostkowa w złotych */
  cena: number
  ilosc: number
}

/**
 * Suma wartości koszyka (na razie bez promocji — te dojdą w zadaniu 4).
 * @example wyliczSume([{ nazwa: 'Margherita', cena: 28, ilosc: 2 }]) // 56
 */
export function wyliczSume(pozycje: PozycjaKoszyka[]): number {
  return pozycje.reduce((suma, p) => suma + p.cena * p.ilosc, 0)
}

/** Formatuje kwotę w złotych, np. 56 -> "56,00 zł". */
export function formatPLN(kwota: number): string {
  return kwota.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })
}
