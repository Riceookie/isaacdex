'use client'

import { useMemo, useState } from 'react'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'

// DEMO: wyszukiwarka/dodawanie znajomych. Realne konta, obserwowanie i zaproszenia
// (Supabase + auth) = projekt końcowy — tu statyczna lista i lokalny stan (bez backendu).

type Osoba = {
  handle: string
  postac: string
  achiev: number
  bio: string
  kolor: string
}

const LUDZIE: Osoba[] = [
  {
    handle: 'VoidKing',
    postac: 'Isaac',
    achiev: 540,
    bio: 'Tainted enjoyer. Seed hunter.',
    kolor: '#8a6fd6',
  },
  {
    handle: 'Lilith',
    postac: 'Lilith',
    achiev: 601,
    bio: 'Incubus × Brimstone albo nic.',
    kolor: '#b06ad6',
  },
  {
    handle: 'Jorge',
    postac: 'Azazel',
    achiev: 388,
    bio: 'Połamane runy to specjalność.',
    kolor: '#c98a4e',
  },
  {
    handle: 'BasementDweller',
    postac: 'The Lost',
    achiev: 641,
    bio: 'Dead God ×3. Baw się dobrze.',
    kolor: '#e5544b',
  },
  {
    handle: 'TaintedLostMain',
    postac: 'Tainted The Lost',
    achiev: 210,
    bio: 'One hit, one life.',
    kolor: '#7fa6c9',
  },
  {
    handle: 'Sarah',
    postac: 'Bethany',
    achiev: 455,
    bio: 'Soul hearts supremacy.',
    kolor: '#5bbf6a',
  },
  { handle: 'Mike', postac: 'Cain', achiev: 300, bio: 'Greed mode farmer.', kolor: '#e5544b' },
  { handle: 'Kuba', postac: 'Jacob', achiev: 512, bio: 'Jacob & Esau to team.', kolor: '#4ea3c9' },
  { handle: 'Nina', postac: 'Magdalene', achiev: 478, bio: 'Healing runs only.', kolor: '#d67ba8' },
  {
    handle: 'GreedEnjoyer',
    postac: 'Apollyon',
    achiev: 333,
    bio: 'Void > wszystko.',
    kolor: '#e0b64c',
  },
]

// Kilka „zaproszeń do znajomych" (mock).
const ZAPROSZENIA_INIT = ['Sarah', 'Kuba']

export default function FriendSearch() {
  const [q, setQ] = useState('')
  const [obserwowani, setObserwowani] = useState<Set<string>>(
    new Set(['Lilith', 'BasementDweller']),
  )
  const [zaproszenia, setZaproszenia] = useState<string[]>(ZAPROSZENIA_INIT)
  const [podglad, setPodglad] = useState<string | null>(null)

  const wyniki = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return LUDZIE
    return LUDZIE.filter((o) => o.handle.toLowerCase().includes(s))
  }, [q])

  function przelaczObserwuj(handle: string) {
    setObserwowani((prev) => {
      const next = new Set(prev)
      if (next.has(handle)) next.delete(handle)
      else next.add(handle)
      return next
    })
  }

  function odpowiedzZaproszenie(handle: string, akceptuj: boolean) {
    setZaproszenia((prev) => prev.filter((h) => h !== handle))
    if (akceptuj) setObserwowani((prev) => new Set(prev).add(handle))
  }

  function osoba(handle: string) {
    return LUDZIE.find((o) => o.handle === handle)
  }

  return (
    <div className="note fs-panel">
      <div className="fs-head">
        <h2>Znajdź graczy</h2>
        <span className="muted small">{obserwowani.size} obserwowanych</span>
      </div>

      {/* Zaproszenia (mock) */}
      {zaproszenia.length > 0 && (
        <div className="fs-invites">
          <span className="side-label">Zaproszenia do znajomych</span>
          {zaproszenia.map((h) => {
            const o = osoba(h)
            if (!o) return null
            return (
              <div className="fs-invite" key={h}>
                <img className="fs-ava" src={ikonaPostaci(o.postac)} alt="" />
                <b style={{ color: o.kolor }}>{o.handle}</b>
                <span className="muted small">chce Cię obserwować</span>
                <span className="fs-invite-btns">
                  <button
                    className="btn xs"
                    type="button"
                    onClick={() => odpowiedzZaproszenie(h, true)}
                  >
                    Akceptuj
                  </button>
                  <button
                    className="chip xs"
                    type="button"
                    onClick={() => odpowiedzZaproszenie(h, false)}
                  >
                    Odrzuć
                  </button>
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Wyszukiwarka */}
      <div className="fs-search">
        <Sprite name="friends" size={18} />
        <input
          className="input grow"
          placeholder="Szukaj graczy po nazwie…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="fs-list">
        {wyniki.length === 0 && <p className="muted small">Brak graczy „{q}".</p>}
        {wyniki.map((o) => {
          const obserwuje = obserwowani.has(o.handle)
          const otwarty = podglad === o.handle
          return (
            <div className={'fs-row' + (otwarty ? ' open' : '')} key={o.handle}>
              <button
                type="button"
                className="fs-row-main"
                onClick={() => setPodglad(otwarty ? null : o.handle)}
                aria-expanded={otwarty}
              >
                <img className="fs-ava" src={ikonaPostaci(o.postac)} alt="" />
                <span className="fs-id">
                  <b style={{ color: o.kolor }}>{o.handle}</b>
                  <span className="muted small">
                    gra jako {o.postac} · {o.achiev} achiev
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={'btn xs fs-follow' + (obserwuje ? ' on' : '')}
                onClick={() => przelaczObserwuj(o.handle)}
              >
                {obserwuje ? 'Obserwujesz' : '+ Obserwuj'}
              </button>

              {otwarty && (
                <div className="fs-preview">
                  <p className="fs-bio">„{o.bio}"</p>
                  <div className="fs-preview-stats">
                    <span>
                      <Sprite name="deadgod" size={15} /> {Math.round((o.achiev / 641) * 100)}% Dead
                      God
                    </span>
                    <span>
                      <Sprite name="godhead" size={15} /> {o.achiev}/641 achiev
                    </span>
                  </div>
                  <p className="muted small">
                    <Sprite name="bomb" size={14} /> Pełny profil innych graczy dojdzie z realnymi
                    kontami (projekt końcowy).
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
