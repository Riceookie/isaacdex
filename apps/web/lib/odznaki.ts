import type { SpriteName } from '@/components/Sprite'
import type { Klucz, Zmienne } from '@/lib/i18n/slownik'

/**
 * Tytuły pod nickiem — NADAWANE, nie wybierane.
 *
 * Każda odznaka musi dać się policzyć z danych, które naprawdę mamy: procent achievementów
 * ze Steama, completion marks per postać (tabela CompletionMark) i liczba obserwujących
 * (tabela Obserwacja). Nic tu nie powstaje z nicku ani z deklaracji gracza — tytuł, którego
 * nie da się zweryfikować, jest wart tyle co żaden.
 *
 * Świadomie NIE ma odznaki „z ulubionej postaci": ulubioną się klika w edytorze, więc nie
 * jest żadnym osiągnięciem (i tak stoi obok w wielkiej gablocie „Ulubiona postać").
 * „Main" niżej liczymy z completion marks — z tego, co gracz naprawdę przeszedł.
 */
export type Odznaka = {
  id: string
  /** Nazwa tytułu (klucz słownika). Zostaje po angielsku w obu językach — to żargon z gry. */
  klucz: Klucz
  /** Podpowiedź pod kursorem: ZA CO ten tytuł. Ta część jest tłumaczona. */
  kluczOpisu: Klucz
  zmienne?: Zmienne
  /** Ikona z gry… */
  sprite?: SpriteName
  /** …albo głowa postaci, gdy tytuł dotyczy konkretnej postaci („Azazel Main"). */
  postac?: string
  /** Wariant koloru — ta sama skala co jakość itemów (Q1…Q4), patrz profil-plus.css. */
  wariant: 'zloto' | 'fiolet' | 'blekit' | 'zielen'
  /**
   * Ranga = jak trudno tytuł zdobyć. Steruje kolejnością i tym, co wypada poza limit,
   * bo w nagłówku jest miejsce na kilka odznak, a nie na listę wszystkich progów.
   */
  ranga: number
}

/** Ile odznak wchodzi do nagłówka. Więcej rozpycha kolumnę tożsamości i zagłusza nick. */
export const MAKS_ODZNAK = 3

/** Próg „Main": ile punktów procentowych przewagi nad drugą postacią to już wyraźny main. */
const PRZEWAGA_MAINA = 20

export type DaneOdznak = {
  achProcent: number
  postacie: { nazwa: string; procent: number }[]
  obserwujacych: number
  steamPodlaczony: boolean
}

export function policzOdznaki(d: DaneOdznak): Odznaka[] {
  const lista: Odznaka[] = []

  // Bez Steama `achProcent` i marki to zera Z BRAKU DANYCH, a nie z braku wyników —
  // nadawanie (albo odmawianie) tytułów na ich podstawie byłoby zmyślaniem.
  if (d.steamPodlaczony) {
    // Kopia, bo kolejność z zapytań (malejąco po procencie) to szczegół implementacyjny
    // dwóch różnych funkcji w queries.ts — łatwo ją tam kiedyś zgubić.
    const wgPostepu = [...d.postacie].sort((a, b) => b.procent - a.procent)
    const pelne = wgPostepu.filter((p) => p.procent >= 100).length

    if (d.achProcent >= 100) {
      lista.push({
        id: 'deadGod',
        klucz: 'profil.odznakaDeadGod',
        kluczOpisu: 'profil.odznakaDeadGodOpis',
        sprite: 'deadgod',
        wariant: 'zloto',
        ranga: 100,
      })
    } else if (d.achProcent >= 80) {
      lista.push({
        id: 'grinder',
        klucz: 'profil.odznakaGrinder',
        kluczOpisu: 'profil.odznakaGrinderOpis',
        zmienne: { procent: d.achProcent },
        sprite: 'stopwatch',
        wariant: 'fiolet',
        ranga: 80,
      })
    }

    // Completion marks liczone UDZIAŁEM w rosterze, nie sztywną liczbą: postacie siedzą
    // w bazie i przy każdym dodatku jest ich więcej — próg „12 postaci" po cichu
    // robiłby się z czasem coraz łatwiejszy.
    if (wgPostepu.length > 0) {
      const zmienneMarek = { liczba: pelne, wszystkie: wgPostepu.length }
      if (pelne >= Math.ceil(wgPostepu.length / 2)) {
        lista.push({
          id: 'completionist',
          klucz: 'profil.odznakaCompletionist',
          kluczOpisu: 'profil.odznakaMarkiOpis',
          zmienne: zmienneMarek,
          sprite: 'starmark',
          wariant: 'zloto',
          ranga: 70,
        })
      } else if (pelne >= 3) {
        lista.push({
          id: 'markHunter',
          klucz: 'profil.odznakaMarkHunter',
          kluczOpisu: 'profil.odznakaMarkiOpis',
          zmienne: zmienneMarek,
          sprite: 'heartmark',
          wariant: 'zielen',
          ranga: 40,
        })
      }
    }

    // „Main" wymaga WYRAŹNEJ przewagi: przy wyrównanym postępie tytuł skakałby z postaci
    // na postać po jednej marce, a przy komplecie (Dead God) nie ma żadnego maina.
    const [top, drugi] = wgPostepu
    if (top && top.procent >= 50 && top.procent - (drugi?.procent ?? 0) >= PRZEWAGA_MAINA) {
      lista.push({
        id: 'main',
        klucz: 'profil.odznakaMain',
        kluczOpisu: 'profil.odznakaMainOpis',
        zmienne: { postac: top.nazwa, procent: top.procent },
        postac: top.nazwa,
        wariant: 'blekit',
        ranga: 60,
      })
    }
  }

  // Obserwujący są prawdziwi (tabela Obserwacja) i nie mają nic wspólnego ze Steamem —
  // to jedyny tytuł, który dostanie też ktoś bez podpiętego konta.
  if (d.obserwujacych >= 25) {
    lista.push({
      id: 'celebrity',
      klucz: 'profil.odznakaCelebrity',
      kluczOpisu: 'profil.odznakaObserwujacychOpis',
      zmienne: { liczba: d.obserwujacych },
      sprite: 'friendfinder',
      wariant: 'zloto',
      ranga: 85,
    })
  } else if (d.obserwujacych >= 5) {
    lista.push({
      id: 'known',
      klucz: 'profil.odznakaKnown',
      kluczOpisu: 'profil.odznakaObserwujacychOpis',
      zmienne: { liczba: d.obserwujacych },
      sprite: 'friends',
      wariant: 'zielen',
      ranga: 30,
    })
  }

  return lista.sort((a, b) => b.ranga - a.ranga).slice(0, MAKS_ODZNAK)
}
