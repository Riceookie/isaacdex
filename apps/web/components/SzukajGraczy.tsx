'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { szukajGraczyAkcja } from '@/app/actions/social'
import { KartaGracza } from '@/components/KartaGracza'
import PustyStan from '@/components/PustyStan'
import { useT } from '@/components/JezykProvider'
import { PUSTKA } from '@/lib/klimat'
import type { GraczKarta } from '@/lib/social'

/**
 * Szukajka graczy. Pyta bazę (server action) z opóźnieniem 250 ms od ostatniego znaku,
 * żeby nie strzelać zapytaniem na każdą literę.
 *
 * Wyniki z wolniejszej odpowiedzi nie mogą nadpisać nowszych — stąd `ostatnie`:
 * odpowiedź starsza niż aktualna fraza jest po prostu wyrzucana.
 */
export default function SzukajGraczy() {
  const [q, setQ] = useState('')
  const [wyniki, setWyniki] = useState<GraczKarta[] | null>(null)
  const [czekam, start] = useTransition()
  const ostatnie = useRef('')
  const t = useT()

  useEffect(() => {
    const fraza = q.trim()
    ostatnie.current = fraza

    if (!fraza) {
      setWyniki(null)
      return
    }

    const t = setTimeout(() => {
      start(async () => {
        const znalezione = await szukajGraczyAkcja(fraza)
        if (ostatnie.current === fraza) setWyniki(znalezione)
      })
    }, 250)

    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="szukaj">
      <div className="szukaj-pole">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && setQ('')}
          placeholder={t('spolecznosc.szukajPlaceholder')}
          aria-label={t('spolecznosc.szukajAria')}
          className="input"
        />
        {q && (
          <button
            className="szukaj-x"
            onClick={() => setQ('')}
            aria-label={t('spolecznosc.wyczysc')}
          >
            ×
          </button>
        )}
      </div>

      {wyniki && (
        <div className={'szukaj-wyniki' + (czekam ? ' czeka' : '')}>
          {wyniki.length === 0 ? (
            <PustyStan maly tekst={PUSTKA.brakWynikow} />
          ) : (
            <>
              <p className="muted small szukaj-ile">
                {t('spolecznosc.znaleziono', { liczba: wyniki.length })}
              </p>
              <div className="gracze-siatka">
                {wyniki.map((g) => (
                  <KartaGracza key={g.id} g={g} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
