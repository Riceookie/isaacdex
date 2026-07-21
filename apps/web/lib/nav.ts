import type { SpriteName } from '@/components/Sprite'
import type { Klucz } from '@/lib/i18n/slownik'

/** Pozycje nawigacji — współdzielone przez sidebar i pasek tytułu (zakładka). */
export type NavItem = {
  href: string
  /**
   * KLUCZ słownika, nie gotowa etykieta: tę samą pozycję renderuje sidebar i zakładka tytułu,
   * a język zna dopiero tłumacz w komponencie. Nazwy sekcji stoją we `wspolne`, bo pojawiają
   * się też poza samym menu (odnośniki w tekstach, puste stany).
   */
  klucz: Klucz
  icon: SpriteName
  /** Kolor akcentu ikony (drobny glow) — tylko kluczowe pozycje, reszta szara. */
  accent?: string
}

export const NAV: NavItem[] = [
  { href: '/', klucz: 'wspolne.navPulpit', icon: 'dadsnote', accent: '#e5544b' },
  { href: '/profil', klucz: 'wspolne.navProfil', icon: 'isaacHead' },
  // Strona pokazuje achievementy Steam, więc „Osiągnięcia" (dawniej myląca „Kolekcja").
  { href: '/kolekcja', klucz: 'wspolne.navOsiagniecia', icon: 'trophy', accent: '#e0b64c' },
  // Encyklopedia zastąpiła Doradcę — ten jest teraz jej sekcją „Przedmioty".
  { href: '/encyklopedia', klucz: 'wspolne.navEncyklopedia', icon: 'book' },
  { href: '/kalkulator', klucz: 'wspolne.navKalkulator', icon: 'stats' },
  { href: '/statystyki', klucz: 'wspolne.navStatystyki', icon: 'kidsdrawing' },
  { href: '/znajomi', klucz: 'wspolne.navZnajomi', icon: 'friendfinder', accent: '#5bbf6a' },
  { href: '/czat', klucz: 'wspolne.navCzat', icon: 'friends', accent: '#e5544b' },
  { href: '/ustawienia', klucz: 'wspolne.navUstawienia', icon: 'superfan' },
]

/** Klucz tytułu sekcji dla podanej ścieżki (dla papierowej zakładki na górze). */
export function tytulSekcji(pathname: string): Klucz {
  // Edycja profilu należy do sekcji „Profil".
  if (pathname.startsWith('/kim-jestem')) return 'wspolne.navProfil'
  // Sekretny Pokój nie ma nazwy w menu — zakładka pokazuje samo „???".
  if (pathname.startsWith('/sekret')) return 'sekret.tab'
  // najdłuższy pasujący prefiks (żeby /profil/[postac] też trafiało w „Profil")
  const match = NAV.filter((n) => n.href !== '/' && pathname.startsWith(n.href)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0]
  if (match) return match.klucz
  return 'wspolne.navPulpit'
}
