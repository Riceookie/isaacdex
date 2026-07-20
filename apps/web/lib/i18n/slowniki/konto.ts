import type { Przestrzen } from '../typy'

/**
 * Logowanie, rejestracja, reset hasła, edytor „WHO AM I?" i usuwanie konta.
 *
 * Kody błędów z `app/actions/auth.ts` wracają w adresie (?blad=…), więc ich teksty siedzą tu
 * pod kluczami `blad*` — sam kod zostaje niezmieniony, tłumaczy się dopiero zdanie na ekranie.
 */
export const konto = {
  // — logowanie i rejestracja —
  chwila: { en: 'Hold on…', pl: 'Chwila…' },
  zalozKonto: { en: 'Create account', pl: 'Załóż konto' },
  podtytulRejestracja: {
    en: 'An account gives you your own profile, friends and posts in the feed.',
    pl: 'Konto daje Ci własny profil, znajomych i wpisy w feedzie.',
  },
  podtytulLogowanie: { en: 'Back down to your basement.', pl: 'Wróć do swojej piwnicy.' },
  tabLogowanie: { en: 'Sign in', pl: 'Logowanie' },
  tabRejestracja: { en: 'Sign up', pl: 'Rejestracja' },
  steamRejestracja: { en: 'Sign up with Steam', pl: 'Zarejestruj się przez Steam' },
  steamLogowanie: { en: 'Sign in with Steam', pl: 'Zaloguj się przez Steam' },
  alboEmailem: { en: 'or with e-mail', pl: 'albo e-mailem' },
  alboEmailemHaslem: { en: 'or with e-mail and password', pl: 'albo e-mailem i hasłem' },
  poleNick: { en: 'Nickname', pl: 'Nick' },
  nickPlaceholder: { en: 'How the feed should see you', pl: 'Jak mają Cię widzieć w feedzie' },
  poleEmail: { en: 'E-mail', pl: 'E-mail' },
  emailPlaceholder: { en: 'you@example.com', pl: 'ty@example.com' },
  niePamietaszHasla: { en: 'Forgot your password?', pl: 'Nie pamiętasz hasła?' },
  wejdz: { en: 'Enter', pl: 'Wejdź' },
  stopkaBezKonta: {
    en: 'You can look around without an account — you just can’t follow, like or post.',
    pl: 'Bez konta też możesz oglądać apkę — po prostu nie da się wtedy obserwować, lajkować ani pisać.',
  },

  // — komunikaty błędów (kody z akcji zostają kluczami mapy, tłumaczy się samo zdanie) —
  bladNieskonfigurowane: {
    en: 'Signing in is not set up on this server yet.',
    pl: 'Logowanie nie jest jeszcze skonfigurowane na tym serwerze.',
  },
  bladKlucz: {
    en: 'The Supabase key on this server is invalid — that’s a fault on our side, not your password. Signing in will come back once an admin fixes the configuration.',
    pl: 'Klucz Supabase na tym serwerze jest nieprawidłowy — to usterka po naszej stronie, nie Twoje hasło. Logowanie wróci, gdy administrator poprawi konfigurację.',
  },
  bladEmail: {
    en: 'That doesn’t look like an e-mail address.',
    pl: 'To nie wygląda na adres e-mail.',
  },
  bladHaslo: {
    en: 'Your password must be at least 8 characters.',
    pl: 'Hasło musi mieć co najmniej 8 znaków.',
  },
  bladNickKrotki: {
    en: 'Your nickname must be at least 3 characters.',
    pl: 'Nick musi mieć co najmniej 3 znaki.',
  },
  bladNickDlugi: {
    en: 'Your nickname can be at most 20 characters.',
    pl: 'Nick może mieć najwyżej 20 znaków.',
  },
  bladNickZajety: {
    en: 'That nickname is taken. Pick another one.',
    pl: 'Ten nick jest już zajęty. Wybierz inny.',
  },
  bladDane: { en: 'Wrong e-mail or password.', pl: 'Zły e-mail albo hasło.' },
  bladNiepotwierdzony: {
    en: 'Confirm your e-mail address first (the link in the message from Supabase).',
    pl: 'Najpierw potwierdź adres e-mail (link w wiadomości od Supabase).',
  },
  bladIstnieje: {
    en: 'An account with this e-mail already exists. Sign in.',
    pl: 'Konto z tym e-mailem już istnieje. Zaloguj się.',
  },
  bladLimitMaili: {
    en: 'Supabase didn’t send the confirmation e-mail — the sending quota is used up. Turn off “Confirm email” in the project settings or wait an hour.',
    pl: 'Supabase nie wysłał maila potwierdzającego — wyczerpany limit wysyłki. Wyłącz „Confirm email” w ustawieniach projektu albo poczekaj godzinę.',
  },
  bladSteam: {
    en: 'Signing in with Steam failed. Try again.',
    pl: 'Nie udało się zalogować przez Steam. Spróbuj jeszcze raz.',
  },
  bladInny: {
    en: 'Something went wrong. Try again.',
    pl: 'Coś poszło nie tak. Spróbuj jeszcze raz.',
  },
  infoPotwierdz: {
    en: 'Account created. Confirm your e-mail address, then sign in.',
    pl: 'Konto założone. Potwierdź adres e-mail, a potem zaloguj się.',
  },

  // — reset hasła —
  resetTytul: { en: 'Password reset', pl: 'Reset hasła' },
  resetPodtytul: {
    en: 'Give us the account’s e-mail — we’ll send a link to set a new password.',
    pl: 'Podaj e-mail konta — wyślemy link do ustawienia nowego.',
  },
  resetWyslij: { en: 'Send reset link', pl: 'Wyślij link resetujący' },
  bladKluczReset: {
    en: 'The Supabase key on this server is invalid — the reset can’t be sent right now. That’s a fault on our side.',
    pl: 'Klucz Supabase na tym serwerze jest nieprawidłowy — resetu nie da się teraz wysłać. To usterka po naszej stronie.',
  },
  infoWyslano: {
    en: 'If such an account exists, we’ve sent a link to reset the password. Check your inbox.',
    pl: 'Jeśli takie konto istnieje, wysłaliśmy link do zresetowania hasła. Sprawdź skrzynkę.',
  },
  wrocDoLogowania: { en: '← Back to signing in', pl: '← Wróć do logowania' },

  // — nowe hasło z linku w mailu —
  noweHaslo: { en: 'New password', pl: 'Nowe hasło' },
  noweHasloPodtytul: {
    en: 'Type a new password for your basement.',
    pl: 'Wpisz nowe hasło do swojej piwnicy.',
  },
  bladZmianyHasla: {
    en: 'Couldn’t change the password. The link may have expired — ask for a new one.',
    pl: 'Nie udało się zmienić hasła. Link mógł wygasnąć — poproś o nowy.',
  },
  hasloZmienione: {
    en: 'Password changed. Taking you to your profile…',
    pl: 'Hasło zmienione. Przenoszę Cię do profilu…',
  },
  otworzZLinku: {
    en: 'Open this page from the link in the reset e-mail — otherwise there’s nothing to change.',
    pl: 'Otwórz tę stronę z linku w mailu resetującym — inaczej nie ma czego zmieniać.',
  },
  ustawNoweHaslo: { en: 'Set new password', pl: 'Ustaw nowe hasło' },

  // — pole hasła —
  poleHaslo: { en: 'Password', pl: 'Hasło' },
  hasloPlaceholder: { en: 'At least 8 characters', pl: 'Co najmniej 8 znaków' },
  pokazHaslo: { en: 'Show password', pl: 'Pokaż hasło' },
  ukryjHaslo: { en: 'Hide password', pl: 'Ukryj hasło' },

  // — tytuły kart przeglądarki —
  tytulStronyLogowanie: { en: 'Sign in — IsaacDex', pl: 'Logowanie — IsaacDex' },
  tytulStronyReset: { en: 'Password reset — IsaacDex', pl: 'Reset hasła — IsaacDex' },
  tytulStronyNoweHaslo: { en: 'New password — IsaacDex', pl: 'Nowe hasło — IsaacDex' },

  // — podpięcie Steama (kim-jestem) —
  steamOk: {
    en: 'Steam connected. You can sync your achievements now.',
    pl: 'Steam podłączony. Możesz zsynchronizować osiągnięcia.',
  },
  steamNiepotwierdzony: {
    en: 'Steam didn’t confirm the sign-in. Try again.',
    pl: 'Steam nie potwierdził logowania. Spróbuj jeszcze raz.',
  },
  steamZajety: {
    en: 'That Steam account is already pinned to another IsaacDex account.',
    pl: 'To konto Steam jest już przypięte do innego konta w IsaacDex.',
  },
  kontoSteam: { en: 'Steam account', pl: 'Konto Steam' },
  /** Doklejane za linkiem „Zaloguj się" — stąd wiodąca spacja / przecinek. */
  steamGoscPo: {
    en: ' to hook up your Steam and see your own achievements instead of someone else’s.',
    pl: ', żeby podłączyć swojego Steama i widzieć własne osiągnięcia zamiast cudzych.',
  },
  steamPodlaczony: { en: 'Steam connected', pl: 'Steam podłączony' },
  steamZsynchronizowane: { en: ' — achievements synced.', pl: ' — osiągnięcia zsynchronizowane.' },
  steamBezSynchronizacji: { en: ' — not synced yet.', pl: ' — jeszcze bez synchronizacji.' },
  steamBezSteama: {
    en: 'Without Steam, IsaacDex knows none of your achievements or completion marks — your profile stays empty.',
    pl: 'Bez Steama IsaacDex nie zna Twoich osiągnięć ani completion marks — profil będzie pusty.',
  },
  podlaczSteam: { en: 'Connect Steam', pl: 'Podłącz Steam' },
  goscPustaKartaMocne: { en: 'An empty character sheet.', pl: 'Pusta karta postaci.' },
  goscPustaKartaReszta: {
    en: ' Create an account and mould your nickname, bio, avatar and favourite character here — your basement identity.',
    pl: ' Załóż konto, a tu ulepisz swój nick, opis, avatar i ulubioną postać — Twoja piwnicza tożsamość.',
  },

  // — edytor profilu (WHO AM I?) —
  bladAvatara: {
    en: 'Couldn’t upload the avatar. Try again.',
    pl: 'Nie udało się wysłać avatara. Spróbuj jeszcze raz.',
  },
  bladZapisu: { en: 'Couldn’t save.', pl: 'Nie udało się zapisać.' },
  avatarPodpowiedz: {
    en: 'Click to upload your own avatar. Without an image we use your favourite character’s icon.',
    pl: 'Kliknij, by wgrać własny avatar. Bez obrazu użyjemy ikony ulubionej postaci.',
  },
  dekoracjaAvatara: { en: 'Avatar decoration', pl: 'Dekoracja avatara' },
  dekoracjaZablokowana: { en: '{nazwa} (locked)', pl: '{nazwa} (zablokowane)' },
  dekoracjeZablokowane: {
    en: {
      one: '{liczba} decoration locked — unlock achievements in the game.',
      other: '{liczba} decorations locked — unlock achievements in the game.',
    },
    pl: {
      one: '{liczba} dekoracja zablokowana — odblokuj achievementy w grze.',
      few: '{liczba} dekoracje zablokowane — odblokuj achievementy w grze.',
      many: '{liczba} dekoracji zablokowanych — odblokuj achievementy w grze.',
      other: '{liczba} dekoracji zablokowanych — odblokuj achievementy w grze.',
    },
  },
  wpiszNazwe: { en: 'Type a name…', pl: 'Wpisz nazwę…' },
  losoweImie: { en: 'Random name', pl: 'Losowe imię' },
  steamWUstawieniachPrzed: {
    en: 'You set up your Steam account and syncing in ',
    pl: 'Konto Steam i synchronizację ustawisz w ',
  },
  /** Osobno od `wspolne.navUstawienia` — po polsku link stoi w miejscowniku („w Ustawieniach"). */
  linkUstawienia: { en: 'Settings', pl: 'Ustawieniach' },
  poleOpis: { en: 'About you…', pl: 'Opis…' },
  opisPlaceholder: { en: 'A few words about yourself…', pl: 'Kilka słów o sobie…' },
  ustawUlubionaPostac: { en: 'Pick your favourite character', pl: 'Ustaw ulubioną postać' },
  brakUlubionejPostaci: { en: 'No favourite character', pl: 'Brak ulubionej postaci' },
  zapisuje: { en: 'Saving…', pl: 'Zapisuję…' },
  zapiszProfil: { en: 'Save profile', pl: 'Zapisz profil' },

  // — usuwanie konta —
  usunKonto: { en: 'Delete account', pl: 'Usuń konto' },
  potwierdzUsuniecie: { en: 'Confirm account deletion', pl: 'Potwierdź usunięcie konta' },
  tak: { en: 'Yes', pl: 'Tak' },
  nie: { en: 'No', pl: 'Nie' },

  /** Zapasowy nick dla świeżego konta ze Steama, gdy persona się nie pobrała. */
  nickZeSteamZapasowy: { en: 'Player{koncowka}', pl: 'Gracz{koncowka}' },
} satisfies Przestrzen
