import 'server-only'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'
import type { SpriteName } from '@/components/Sprite'

/**
 * „Pierwsze kroki" — co świeże konto ma jeszcze do zrobienia.
 *
 * IsaacDex jest teraz w 100% prawdziwy, więc nowy użytkownik widzi apkę naprawdę pustą:
 * bez Steama nie ma osiągnięć ani statystyk, bez znajomych nie ma feedu. Zamiast pięciu
 * osobnych „nic tu nie ma" dajemy jedną listę z konkretnymi krokami.
 *
 * Każdy krok musi być SPRAWDZALNY w bazie. Kroku „zajrzyj do Encyklopedii" tu nie ma —
 * nie wiedzielibyśmy, kiedy go odhaczyć, a lista, która nigdy się nie kończy, jest gorsza
 * niż jej brak. Takie rzeczy idą do „a tymczasem możesz…" pod listą.
 */

export type Krok = {
  id: string
  tytul: string
  /** Po co to komu — jedno zdanie, w tonie apki. */
  opis: string
  ikona: SpriteName
  href: string
  cta: string
  zrobiony: boolean
}

export type StanOnboardingu = {
  kroki: Krok[]
  zrobione: number
  wszystkie: number
  /** Czy jest jeszcze co pokazywać (false = komplet, lista znika). */
  pokazuj: boolean
}

export async function getOnboarding(): Promise<StanOnboardingu | null> {
  const ja = await mojGracz()
  if (!ja) return null

  const [profil, znajomiCount] = await Promise.all([
    ja.profilId ? prisma.profil.findUnique({ where: { id: ja.profilId } }) : null,
    // Znajomy = obserwacja w obie strony. Wystarczy nam JEDEN, więc pytamy o istnienie,
    // a nie o pełną listę.
    prisma.obserwacja.count({
      where: {
        obserwujacyId: ja.id,
        obserwowany: { obserwuje: { some: { obserwowanyId: ja.id } } },
      },
    }),
  ])

  /**
   * „Urządzony profil" = cokolwiek, co odróżnia Cię od konta prosto z rejestracji.
   *
   * UWAGA na domyślne: `zalozGracza` nadaje każdemu nowemu graczowi avatar „Isaac" —
   * więc sam fakt, że avatar jest ustawiony, NIE znaczy, że ktoś go wybrał (krok odhaczał
   * się sam w sekundzie założenia konta). Liczy się dopiero odejście od domyślnych.
   */
  const AVATAR_Z_REJESTRACJI = 'Isaac'
  const maProfil = Boolean(
    ja.opis?.trim() ||
    (ja.avatar && ja.avatar !== AVATAR_Z_REJESTRACJI) ||
    (ja.dekoracja && ja.dekoracja !== 'none') ||
    ja.gablota.length > 0,
  )

  const kroki: Krok[] = [
    {
      id: 'konto',
      tytul: 'Zejdź do piwnicy',
      opis: 'Konto założone. Isaac już Cię widzi.',
      ikona: 'isaacHead',
      href: '/profil',
      cta: 'Zobacz profil',
      zrobiony: true,
    },
    // Steam to DWA różne kroki w jednym wierszu: najpierw konto trzeba podpiąć
    // (/kim-jestem), a dopiero potem zassać dane (/kolekcja). Bez tego rozróżnienia
    // przycisk prowadziłby w miejsce, w którym nie da się zrobić następnej rzeczy.
    ja.profilId
      ? {
          id: 'steam',
          tytul: 'Zassij osiągnięcia',
          opis: 'Steam podpięty. Jedno kliknięcie i 641 ikon ląduje w Osiągnięciach.',
          ikona: 'trophy',
          href: '/kolekcja',
          cta: 'Synchronizuj',
          zrobiony: Boolean(profil?.ostatniSync),
        }
      : {
          id: 'steam',
          tytul: 'Podłącz Steam',
          opis: '641 osiągnięć, completion marks i Dead God — same wpadną do apki.',
          ikona: 'trophy',
          href: '/kim-jestem',
          cta: 'Podłącz',
          zrobiony: false,
        },
    {
      id: 'profil',
      tytul: 'Urządź się',
      opis: 'Avatar, ozdoba i ulubiona postać. Piwnica lubi wystrój.',
      ikona: 'pencil',
      href: '/kim-jestem',
      cta: 'Edytuj profil',
      zrobiony: maProfil,
    },
    {
      id: 'znajomi',
      tytul: 'Znajdź kogoś żywego',
      opis: 'Obserwuj graczy — gdy odwzajemnią, ich runy wylądują w Twoim feedzie.',
      ikona: 'friendfinder',
      href: '/znajomi',
      cta: 'Szukaj graczy',
      zrobiony: znajomiCount > 0,
    },
  ]

  const zrobione = kroki.filter((k) => k.zrobiony).length
  return { kroki, zrobione, wszystkie: kroki.length, pokazuj: zrobione < kroki.length }
}
