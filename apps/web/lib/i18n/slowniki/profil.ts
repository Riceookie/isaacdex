import type { Przestrzen } from '../typy'

/**
 * Profil własny (/profil), profil cudzy (/gracz/[nick]), profil postaci (/profil/[postac])
 * oraz wszystko, co gracza reprezentuje w innych miejscach apki: karty, dymki, liczniki.
 *
 * Nazwy z gry (Isaac, Azazel, Brimstone, Dead God, completion marks) zostają po angielsku —
 * tak nazywa je gra i tak szuka ich gracz.
 */
export const profil = {
  // ── Nagłówek karty profilu ──
  edytujProfil: { en: 'Edit profile', pl: 'Edytuj profil' },
  /** Domyślne bio, gdy gracz nic o sobie nie napisał — ma być żartem, nie opisem. */
  cytatDomyslny: {
    en: 'I play way too much Isaac. Send help.',
    pl: 'Za dużo gram w Isaaca. Ratunku.',
  },
  graczDomyslny: { en: 'Player', pl: 'Gracz' },

  // ── Meta w nagłówku (etykiety wersalikami) ──
  metaCzlonekOd: { en: 'MEMBER SINCE', pl: 'CZŁONEK OD' },
  metaRegion: { en: 'REGION', pl: 'REGION' },
  metaRegionEuropa: { en: 'Europe', pl: 'Europa' },
  metaWpisy: { en: 'POSTS', pl: 'WPISY' },
  metaAchievementy: { en: 'ACHIEVEMENTS', pl: 'ACHIEVEMENTY' },
  metaBezSteama: { en: 'no Steam', pl: 'bez Steama' },

  // ── Liczniki obserwacji ──
  /**
   * Sama etykieta bez liczby: w JSX liczba stoi w osobnym <b>, więc tekst nie może jej
   * zawierać — ale forma i tak zależy od niej („1 follower" vs „2 followers"), dlatego
   * wpis jest mnogi i woła się go z `{ liczba }`.
   */
  licznikObserwujacych: {
    en: { one: 'follower', other: 'followers' },
    pl: { one: 'obserwujący', few: 'obserwujących', many: 'obserwujących', other: 'obserwujących' },
  },
  licznikObserwuje: { en: 'following', pl: 'obserwuje' },
  licznikObserwujacychAria: {
    en: { one: '{liczba} follower — show list', other: '{liczba} followers — show list' },
    pl: {
      one: '{liczba} obserwujący — pokaż listę',
      few: '{liczba} obserwujących — pokaż listę',
      many: '{liczba} obserwujących — pokaż listę',
      other: '{liczba} obserwujących — pokaż listę',
    },
  },
  licznikObserwujeAria: {
    en: 'following {liczba} — show list',
    pl: 'obserwuje {liczba} — pokaż listę',
  },
  obsModalAria: { en: 'Followers and following', pl: 'Obserwujący i obserwowani' },
  obsZakladkaObserwujacy: { en: 'Followers ({liczba})', pl: 'Obserwujący ({liczba})' },
  obsZakladkaObserwuje: { en: 'Following ({liczba})', pl: 'Obserwuje ({liczba})' },
  obsPustoObserwuje: {
    en: '{nick} is not following anyone yet.',
    pl: '{nick} nikogo jeszcze nie obserwuje.',
  },
  obsPustoObserwujacych: {
    en: 'Nobody follows {nick} yet.',
    pl: 'Nikt jeszcze nie obserwuje {nick}.',
  },

  // ── Przycisk obserwowania (stan RELACJI, nie akcji) ──
  obsObserwuj: { en: 'Follow', pl: 'Obserwuj' },
  obsObserwujesz: { en: 'Following', pl: 'Obserwujesz' },
  obsOdwzajemnij: { en: 'Follow back', pl: 'Odwzajemnij' },
  obsZnajomi: { en: 'Friends', pl: 'Znajomi' },
  obsPrzestan: { en: 'Unfollow', pl: 'Przestań' },
  obsUsunZnajomego: { en: 'Remove friend', pl: 'Usuń znajomego' },
  /** Komentarz maskotki po kliknięciu — ma bawić, nie informować. */
  glosOdklik: { en: 'Shame, I liked that one.', pl: 'Szkoda, lubiłem go.' },
  glosObserwuj: {
    en: 'A new friend? The basement grows.',
    pl: 'Nowy znajomy? Piwnica rośnie.',
  },

  // ── Znaczki relacji ──
  relacjaToTy: { en: "That's you", pl: 'To Ty' },
  relacjaZnajomy: { en: 'Friend', pl: 'Znajomy' },
  relacjaObserwujeCie: { en: 'Follows you', pl: 'Obserwuje Cię' },
  relacjaObserwujesz: { en: 'Following', pl: 'Obserwujesz' },

  // ── Ulubiona postać ──
  ulubionaPostacNaglowek: { en: 'Favourite character', pl: 'Ulubiona postać' },
  ulubionaNieWybrano: { en: 'Not picked', pl: 'Nie wybrano' },
  ulubionaBrak: { en: 'No favourite', pl: 'Brak ulubionej' },

  // ── Gablota „Top 3" ──
  gablotaNaglowek: { en: 'Top 3 favourite items', pl: 'Top 3 ulubione przedmioty' },
  gablotaWyborAria: { en: 'Pick an item for the showcase', pl: 'Wybierz item do gabloty' },
  gablotaWybierzItem: { en: 'Pick an item', pl: 'Wybierz item' },
  gablotaSzukajItemu: { en: 'Search items…', pl: 'Szukaj itemu…' },
  gablotaJuzWystawiony: { en: '{nazwa} — already on show', pl: '{nazwa} — już w gablocie' },
  gablotaNicNieZnaleziono: {
    en: 'No such thing down in the basement.',
    pl: 'Nic takiego nie ma w piwnicy.',
  },
  gablotaZdejmij: { en: 'Take {nazwa} off the showcase', pl: 'Zdejmij {nazwa} z gabloty' },
  gablotaDodaj: { en: 'Add an item to the showcase', pl: 'Dodaj item do gabloty' },

  // ── Ostatnia aktywność ──
  aktywnoscNaglowek: { en: 'Latest activity', pl: 'Ostatnia aktywność' },
  aktywnoscOpisWlasny: {
    en: 'Your posts in the feed — unlocked achievements and slain bosses, straight from Steam. Friends see the same thing.',
    pl: 'Twoje wpisy w feedzie — odblokowane achievementy i ubici bossowie, prosto ze Steama. To samo widzą znajomi.',
  },
  aktywnoscOpisObcy: {
    en: 'What {nick} dropped into the feed — unlocks and slain bosses.',
    pl: 'Co {nick} wrzucił do feedu — odblokowania i ubici bossowie.',
  },
  aktywnoscPustoObcy: {
    en: "Silence. {nick} hasn't dropped anything here yet.",
    pl: 'Cisza. {nick} jeszcze nic tu nie wrzucił.',
  },
  aktywnoscSynchronizuj: { en: 'Sync with Steam', pl: 'Synchronizuj ze Steam' },
  linkFeed: { en: 'Feed →', pl: 'Feed →' },

  // ── Dead God / postęp ──
  deadGodNaglowek: { en: 'Dead God — progress', pl: 'Dead God — postęp' },
  deadGodTytul: { en: 'Dead God — 100% of achievements', pl: 'Dead God — 100% osiągnięć' },
  achPostep: {
    en: '{zdobyte}/{wszystkie} achievements',
    pl: '{zdobyte}/{wszystkie} achievementów',
  },
  achProcentTytul: { en: '{procent}% of achievements', pl: '{procent}% osiągnięć' },
  steamZaproszenieTytul: {
    en: '641 achievements are waiting.',
    pl: '641 achievementów czeka.',
  },
  steamZaproszenieOpis: {
    en: 'Link Steam and Dead God, completion marks and your rarest unlocks will land here on their own — dates from years back included.',
    pl: 'Podłącz Steam, a Dead God, marki postaci i najrzadsze zdobycze wskoczą tu same — razem z datami sprzed lat.',
  },
  steamZaproszeniePoza: {
    en: 'Profile, showcase and decorations you can set up right now — Steam is not needed for those.',
    pl: 'Profil, gablotę i ozdoby ustawisz już teraz — Steam nie jest do tego potrzebny.',
  },
  podlaczSteam: { en: 'Link Steam', pl: 'Podłącz Steam' },
  bezSteama: { en: 'No Steam linked', pl: 'Bez podpiętego Steama' },

  // ── Sekcje w prawej kolumnie ──
  ostatnieAchievementy: { en: 'Latest achievements', pl: 'Ostatnie achievementy' },
  postepyPostaci: { en: 'Character progress', pl: 'Postępy postaci' },
  znajomiNaglowek: { en: 'Friends ({liczba})', pl: 'Znajomi ({liczba})' },
  znajomiPustoObcy: {
    en: '{nick} has no friends yet.',
    pl: '{nick} nie ma jeszcze znajomych.',
  },
  znajdzGraczy: { en: 'Find players', pl: 'Znajdź graczy' },
  linkWszystkie: { en: 'All →', pl: 'Wszystkie →' },
  linkStatystyki: { en: 'Stats →', pl: 'Statystyki →' },
  linkWszyscy: { en: 'Everyone →', pl: 'Wszyscy →' },

  // ── Gość na /profil ──
  goscTytul: { en: 'Even Isaac had to start somewhere.', pl: 'Nawet Isaac musiał gdzieś zacząć.' },
  goscOpis: {
    en: "Create an account, link Steam and earn your own Dead God, completion marks and rarest achievements — instead of looking at someone else's.",
    pl: 'Załóż konto, podłącz Steam i zdobądź własne Dead God, completion marks i najrzadsze achievementy — zamiast oglądać cudze.',
  },
  goscCta: { en: 'Start your own run', pl: 'Zacznij swoją drogę' },

  // ── Karta gracza / dymek pod kursorem ──
  bezOpisu: { en: 'No bio.', pl: 'Bez opisu.' },
  hovBrakOpisu: {
    en: 'Has not written anything about themselves yet.',
    pl: 'Jeszcze nic o sobie nie napisał.',
  },
  hovKliknij: { en: 'Click to open the profile', pl: 'Kliknij, by wejść na profil' },
  tytulObserwujacy: { en: 'Followers', pl: 'Obserwujący' },
  tytulWpisy: { en: 'Posts in the feed', pl: 'Wpisy w feedzie' },
  /** Etykieta obok liczby (liczba w osobnym elemencie) — patrz `licznikObserwujacych`. */
  etykietaWpisow: {
    en: { one: 'post', other: 'posts' },
    pl: { one: 'wpis', few: 'wpisy', many: 'wpisów', other: 'wpisu' },
  },
  tytulTwojProfil: { en: 'Your profile', pl: 'Twój profil' },
  tytulProfilGracza: { en: "{nick}'s profile", pl: 'Profil gracza {nick}' },
  tytulBrakGracza: { en: 'No such player — IsaacDex', pl: 'Nie ma takiego gracza — IsaacDex' },
  wrocZnajomi: { en: '← Friends', pl: '← Znajomi' },

  // ── Ulubiony item (odznaka) ──
  ulubionyItemZmien: { en: 'Change favourite item', pl: 'Zmień ulubiony item' },
  ulubionyItemEtykieta: { en: 'Favourite item: {nazwa}', pl: 'Ulubiony item: {nazwa}' },

  // ── Avatar ──
  avatarPodglad: { en: 'Avatar preview', pl: 'Podgląd avatara' },
  avatarWybierz: { en: 'Choose an image…', pl: 'Wybierz obraz…' },
  avatarUsun: { en: 'Remove (back to character)', pl: 'Usuń (wróć do postaci)' },
  avatarZapisInfo: {
    en: 'Saved once you click “Save profile”.',
    pl: 'Zapisuje się po kliknięciu „Zapisz profil".',
  },

  // ── Profil postaci (/profil/[postac]) ──
  wrocStatystyki: { en: '← Stats', pl: '← Statystyki' },
  postacBanerGosc: {
    en: 'Preview without an account — the board is all empty sockets.',
    pl: 'Podgląd bez konta — tablica świeci pustkami.',
  },
  postacBanerGoscDalej: {
    en: ' to slay bosses and collect your own completion marks.',
    pl: ', aby ubijać bossów i zbierać własne completion marks.',
  },
  /**
   * Nota z pogrubionym wtrąceniem w środku zdania — trzymana jako HTML, bo pocięta na trzy
   * klucze i sklejana w JSX rozjechałaby się przy innym szyku zdania w drugim języku.
   */
  postacTaintedNota: {
    en: 'This is a <b>tainted</b> character — its completion marks are not Steam achievements, so the Web API does not return them and the board stays empty. We only track marks of the base characters.',
    pl: 'To postać <b>splugawiona (Tainted)</b> — jej completion marks nie są achievementami Steam, więc Web API ich nie zwraca i tablica pozostaje pusta. Śledzimy tylko marki postaci bazowych.',
  },

  // ── Błędy z /api/profil ──
  bladNiezalogowany: {
    en: 'Sign in to edit your profile.',
    pl: 'Zaloguj się, żeby edytować profil.',
  },
  bladNickZajety: { en: 'That nickname is already taken.', pl: 'Ten nick jest już zajęty.' },
} satisfies Przestrzen
