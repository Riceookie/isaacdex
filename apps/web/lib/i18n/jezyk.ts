/**
 * Język interfejsu — wybór między angielskim (domyślny) a polskim.
 *
 * Trzymamy go w CIASTECZKU, nie w localStorage jak skin kartek czy kursor. Powód: prawie
 * cała apka to komponenty serwerowe (profil, encyklopedia, ustawienia renderują się na
 * serwerze), a serwer nie widzi localStorage. Ciasteczko leci z każdym żądaniem, więc
 * pierwszy render wychodzi od razu w dobrym języku — bez mignięcia polskim tekstem
 * i bez hydration mismatch.
 */

export const JEZYKI = ['en', 'pl'] as const
export type Jezyk = (typeof JEZYKI)[number]

/** Angielski jest domyślny — apka ma trafiać szerzej niż do polskich graczy. */
export const JEZYK_DOMYSLNY: Jezyk = 'en'

export const CIASTECZKO_JEZYKA = 'idx_lang'

/** Rok — wybór języka to nie sesja, ma przeżyć zamknięcie przeglądarki. */
export const MAKS_WIEK_JEZYKA = 60 * 60 * 24 * 365

export function czyJezyk(x: unknown): x is Jezyk {
  return typeof x === 'string' && (JEZYKI as readonly string[]).includes(x)
}

/** Nazwy własne języków — zawsze w SWOIM języku, nie tłumaczone. */
export const NAZWY_JEZYKOW: Record<Jezyk, string> = {
  en: 'English',
  pl: 'Polski',
}
