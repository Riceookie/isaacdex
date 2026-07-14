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

/**
 * Avatar gracza. Pole `Gracz.avatar` trzyma albo nazwę postaci („Isaac"), albo — od teraz —
 * gotową ścieżkę do własnego obrazka („/pfp/spike.png"). Ścieżkę przepuszczamy bez zmian,
 * resztę mapujemy na głowę postaci jak dotąd.
 */
export function avatarGracza(avatar: string | null | undefined, fallback = 'Isaac'): string {
  const a = avatar?.trim()
  if (!a) return ikonaPostaci(fallback)
  return a.startsWith('/') || a.startsWith('http') ? a : ikonaPostaci(a)
}

/** Czy avatar to własny obrazek (a nie pixelowa głowa) — własne trzeba kadrować i wygładzać. */
export function wlasnyAvatar(avatar: string | null | undefined): boolean {
  const a = avatar?.trim() ?? ''
  return a.startsWith('/') || a.startsWith('http')
}
