// Nazwa postaci → slug pliku ikony (spójne z pobranymi plikami w public/tboi/chars).
export function slugPostaci(nazwa: string): string {
  return (
    nazwa
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'q'
  )
}

export function ikonaPostaci(nazwa: string): string {
  return `/tboi/chars/${slugPostaci(nazwa)}.webp`
}
