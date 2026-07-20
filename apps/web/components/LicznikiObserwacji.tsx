'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Sprite from '@/components/Sprite'
import LinkGracza from '@/components/LinkGracza'
import DecorMark from '@/components/DecorMark'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import type { GraczKarta } from '@/lib/social'
import { useT } from '@/components/JezykProvider'

type Zakladka = 'obserwujacych' | 'obserwuje'

/** Lista graczy w modalu — ta sama pod obiema zakładkami. */
function Lista({ gracze, pusto }: { gracze: GraczKarta[]; pusto: string }) {
  const t = useT()
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
              <span className={'obs-ava-box' + (g.dekoracja === 'none' ? '' : ' z-decor')}>
                <img
                  className={'obs-ava' + (wlasny ? ' foto' : '')}
                  src={avatarGracza(g.avatar)}
                  alt=""
                  width={32}
                  height={32}
                />
                <DecorMark id={g.dekoracja} />
              </span>
              <span className="obs-kto">
                <b style={g.kolor ? { color: g.kolor } : undefined}>{g.nick}</b>
                <span className="muted small">{g.opis ?? t('profil.bezOpisu')}</span>
              </span>
            </LinkGracza>
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
  const t = useT()
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
          aria-label={t('profil.licznikObserwujacychAria', { liczba: obserwujacych })}
        >
          <Sprite name="friendfinder" size={15} />
          <b>{obserwujacych}</b>
          {/* Sama etykieta — liczba stoi obok w <b>, ale forma i tak idzie za nią
              („1 follower" vs „2 followers"), więc `liczba` musi tu wejść. */}
          <span className="pf-licznik-txt">
            {t('profil.licznikObserwujacych', { liczba: obserwujacych })}
          </span>
        </button>
        <button
          type="button"
          className="pf-licznik"
          onClick={() => setOtwarte('obserwuje')}
          aria-label={t('profil.licznikObserwujeAria', { liczba: obserwuje })}
        >
          <Sprite name="friends" size={15} />
          <b>{obserwuje}</b>
          <span className="pf-licznik-txt">{t('profil.licznikObserwuje')}</span>
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
              aria-label={t('profil.obsModalAria')}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="obs-zakladki" role="tablist">
                <button
                  role="tab"
                  aria-selected={otwarte === 'obserwujacych'}
                  className={'obs-zakladka' + (otwarte === 'obserwujacych' ? ' tu' : '')}
                  onClick={() => setOtwarte('obserwujacych')}
                >
                  <Sprite name="friendfinder" size={16} />{' '}
                  {t('profil.obsZakladkaObserwujacy', { liczba: obserwujacych })}
                </button>
                <button
                  role="tab"
                  aria-selected={otwarte === 'obserwuje'}
                  className={'obs-zakladka' + (otwarte === 'obserwuje' ? ' tu' : '')}
                  onClick={() => setOtwarte('obserwuje')}
                >
                  <Sprite name="friends" size={16} />{' '}
                  {t('profil.obsZakladkaObserwuje', { liczba: obserwuje })}
                </button>
              </div>
              <Lista
                gracze={gracze}
                pusto={
                  otwarte === 'obserwuje'
                    ? t('profil.obsPustoObserwuje', { nick })
                    : t('profil.obsPustoObserwujacych', { nick })
                }
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
