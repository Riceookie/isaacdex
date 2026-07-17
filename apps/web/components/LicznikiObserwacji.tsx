'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Sprite from '@/components/Sprite'
import LinkGracza from '@/components/LinkGracza'
import DecorMark from '@/components/DecorMark'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import { dekoracjaGracza, statyGracza } from '@/lib/klimat'
import type { GraczKarta } from '@/lib/social'

type Zakladka = 'obserwujacych' | 'obserwuje'

/** Lista graczy w modalu — ta sama pod obiema zakładkami. */
function Lista({ gracze, pusto }: { gracze: GraczKarta[]; pusto: string }) {
  if (gracze.length === 0) return <p className="muted small obs-pusto">{pusto}</p>
  return (
    <ul className="obs-lista">
      {gracze.map((g) => {
        const wlasny = wlasnyAvatar(g.avatar)
        return (
          <li key={g.id}>
            {/* Bez dymka: wiersz listy JEST już wizytówką, więc drugi dymek nad nim
                to tylko zasłanianie tego, co użytkownik właśnie czyta. */}
            <LinkGracza nick={g.nick} ja={g.ja} dymek={false} className="obs-wiersz">
              <span
                className={
                  'obs-ava-box' + (dekoracjaGracza(g.nick, wlasny) === 'none' ? '' : ' z-decor')
                }
              >
                <img
                  className={'obs-ava' + (wlasny ? ' foto' : '')}
                  src={avatarGracza(g.avatar)}
                  alt=""
                  width={32}
                  height={32}
                />
                <DecorMark id={dekoracjaGracza(g.nick, wlasny)} />
              </span>
              <span className="obs-kto">
                <b style={g.kolor ? { color: g.kolor } : undefined}>{g.nick}</b>
                <span className="muted small">{g.opis ?? 'Bez opisu.'}</span>
              </span>
            </LinkGracza>
            <span className="obs-pct muted small">{statyGracza(g.nick).procent}%</span>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Obserwujący / Obserwuje — dwa duże, klikalne liczniki pod nickiem.
 *
 * Klik otwiera modal z PRAWDZIWĄ listą (tabela Obserwacja), z zakładkami, żeby nie
 * mnożyć dwóch osobnych okien. Listy przychodzą z serwera gotowe — bez backendowego
 * fetcha, bo profil i tak jest `force-dynamic`.
 */
export default function LicznikiObserwacji({
  nick,
  obserwujacych,
  obserwuje,
  listaObserwujacych,
  listaObserwowanych,
}: {
  nick: string
  obserwujacych: number
  obserwuje: number
  listaObserwujacych: GraczKarta[]
  listaObserwowanych: GraczKarta[]
}) {
  const [otwarte, setOtwarte] = useState<Zakladka | null>(null)
  const [montaz, setMontaz] = useState(false)
  useEffect(() => setMontaz(true), [])

  useEffect(() => {
    if (!otwarte) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOtwarte(null)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [otwarte])

  const gracze = otwarte === 'obserwuje' ? listaObserwowanych : listaObserwujacych

  return (
    <>
      <div className="pf-liczniki">
        <button
          type="button"
          className="pf-licznik"
          onClick={() => setOtwarte('obserwujacych')}
          aria-label={`${obserwujacych} obserwujących — pokaż listę`}
        >
          <Sprite name="friendfinder" size={15} />
          <b>{obserwujacych}</b>
          <span className="pf-licznik-txt">obserwujących</span>
        </button>
        <button
          type="button"
          className="pf-licznik"
          onClick={() => setOtwarte('obserwuje')}
          aria-label={`obserwuje ${obserwuje} — pokaż listę`}
        >
          <Sprite name="friends" size={15} />
          <b>{obserwuje}</b>
          <span className="pf-licznik-txt">obserwuje</span>
        </button>
      </div>

      {otwarte &&
        montaz &&
        createPortal(
          <div className="modal-bg" onClick={() => setOtwarte(null)}>
            <div
              className="modal paper obs-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Obserwujący i obserwowani"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="obs-zakladki" role="tablist">
                <button
                  role="tab"
                  aria-selected={otwarte === 'obserwujacych'}
                  className={'obs-zakladka' + (otwarte === 'obserwujacych' ? ' tu' : '')}
                  onClick={() => setOtwarte('obserwujacych')}
                >
                  <Sprite name="friendfinder" size={16} /> Obserwujący ({obserwujacych})
                </button>
                <button
                  role="tab"
                  aria-selected={otwarte === 'obserwuje'}
                  className={'obs-zakladka' + (otwarte === 'obserwuje' ? ' tu' : '')}
                  onClick={() => setOtwarte('obserwuje')}
                >
                  <Sprite name="friends" size={16} /> Obserwuje ({obserwuje})
                </button>
              </div>
              <Lista
                gracze={gracze}
                pusto={
                  otwarte === 'obserwuje'
                    ? `${nick} nikogo jeszcze nie obserwuje.`
                    : `Nikt jeszcze nie obserwuje ${nick}.`
                }
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
