// Nazwa postaci → slug pliku ikony (spójne z pobranymi plikami w public/tboi/chars).
export function slugPostaci(nazwa: string): string {
  return (
    nazwa
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'q'
  )
}

/** Czy to postać splugawiona (Tainted …). */
export function jestTainted(nazwa: string): boolean {
  return nazwa.startsWith('Tainted ')
}

export function ikonaPostaci(nazwa: string): string {
  if (jestTainted(nazwa)) {
    // Splugawione głowy = przyciemnione warianty bazowych (tainted-<slug>.png).
    const base = nazwa.slice('Tainted '.length)
    return `/tboi/chars/tainted-${slugPostaci(base)}.png`
  }
  return `/tboi/chars/${slugPostaci(nazwa)}.webp`
}
