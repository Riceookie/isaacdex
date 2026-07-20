/**
 * Ile pedestałów stoi w gablocie profilu — JEDNO źródło prawdy.
 *
 * Osobny plik, bo liczbę musi znać i komponent kliencki (`components/Gablota`), i endpoint
 * zapisu (`/api/profil` przycina listę, zanim wsadzi ją do bazy). Wcześniej każde z tych
 * miejsc miało własną trójkę: podniesienie liczby w komponencie zostawiało zapis na trzech
 * itemach, więc czwarty pedestał dało się wypełnić najwyżej do odświeżenia strony.
 * Import wprost z `components/Gablota` nie wchodzi w grę — wciągnąłby Reacta do route
 * handlera na serwerze.
 *
 * Zmiana tej liczby nie wymaga migracji: `Gracz.gablota` to `String[]` bez limitu długości.
 */
export const MIEJSC_GABLOTY = 5
