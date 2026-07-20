import type { Przestrzen } from '../typy'

/**
 * Klimat apki: puste stany, flavor text pod wpisami i onboarding („Pierwsze kroki").
 *
 * Te teksty NIE są tłumaczone dosłownie. Polska wersja ma suchy, ponury humor Isaaca i
 * angielska musi mieć ten sam ton, a nie tę samą składnię — kalka („The basement does not
 * bleed yet, synchronize") brzmi jak komunikat błędu, a nie jak opis itemu w grze.
 *
 * Nazwy z gry (Dead God, completion marks, Basement, run, build, RNG) zostają po angielsku
 * w OBU językach — tak nazywa je gra i tak mówią o nich gracze.
 */
export const klimat = {
  // ── Loader ─────────────────────────────────────────────────────────────────────
  ladowanie: { en: 'Loading…', pl: 'Ładowanie…' },

  // ── Etykiety typów wpisów w feedzie ────────────────────────────────────────────
  // Formy BEZOSOBOWE, bo płci gracza nie znamy. W angielskim wychodzi to naturalnie
  // (strona bierna), w polskim celowo unikamy „odblokował(a)".
  etykietaUnlock: { en: '— achievement unlocked', pl: '— odblokowano achievement' },
  etykietaBoss: { en: '— boss defeated', pl: '— pokonano bossa' },
  etykietaRun: { en: '— run finished', pl: '— zakończono run' },
  etykietaTekst: { en: '— posted', pl: '— wpis' },

  // ── Flavor text pod wpisem ─────────────────────────────────────────────────────
  // Krótkie, jak opisy itemów w grze: jedno zdanie, bez wykrzykników, z lekką rezygnacją.
  komentarzUnlock1: { en: 'One more icon for the pile.', pl: 'Kolejna ikonka w kolekcji.' },
  komentarzUnlock2: { en: 'Somewhere, Mom is proud.', pl: 'Papa Isaac byłby dumny.' },
  komentarzUnlock3: { en: 'Unlocked. No takebacks.', pl: 'Odblokowane. Bezpowrotnie.' },
  komentarzUnlock4: {
    en: 'Save file: one line heavier.',
    pl: 'Save file grubszy o jedną pozycję.',
  },

  komentarzBoss1: { en: 'Boss down. The Basement remembers.', pl: 'Boss padł. Piwnica pamięta.' },
  komentarzBoss2: { en: 'One less thing to cry about.', pl: 'Jedna łza mniej do wylania.' },
  komentarzBoss3: {
    en: 'Nobody counted the attempts. Good.',
    pl: 'Nikt nie liczył, ile prób to kosztowało.',
  },
  komentarzBoss4: { en: 'Another mark scratched on the wall.', pl: 'Kolejny znaczek na ścianie.' },

  komentarzRun1: {
    en: 'Run closed. Items taken to the grave.',
    pl: 'Run zamknięty. Itemy zabrane do grobu.',
  },
  komentarzRun2: { en: 'Health: optional. Damage: yes.', pl: 'Zdrowie: nieistotne. Damage: tak.' },
  komentarzRun3: {
    en: 'That build had no right to work. It worked.',
    pl: 'Ten build nie powinien działać. Zadziałał.',
  },
  komentarzRun4: { en: 'RNG was in a good mood today.', pl: 'RNG dziś było łaskawe.' },

  komentarzTekst1: { en: 'The Basement is listening.', pl: 'Piwnica słucha.' },
  komentarzTekst2: { en: 'Somebody had to say it.', pl: 'Ktoś musiał to powiedzieć.' },
  komentarzTekst3: { en: 'The floor is open.', pl: 'Dyskusja otwarta.' },
  komentarzTekst4: { en: 'Straight from the Basement.', pl: 'Wpis prosto z Basementu.' },

  // ── Puste stany ────────────────────────────────────────────────────────────────
  // Pogrubiona pierwsza fraza zostaje w tekście jako <b> (wzorzec z `ustawienia.kartkiOpis`) —
  // cięcie zdania na „nagłówek" i „resztę" rozjeżdża się przy innym szyku w drugim języku.
  brakZnajomych: {
    en: '<b>Alone in the basement, just like Isaac.</b> Follow someone — once they follow back, their unlocks and dead bosses start dropping in here on their own.',
    pl: '<b>Sam jak Isaac w piwnicy.</b> Zaobserwuj kogoś — gdy odwzajemni, jego odblokowania i ubici bossowie zaczną tu spadać same.',
  },
  brakZnajomychLista: {
    en: '<b>Nobody has followed back yet.</b> A friend is someone who follows you back.',
    pl: '<b>Nikt jeszcze nie odwzajemnił.</b> Znajomy = obserwujecie się nawzajem.',
  },
  brakWynikow: {
    en: '<b>No such player down here.</b> Nobody by that name has been to the basement. Try another spelling.',
    pl: '<b>Nikogo takiego tu nie ma.</b> Nikt o tym nicku nie schodził do piwnicy. Spróbuj inaczej.',
  },
  brakAktywnosci: {
    en: '<b>The basement is not bleeding yet.</b> The feed records every Steam unlock of yours by itself — real date, real icon. Sync and watch your history show up.',
    pl: '<b>Piwnica jeszcze nie krwawi.</b> Feed sam zapisuje każde Twoje odblokowanie ze Steama — z prawdziwą datą i ikoną. Zsynchronizuj i zobacz swoją historię.',
  },
  brakAktywnosciGosc: {
    en: '<b>The basement is not bleeding yet.</b> The feed pulls player unlocks straight from Steam — real date, real icon. Make an account and your history lands here first.',
    pl: '<b>Piwnica jeszcze nie krwawi.</b> Feed zapisuje odblokowania graczy prosto ze Steama — z prawdziwą datą i ikoną. Załóż konto, a Twoja historia wpadnie tu pierwsza.',
  },
  brakWpisow: {
    en: '<b>Your page is still blank.</b> Sync once and every unlock you have ever earned in the game lands right here.',
    pl: '<b>Twoja karta jest jeszcze pusta.</b> Po synchronizacji wyląduje tu każde odblokowanie, które kiedykolwiek zdobyłeś w grze.',
  },

  // ── „Pierwsze kroki" — ramka onboardingu ───────────────────────────────────────
  krokiNaglowek: { en: 'First steps', pl: 'Pierwsze kroki' },
  krokiZrobione: { en: 'done', pl: 'zrobione' },
  /**
   * Stopka jest pocięta na trzy części, bo w środku stoją dwa <Link> (miękka nawigacja).
   * Tekst z <a> w dangerouslySetInnerHTML przeładowałby całą stronę, a jednego klucza z
   * linkami nie da się złożyć — `t()` zwraca string, nie JSX. Podział trzyma się w obu
   * językach: [wstęp] Encyklopedia [spójnik] Kalkulator [zakończenie].
   */
  krokiStopkaPrzed: {
    en: 'You need none of this to just look around: ',
    pl: 'Nie musisz nic z tego robić, żeby pooglądać: ',
  },
  krokiStopkaMiedzy: { en: ' and ', pl: ' i ' },
  krokiStopkaPo: { en: ' work from the first second.', pl: ' działają od pierwszej sekundy.' },

  // ── Kroki onboardingu ──────────────────────────────────────────────────────────
  krokKontoTytul: { en: 'Head down to the basement', pl: 'Zejdź do piwnicy' },
  krokKontoOpis: {
    en: 'Account created. Isaac can see you now.',
    pl: 'Konto założone. Isaac już Cię widzi.',
  },
  krokKontoCta: { en: 'View profile', pl: 'Zobacz profil' },

  krokSteamSyncTytul: { en: 'Pull in your achievements', pl: 'Zassij osiągnięcia' },
  krokSteamSyncOpis: {
    en: 'Steam is linked. One click and 641 icons land in Achievements.',
    pl: 'Steam podpięty. Jedno kliknięcie i 641 ikon ląduje w Osiągnięciach.',
  },
  krokSteamSyncCta: { en: 'Sync', pl: 'Synchronizuj' },

  krokSteamPodlaczTytul: { en: 'Link Steam', pl: 'Podłącz Steam' },
  krokSteamPodlaczOpis: {
    en: '641 achievements, completion marks and Dead God — they walk in by themselves.',
    pl: '641 osiągnięć, completion marks i Dead God — same wpadną do apki.',
  },
  krokSteamPodlaczCta: { en: 'Link', pl: 'Podłącz' },

  krokProfilTytul: { en: 'Make yourself at home', pl: 'Urządź się' },
  krokProfilOpis: {
    en: 'Avatar, decoration and a favourite character. Even a basement likes decor.',
    pl: 'Avatar, ozdoba i ulubiona postać. Piwnica lubi wystrój.',
  },
  krokProfilCta: { en: 'Edit profile', pl: 'Edytuj profil' },

  krokZnajomiTytul: { en: 'Find someone alive', pl: 'Znajdź kogoś żywego' },
  krokZnajomiOpis: {
    en: 'Follow players — when they follow back, their runs land in your feed.',
    pl: 'Obserwuj graczy — gdy odwzajemnią, ich runy wylądują w Twoim feedzie.',
  },
  krokZnajomiCta: { en: 'Search players', pl: 'Szukaj graczy' },
} satisfies Przestrzen
