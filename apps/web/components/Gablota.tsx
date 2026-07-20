'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import ItemSprite from '@/components/ItemSprite'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'

export type ItemDoWyboru = { nazwa: string; idW: number | null; typ: string; jakosc: number }

/** Ile pedestałów stoi w gablocie. Trzy — jak w pokoju z wyborem itemu (Angel/Devil). */
export const MIEJSC = 3

/** Wybór itemu: szukajka + siatka sprite'ów z gry. W portalu, żeby nie rozpychał karty. */
function Wybieraczka({
  itemy,
  juzWybrane,
  onWybierz,
  onZamknij,
}: {
  itemy: ItemDoWyboru[]
  juzWybrane: (string | null)[]
  onWybierz: (nazwa: string) => void
  onZamknij: () => void
}) {
  const t = useT()
  const [fraza, setFraza] = useState('')
  const [montaz, setMontaz] = useState(false)
  useEffect(() => setMontaz(true), [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onZamknij()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onZamknij])

  // 717 itemów naraz zabiłoby scrollowanie — pokazujemy kawałek, resztę odsiewa szukajka.
  const widoczne = useMemo(() => {
    const f = fraza.trim().toLowerCase()
    const pasuje = f ? itemy.filter((i) => i.nazwa.toLowerCase().includes(f)) : itemy
    return pasuje.slice(0, 120)
  }, [fraza, itemy])

  if (!montaz) return null
  return createPortal(
    <div className="modal-bg" onClick={onZamknij}>
      <div
        className="modal paper gab-wybor"
        role="dialog"
        aria-modal="true"
        aria-label={t('profil.gablotaWyborAria')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gab-wybor-head">
          <h3>
            <Sprite name="book" size={18} /> {t('profil.gablotaWybierzItem')}
          </h3>
          <input
            className="gab-szukaj"
            type="search"
            placeholder={t('profil.gablotaSzukajItemu')}
            value={fraza}
            onChange={(e) => setFraza(e.target.value)}
            autoFocus
          />
        </div>
        <div className="gab-siatka">
          {widoczne.map((i) => {
            const juz = juzWybrane.includes(i.nazwa)
            return (
              <button
                key={i.nazwa}
                type="button"
                className={'gab-opcja jakosc-' + i.jakosc + (juz ? ' juz' : '')}
                title={juz ? t('profil.gablotaJuzWystawiony', { nazwa: i.nazwa }) : i.nazwa}
                disabled={juz}
                onClick={() => onWybierz(i.nazwa)}
              >
                <ItemSprite nazwa={i.nazwa} idW={i.idW} typ={i.typ} size={34} />
                <span className="gab-opcja-nazwa">{i.nazwa}</span>
              </button>
            )
          })}
          {widoczne.length === 0 && (
            <p className="muted small">{t('profil.gablotaNicNieZnaleziono')}</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * „Top 3 ulubione przedmioty": trzy pedestały (prawdziwa skała z gry), obok „Ulubionej postaci".
 *
 * `edycja` = to Twój profil: puste pedestały dostają „+", zajęte — „×" do zdjęcia.
 * Na cudzym profilu gablota jest tylko do oglądania.
 *
 * Zawartość idzie DO BAZY (kolumna `Gracz.gablota`). Kiedyś siedziała w localStorage,
 * przez co widziałeś ją tylko Ty — na cudzych profilach pedestały albo świeciły pustkami,
 * albo dostawały itemy zmyślone z nicku.
 */
export default function Gablota({
  itemy = [],
  edycja = false,
  doWyboru = [],
  metaItemow = [],
}: {
  /** Nazwy itemów (null = pusty pedestał) — z bazy, tak samo dla własnego i cudzego profilu. */
  itemy?: (string | null)[]
  edycja?: boolean
  /** Katalog do wybieraczki — potrzebny tylko w trybie edycji. */
  doWyboru?: ItemDoWyboru[]
  /**
   * Metadane WYSTAWIONYCH itemów (jakość, sprite). Osobno od `doWyboru`, bo katalog leci
   * tylko na własny profil (tryb edycji) — bez tego cudza gablota nie znała jakości i jej
   * pedestały były bezbarwne.
   */
  metaItemow?: ItemDoWyboru[]
}) {
  const t = useT()
  const [gniazdo, setGniazdo] = useState<number | null>(null)
  // Stan lokalny tylko po to, żeby klik był natychmiastowy — źródłem prawdy jest baza.
  const [moje, setMoje] = useState<(string | null)[]>(() =>
    Array.from({ length: MIEJSC }, (_, i) => itemy[i] ?? null),
  )

  const lista = edycja ? moje : Array.from({ length: MIEJSC }, (_, i) => itemy[i] ?? null)

  // Katalog (edycja) + metadane wystawionych — jedno źródło dla sprite'a i jakości.
  const mapaItemow = useMemo(
    () => new Map([...metaItemow, ...doWyboru].map((i) => [i.nazwa, i])),
    [metaItemow, doWyboru],
  )

  async function ustaw(i: number, nazwa: string | null) {
    const next = [...lista]
    next[i] = nazwa
    setMoje(next)
    setGniazdo(null)
    // Baza trzyma same nazwy, bez dziur — puste pedestały to po prostu krótsza lista.
    await fetch('/api/profil', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ gablota: next.filter((x): x is string => x != null) }),
    })
  }

  return (
    <div className="note gablota-card">
      <h3>
        <Sprite name="godhead" size={18} /> {t('profil.gablotaNaglowek')}
      </h3>
      <div className="gablota">
        {lista.map((nazwa, i) => {
          const meta = nazwa ? mapaItemow.get(nazwa) : undefined
          return (
            <div
              key={i}
              className={
                'pedestal' +
                (nazwa ? ' pelny' : '') +
                // Kolor jakości na cokole — ta sama skala co w Encyklopedii (Q0…Q4).
                (meta ? ' jakosc-' + meta.jakosc : '')
              }
            >
              <div className="pedestal-item">
                {nazwa ? (
                  <>
                    <ItemSprite
                      nazwa={nazwa}
                      idW={meta?.idW ?? null}
                      typ={meta?.typ}
                      size={40}
                      className="pedestal-sprite"
                    />
                    {edycja && (
                      <button
                        type="button"
                        className="pedestal-x"
                        onClick={() => ustaw(i, null)}
                        aria-label={t('profil.gablotaZdejmij', { nazwa })}
                      >
                        ×
                      </button>
                    )}
                  </>
                ) : edycja ? (
                  <button
                    type="button"
                    className="pedestal-plus"
                    onClick={() => setGniazdo(i)}
                    aria-label={t('profil.gablotaDodaj')}
                  >
                    +
                  </button>
                ) : (
                  <span className="pedestal-pusto" aria-hidden />
                )}
              </div>
              {/* Podstawka — kamienny cokół jak w pokoju z itemem. */}
              <span className="pedestal-cokol" aria-hidden />
              <span className="pedestal-nazwa small muted">{nazwa ?? '—'}</span>
            </div>
          )
        })}
      </div>

      {gniazdo !== null && (
        <Wybieraczka
          itemy={doWyboru}
          juzWybrane={lista}
          onWybierz={(n) => ustaw(gniazdo, n)}
          onZamknij={() => setGniazdo(null)}
        />
      )}
    </div>
  )
}
