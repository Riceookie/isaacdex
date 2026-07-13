import type { SpriteName } from '@/components/Sprite'

/** Pozycje nawigacji — współdzielone przez sidebar i pasek tytułu (zakładka). */
export type NavItem = {
  href: string
  label: string
  icon: SpriteName
  /** Kolor akcentu ikony (drobny glow) — tylko kluczowe pozycje, reszta szara. */
  accent?: string
}

export const NAV: NavItem[] = [
  { href: '/', label: 'Pulpit', icon: 'dadsnote', accent: '#e5544b' },
  { href: '/profil', label: 'Profil', icon: 'isaacHead' },
  // Strona pokazuje achievementy Steam, więc „Osiągnięcia" (dawniej myląca „Kolekcja").
  { href: '/kolekcja', label: 'Osiągnięcia', icon: 'trophy', accent: '#e0b64c' },
  // Encyklopedia zastąpiła Doradcę — ten jest teraz jej sekcją „Przedmioty".
  { href: '/encyklopedia', label: 'Encyklopedia', icon: 'book' },
  { href: '/kalkulator', label: 'Kalkulator', icon: 'stats' },
  { href: '/statystyki', label: 'Statystyki', icon: 'kidsdrawing' },
  { href: '/znajomi', label: 'Znajomi', icon: 'friendfinder', accent: '#5bbf6a' },
  { href: '/czat', label: 'Czat', icon: 'friends', accent: '#e5544b' },
  { href: '/ustawienia', label: 'Ustawienia', icon: 'superfan' },
]

/** Tytuł sekcji dla podanej ścieżki (dla papierowej zakładki na górze). */
export function tytulSekcji(pathname: string): string {
  // Edycja profilu należy do sekcji „Profil".
  if (pathname.startsWith('/kim-jestem')) return 'Profil'
  // najdłuższy pasujący prefiks (żeby /profil/[postac] też trafiało w „Profil")
  const match = NAV.filter((n) => n.href !== '/' && pathname.startsWith(n.href)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0]
  if (match) return match.label
  return 'Pulpit'
}
