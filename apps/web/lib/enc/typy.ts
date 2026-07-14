/**
 * Wspólny kształt wpisu Encyklopedii — jeden typ dla wszystkich 8 sekcji.
 * Musi być SERIALIZOWALNY (server component → client `EncLista`), więc żadnych funkcji.
 */

/** Szczegóły w widoku detalu (układ jak w wiki Isaaca). Każde pole opcjonalne — sekcje
 *  wypełniają tylko to, co mają w danych. */
export type EncSzczegoly = {
  cytat?: string // tekst z gry, kursywą pod nazwą („Blood laser barrage")
  znaczniki?: string[] // chipy pod nazwą (typ, rzadkość, status) — wspólny „paszport" wpisu
  jakosc?: number // 0–4 → gwiazdki
  pola?: { label: string; wartosc: string }[] // ID, typ, ładunek…
  pule?: string[] // skąd wypada
  efekty?: string[] // co zmienia (staty)
  // Powiązane itemy z ikonami: startowe (postacie) albo zestaw transformacji.
  // `typ: 'TRINKET'` jest konieczne — id trinketów kolidują z id itemów.
  itemy?: { idW: number; nazwa: string; typ?: string }[]
  itemyTytul?: string // nagłówek tej sekcji (domyślnie „Itemy startowe")
  // „Wygląd" — do trzech podglądów: postać/portret, sprite z gry i efekt łez.
  podglad?: {
    postac?: string
    podpis?: string
    gra?: string // sprite tak, jak byt wygląda w grze (bossowie)
    podpisGra?: string
    lzy?: string
  }
  pelnyOpis?: string // opis efektu
  odblokowanie?: {
    nazwa: string // achievement odblokowujący
    warunek?: string // jak go zdobyć
    zdobyte?: boolean // czy gracz go ma (ze Steama)
  }
}

export type EncWpis = {
  id: string
  nazwa: string

  // ── ikona: albo sprite itemu (po idW/nazwie), albo gotowa ścieżka do obrazka ──
  idW?: number | null // Item.idW → ItemSprite dobiera sprite pewnie
  typ?: string // PASYWNY/AKTYWNY (ItemSprite rozróżnia foldery)
  ikona?: string // ścieżka (np. portret postaci) — ma pierwszeństwo przed idW

  odznaka?: string // narożnik karty, np. „Q4"
  klasa?: string // modyfikator karty, np. „q4" (kolorowa lewa krawędź — już w CSS)
  opis: string // jednolinijkowy opis na karcie
  grupy?: string[] // przynależność do filtrów (chipy)
  waga?: number // do sortowania „po ważności" (jakość itemu, % postępu postaci…)

  szczegoly?: EncSzczegoly
}

/** Definicja jednego chipa filtra nad siatką. */
export type EncFiltr = { id: string; label: string }
