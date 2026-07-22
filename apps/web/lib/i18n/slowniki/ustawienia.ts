import type { Przestrzen } from '../typy'

/** Ekran /ustawienia. */
export const ustawienia = {
  tytul: { en: 'Settings — IsaacDex', pl: 'Ustawienia — IsaacDex' },

  // ── Konto Steam ──
  steamNaglowek: { en: 'Steam account', pl: 'Konto Steam' },
  steamOpis: {
    en: 'Achievements and completion marks are pulled from your Steam profile (TBOI, appid 250900).',
    pl: 'Achievementy i completion marks pobierane są z Twojego profilu Steam (TBOI, appid 250900).',
  },
  steamPodpiete: { en: 'Account linked', pl: 'Konto podpięte' },
  steamNiepodpiete: { en: 'Account not linked', pl: 'Konto niepodpięte' },
  steamZsync: { en: ' · synced ✓', pl: ' · zsynchronizowano ✓' },
  steamBrakSync: { en: ' · not synced', pl: ' · brak synchronizacji' },
  steamSynchronizuj: { en: 'Sync in Achievements', pl: 'Synchronizuj w Osiągnięciach' },
  steamTylkoZalogowany: {
    en: 'You can link Steam only once you are signed in — otherwise there is nowhere to save your achievements.',
    pl: 'Konto Steam podłączysz dopiero po zalogowaniu — inaczej nie ma gdzie zapisać Twoich osiągnięć.',
  },
  steamZalogujBy: { en: 'Sign in to link Steam', pl: 'Zaloguj się, aby podłączyć Steam' },

  // ── Companion ──
  companionNaglowek: { en: 'Companion', pl: 'Companion' },
  companionOpis: {
    en: 'Your familiar sits in the corner, greets you by name and walks you to the Advisor. Pick who tags along:',
    pl: 'Twój towarzysz-familiar siedzi w rogu, wita Cię po nicku i prowadzi do Doradcy. Wybierz, kto ma Ci towarzyszyć:',
  },

  // ── Kartki ──
  kartkiNaglowek: { en: 'Pages', pl: 'Kartki' },
  kartkiOpis: {
    en: 'Panel look: <b>Normal</b> is light parchment, <b>Tainted</b> is the darker paper of the tainted characters. Saved in your browser.',
    pl: 'Wygląd paneli: <b>Normalne</b> to jasny pergamin, <b>Tainted</b> to ciemniejsze kartki jak u splugawionych postaci. Wybór zapisuje się w przeglądarce.',
  },
  kartkiNormalne: { en: 'Normal pages', pl: 'Normalne kartki' },
  kartkiTainted: { en: 'Tainted (dark)', pl: 'Tainted (ciemne)' },
  kartkiGrupa: { en: 'Page skin', pl: 'Skin kartek' },

  // ── Kursor ──
  kursorNaglowek: { en: 'Cursor', pl: 'Kursor' },
  kursorOpis: {
    en: 'Fly cursor instead of the arrow (off by default).',
    pl: 'Kursor-mucha zamiast strzałki (domyślnie wyłączony).',
  },

  // ── Język ──
  jezykNaglowek: { en: 'Language', pl: 'Język' },
  jezykOpis: {
    en: 'Interface language. Item, boss and enemy names stay in English — that is how the game names them.',
    pl: 'Język interfejsu. Nazwy itemów, bossów i przeciwników zostają po angielsku — tak nazywa je gra.',
  },
  jezykGrupa: { en: 'Interface language', pl: 'Język interfejsu' },

  // ── Czat: „Curse of the Blind" (zasłanianie przekleństw) ──
  blurNaglowek: { en: 'Curse of the Blind', pl: 'Curse of the Blind' },
  blurOpis: {
    en: 'Blur curse words and crude language in chat — every letter turns into “?”. On by default — turn it off for a raw basement.',
    pl: 'Zasłaniaj przekleństwa i wulgaryzmy na czacie — każda litera zamienia się w „?”. Domyślnie włączone — wyłącz, jeśli wolisz surową piwnicę.',
  },
  blurGrupa: { en: 'Word blurring', pl: 'Zasłanianie słów' },
  blurWlaczone: { en: 'Blurred', pl: 'Zasłaniaj' },
  blurWylaczone: { en: 'Unblurred', pl: 'Bez cenzury' },

  // ── Konto ──
  kontoNaglowek: { en: 'Account', pl: 'Konto' },
  kontoOpis: {
    en: 'Sign out on this device, or delete your account for good — along with your profile, friends and posts.',
    pl: 'Wyloguj się na tym urządzeniu albo usuń konto na zawsze — razem z profilem, znajomymi i wpisami.',
  },
  kontoWyloguj: { en: 'Sign out', pl: 'Wyloguj się' },
} satisfies Przestrzen
