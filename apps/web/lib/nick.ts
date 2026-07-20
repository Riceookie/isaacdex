/**
 * Reguły nicku — w OSOBNYM pliku, bo potrzebuje ich i serwer (walidacja rejestracji,
 * zakładanie gracza), i przeglądarka (atrybuty `minLength`/`maxLength` na formularzu).
 * Gdyby siedziały w `lib/konto.ts`, import z komponentu klienckiego wciągnąłby do bundla
 * Prismę — a razem z nią pół backendu.
 */

export const NICK_MIN = 3

/** Dłuższe nicki rozpychały nagłówek profilu i karty w feedzie. */
export const NICK_MAX = 20

/**
 * Przycięcie nicku do limitu. Potrzebne przy nickach, których użytkownik NIE wpisuje
 * ręcznie w naszym formularzu — persona ze Steama albo część adresu e-mail bywa dłuższa
 * niż limit, a wtedy nie ma komu pokazać błędu walidacji.
 */
export const przytnijNick = (nick: string) => nick.trim().slice(0, NICK_MAX)

/**
 * Od ilu znaków nick jest „długi" i nagłówek profilu ma zejść z rozmiarem czcionki.
 * CSS sam tego nie policzy (nie ma selektora „po długości treści"), więc próg jest tutaj
 * i wraca do widoku jako klasa `dlugi`.
 *
 * 16, nie 20: przy foncie display 20 znaków już nie mieści się w jednej linijce kolumny
 * tożsamości, a to właśnie moment, w którym warto zmniejszyć, zamiast łamać.
 */
export const NICK_DLUGI = 16
