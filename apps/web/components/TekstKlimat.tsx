'use client'

import { useT } from '@/components/JezykProvider'
import type { Klucz } from '@/lib/i18n/slownik'

/**
 * Jeden przetłumaczony napis z przestrzeni „klimat", jako element Reacta.
 *
 * Po co osobny komponent zamiast zwykłego `t('klimat.…')` w miejscu użycia: teksty klimatu
 * (`PUSTKA`, flavor text pod wpisem, etykiety typów wpisów) mieszkają w `lib/klimat.tsx` —
 * module z DANYMI, w którym nie da się zawołać hooka ani `cookies()`. Gdyby `PUSTKA` oddawała
 * gołe klucze, każde z kilkunastu miejsc użycia (strony serwerowe i komponenty klienckie)
 * musiałoby samo je tłumaczyć. Tutaj tłumaczenie dzieje się dopiero przy renderze, a strony
 * wołające `PUSTKA.brakZnajomych` zostają bez zmian.
 *
 * Komponent jest KLIENCKI, więc działa i w drzewie serwerowym (SSR czyta język z providera
 * wstawionego przez layout), i wewnątrz komponentów klienckich, gdzie `cookies()` nie istnieje.
 *
 * `dangerouslySetInnerHTML` — bo puste stany mają pogrubioną pierwszą frazę jako <b> w treści
 * (ten sam wzorzec co `ustawienia.kartkiOpis`). Źródłem jest wyłącznie nasz słownik, nigdy
 * dane od użytkownika.
 */
export default function TekstKlimat({ k }: { k: Klucz }) {
  const t = useT()
  return <span dangerouslySetInnerHTML={{ __html: t(k) }} />
}
