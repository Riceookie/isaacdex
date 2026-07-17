'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Sprite from '@/components/Sprite'
import KlatkiAnim from '@/components/KlatkiAnim'
import { usunKonto } from '@/app/actions/auth'

/**
 * Usuwanie konta z potwierdzeniem w klimacie gry: pergaminowa kartka (.paper) z zakrwawionym
 * rogiem, rysowane „ARE YOU SURE YOU WANT ME TO DIE?" i twarz Isaaca OBOK przycisków, która
 * reaguje na to, co robisz:
 *  - domyślnie smutna,
 *  - najazd na „Nie"  → szczęśliwa (zostajesz!),
 *  - najazd na „Tak"  → mega smutna (odchodzisz…).
 */
export default function UsunKonto() {
  const [otwarte, setOtwarte] = useState(false)
  const [najazd, setNajazd] = useState<'nie' | 'tak' | null>(null)
  const [montaz, setMontaz] = useState(false)

  useEffect(() => setMontaz(true), [])

  // Pod otwartym dialogiem strona się nie scrolluje; Escape zamyka.
  useEffect(() => {
    if (!otwarte) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOtwarte(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [otwarte])

  const twarz = najazd === 'nie' ? 'happy' : najazd === 'tak' ? 'supersad' : 'sad'

  return (
    <>
      <button className="btn danger usun-btn" type="button" onClick={() => setOtwarte(true)}>
        <Sprite name="skull" size={18} /> Usuń konto
      </button>

      {otwarte &&
        montaz &&
        createPortal(
          <div className="modal-bg" onClick={() => setOtwarte(false)}>
            <div
              className="modal paper usun-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Potwierdź usunięcie konta"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nagłówek-rysunek: „ARE YOU SURE YOU WANT ME TO DIE?" */}
              <KlatkiAnim nazwa="sure" className="usun-sure" />

              {/* Twarz stoi OBOK przycisków — patrzy na ciebie, gdy wybierasz. */}
              <div className="usun-dol">
                <KlatkiAnim key={twarz} nazwa={twarz} className={'usun-twarz twarz-' + twarz} />

                <div className="usun-przyciski">
                  <button
                    className="btn usun-nie"
                    type="button"
                    onClick={() => setOtwarte(false)}
                    onMouseEnter={() => setNajazd('nie')}
                    onMouseLeave={() => setNajazd(null)}
                    onFocus={() => setNajazd('nie')}
                    onBlur={() => setNajazd(null)}
                  >
                    Nie
                  </button>
                  <form action={usunKonto}>
                    <button
                      className="btn danger usun-tak"
                      type="submit"
                      onMouseEnter={() => setNajazd('tak')}
                      onMouseLeave={() => setNajazd(null)}
                      onFocus={() => setNajazd('tak')}
                      onBlur={() => setNajazd(null)}
                    >
                      Tak
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
