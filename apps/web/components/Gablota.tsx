'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import ItemSprite from '@/components/ItemSprite'
import Sprite from '@/components/Sprite'

export type ItemDoWyboru = { nazwa: string; idW: number | null; typ: string; jakosc: number }

/** Ile pedestałów stoi w gablocie. Trzy — jak w pokoju z wyborem itemu (Angel/Devil). */
export const MIEJSC = 3
const KLUCZ = 'idx_showcase'

/** Odczyt gabloty z localStorage — zawsze 3 pola, puste jako null. */
export function wczytajGablote(): (string | null)[] {
  if (typeof window === 'undefined') return Array(MIEJSC).fill(null)
  try {
    const raw = JSON.parse(localStorage.getItem(KLUCZ) ?? '[]')
    const lista = Array.isArray(raw) ? raw : []
    return Array.from({ length: MIEJSC }, (_, i) =>
      typeof lista[i] === 'string' ? lista[i] : null,
    )
  } catch {
    return Array(MIEJSC).fill(null)
  }
}

export function zapiszGablote(itemy: (string | null)[]) {
  localStorage.setItem(KLUCZ, JSON.stringify(itemy.slice(0, MIEJSC)))
  window.dispatchEvent(new Event('idx-showcase'))
}

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
        aria-label="Wybierz item do gabloty"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gab-wybor-head">
          <h3>
            <Sprite name="book" size={18} /> Wybierz item
          </h3>
          <input
            className="gab-szukaj"
            type="search"
            placeholder="Szukaj itemu…"
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
                title={juz ? `${i.nazwa} — już w gablocie` : i.nazwa}
                disabled={juz}
                onClick={() => onWybierz(i.nazwa)}
              >
                <ItemSprite nazwa={i.nazwa} idW={i.idW} typ={i.typ} size={34} />
                <span className="gab-opcja-nazwa">{i.nazwa}</span>
              </button>
            )
          })}
          {widoczne.length === 0 && <p className="muted small">Nic takiego nie ma w piwnicy.</p>}
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
 * Na cudzym profilu gablota jest tylko do oglądania (i tak nie mamy gdzie zapisać).
 *
 * Zapis leci do localStorage — tak samo jak avatar, dekoracja pfp i ulubiony item
 * (patrz ProfileAvatar / FavItemBadge). W bazie trzymamy tylko nick/opis/avatar.
 */
export default function Gablota({
  itemy,
  edycja = false,
  doWyboru = [],
}: {
  /** Nazwy itemów (null = pusty pedestał). Dla cudzych profili podane z zewnątrz. */
  itemy?: (string | null)[]
  edycja?: boolean
  /** Katalog do wybieraczki — potrzebny tylko w trybie edycji. */
  doWyboru?: ItemDoWyboru[]
}) {
  // Własna gablota żyje w localStorage, więc czyta się ją po zamontowaniu.
  const [moje, setMoje] = useState<(string | null)[]>(() => Array(MIEJSC).fill(null))
  const [gniazdo, setGniazdo] = useState<number | null>(null)
  const wlasna = itemy === undefined

  useEffect(() => {
    if (!wlasna) return
    const odswiez = () => setMoje(wczytajGablote())
    odswiez()
    window.addEventListener('idx-showcase', odswiez)
    return () => window.removeEventListener('idx-showcase', odswiez)
  }, [wlasna])

  const lista = wlasna ? moje : Array.from({ length: MIEJSC }, (_, i) => itemy?.[i] ?? null)

  const mapaItemow = useMemo(() => new Map(doWyboru.map((i) => [i.nazwa, i])), [doWyboru])

  function ustaw(i: number, nazwa: string | null) {
    const next = [...lista]
    next[i] = nazwa
    setMoje(next)
    zapiszGablote(next)
    setGniazdo(null)
  }

  return (
    <div className="note gablota-card">
      <h3>
        <Sprite name="godhead" size={18} /> Top 3 ulubione przedmioty
      </h3>
      <div className="gablota">
        {lista.map((nazwa, i) => {
          const meta = nazwa ? mapaItemow.get(nazwa) : undefined
          return (
            <div key={i} className={'pedestal' + (nazwa ? ' pelny' : '')}>
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
                        aria-label={`Zdejmij ${nazwa} z gabloty`}
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
                    aria-label="Dodaj item do gabloty"
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
