'use client'

import { useMemo, useState } from 'react'
import { KATEGORIE, szukaj, type KatNaklejki } from '@/lib/naklejki'
import { useT } from '@/components/JezykProvider'
import type { Klucz } from '@/lib/i18n/slownik'

/** Nazwy zakładek żyją w słowniku — w `KATEGORIE` zostaje samo `id` i kolejność. */
const KLUCZ_KATEGORII: Record<KatNaklejki, Klucz> = {
  itemy: 'czat.katItemy',
  trinkety: 'czat.katTrinkety',
  pickupy: 'czat.katPickupy',
}

/**
 * Przeglądarka katalogu naklejek: zakładki (itemy/trinkety/pickupy) + szukajka + siatka.
 *
 * Wspólna dla naklejek i reakcji — jedno i drugie wybiera się z tego samego kompletu
 * ~950 ikon, różni je tylko to, co dzieje się po kliknięciu (wstawienie tokenu w treść
 * vs. dopisanie reakcji pod wiadomością). Sam popover (pozycja, zamykanie) jest wyżej.
 *
 * `loading="lazy"`: w zakładce „Itemy" stoi 719 obrazków i bez tego przeglądarka
 * ciągnęłaby komplet przy każdym otwarciu, choć w kadrze mieści się kilkanaście.
 */
export default function KatalogNaklejek({
  onWybierz,
  etykieta,
}: {
  onWybierz: (id: string) => void
  /**
   * Do czego służy kafelek — decyduje o `aria-label` („Naklejka …" albo „Reakcja …").
   * To znacznik, nie gotowy napis: tekst bierze się ze słownika, więc idzie za językiem.
   */
  etykieta: 'Naklejka' | 'Reakcja'
}) {
  const t = useT()
  const [kat, setKat] = useState<KatNaklejki>('itemy')
  const [fraza, setFraza] = useState('')

  const widoczne = useMemo(() => szukaj(kat, fraza), [kat, fraza])

  return (
    <>
      <div className="cz-picker-head">
        <input
          className="cz-picker-szukaj"
          type="search"
          placeholder={t('czat.szukajPlaceholder')}
          value={fraza}
          onChange={(e) => setFraza(e.target.value)}
          autoFocus
        />
      </div>

      <div className="cz-naklejki-zakladki" role="tablist">
        {KATEGORIE.map((k) => (
          <button
            key={k.id}
            type="button"
            role="tab"
            aria-selected={kat === k.id}
            className={'cz-naklejki-zakladka' + (kat === k.id ? ' tu' : '')}
            onClick={() => setKat(k.id)}
          >
            {t(KLUCZ_KATEGORII[k.id])}
          </button>
        ))}
      </div>

      <div className="cz-picker-siatka cz-naklejki-siatka">
        {widoczne.length === 0 && (
          <p className="muted small cz-picker-pusto">{t('czat.nicTakiego')}</p>
        )}
        {widoczne.map((n) => (
          <button
            key={n.id}
            type="button"
            className="cz-picker-btn"
            onClick={() => onWybierz(n.id)}
            title={n.nazwa}
            aria-label={t(
              etykieta === 'Naklejka' ? 'czat.etykietaNaklejki' : 'czat.etykietaReakcji',
              { nazwa: n.nazwa },
            )}
          >
            <img
              src={n.src}
              alt=""
              width={22}
              height={22}
              loading="lazy"
              decoding="async"
              className="sprite"
              aria-hidden
              draggable={false}
            />
          </button>
        ))}
      </div>
    </>
  )
}
