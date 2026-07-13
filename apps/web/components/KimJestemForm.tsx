'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import AvatarUpload from '@/components/AvatarUpload'
import { DECORATIONS, DEFAULT_DECOR, decorOdblokowana, type DecorId } from '@/lib/pfpDecor'

type Props = {
  nick: string
  opis: string
  ulubionaPostac: string
  steamId: string
  zsynchronizowano: boolean
  postacie: string[]
  odblokowane: string[]
}

// Losowe imiona w klimacie TBOI.
const IMIONA = [
  'Isaac',
  'Azazel',
  'Guppy',
  'Krampus',
  'Cain',
  'Lilith',
  'Bethany',
  'The Lost',
  'Maggy',
  'Blue Baby',
  'Apollyon',
  'Jacob',
]

export default function KimJestemForm(p: Props) {
  const router = useRouter()
  const [nick, setNick] = useState(p.nick)
  const [opis, setOpis] = useState(p.opis)
  const [ulubiona, setUlubiona] = useState(p.ulubionaPostac)
  // Avatar i dekoracja pfp = preferencje lokalne. Trzymamy je ROBOCZO w stanie i
  // utrwalamy (localStorage + event) dopiero przy „Zapisz", żeby zmiana nie „przeciekała"
  // na resztę apki po samym wybraniu i przejściu na inną zakładkę bez zapisu.
  const [avatar, setAvatar] = useState<string | null>(null)
  const [decor, setDecor] = useState<DecorId>(DEFAULT_DECOR)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const odblokSet = new Set(p.odblokowane)

  useEffect(() => {
    setAvatar(localStorage.getItem('idx_avatar'))
    setDecor((localStorage.getItem('idx_pfp_decor') as DecorId) || DEFAULT_DECOR)
  }, [])

  function losujImie() {
    const i = Math.floor((Date.now() / 7) % IMIONA.length)
    setNick(IMIONA[i])
  }

  async function zapisz() {
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch('/api/profil', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nick, opis, ulubionaPostac: ulubiona }),
      })
      if (!r.ok) {
        const d = await r.json()
        setMsg(d.error || 'Nie udało się zapisać.')
        return
      }
      // Utrwal preferencje lokalne dopiero teraz i powiadom resztę apki.
      if (avatar) localStorage.setItem('idx_avatar', avatar)
      else localStorage.removeItem('idx_avatar')
      localStorage.setItem('idx_pfp_decor', decor)
      window.dispatchEvent(new Event('idx-avatar'))
      window.dispatchEvent(new Event('idx-decor'))
      router.push('/profil')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="whoami">
      <h1>WHO AM I?</h1>

      <div className="whoami-top">
        <AvatarUpload
          fallbackSrc={ikonaPostaci(ulubiona || 'Isaac')}
          value={avatar}
          onPick={setAvatar}
          decor={decor}
        />
        <div className="whoami-avatar-side">
          <p className="small muted whoami-avatar-cap">
            Kliknij, by wgrać własny avatar. Bez obrazu użyjemy ikony ulubionej postaci.
          </p>
          <span className="side-label">Dekoracja avatara</span>
          <div className="decor-picker">
            {DECORATIONS.map((d) => {
              const locked = !decorOdblokowana(d, odblokSet)
              return (
                <button
                  key={d.id}
                  type="button"
                  className={
                    'decor-pick' + (decor === d.id ? ' sel' : '') + (locked ? ' locked' : '')
                  }
                  onClick={() => !locked && setDecor(d.id)}
                  disabled={locked}
                  data-tip={locked ? d.unlock?.text : d.label}
                  aria-label={locked ? `${d.label} (zablokowane)` : d.label}
                >
                  <span className="decor-swatch">
                    {d.id === 'none' ? (
                      <span className="decor-none">✕</span>
                    ) : (
                      <img
                        className="sprite"
                        src={d.thumb || d.overlay}
                        alt=""
                        style={d.thumbScale ? { transform: `scale(${d.thumbScale})` } : undefined}
                      />
                    )}
                  </span>
                  {locked && (
                    <svg
                      className="decor-lock"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2a4 4 0 00-4 4v3H6.5A1.5 1.5 0 005 10.5v9A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0017.5 9H16V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3h-4V6z" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
          {(() => {
            const d = DECORATIONS.find((x) => x.id === decor)
            const locked = d && !decorOdblokowana(d, odblokSet)
            const zablokowane = DECORATIONS.filter((x) => !decorOdblokowana(x, odblokSet))
            if (locked && d?.unlock) {
              return <p className="decor-req">{d.unlock.text}</p>
            }
            if (zablokowane.length) {
              return (
                <p className="small muted decor-hint">
                  {zablokowane.length} dekoracji zablokowanych — odblokuj achievementy w grze.
                </p>
              )
            }
            return null
          })()}
        </div>
      </div>

      <div className="whoami-name">
        <label>
          Wpisz nazwę…
          <span className="name-row">
            <input
              className="input grow"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              maxLength={40}
            />
            <button className="dice" type="button" onClick={losujImie} data-tip="Losowe imię">
              <Sprite name="d6" size={20} />
            </button>
          </span>
        </label>
      </div>

      <p className="small muted whoami-hint">
        Konto Steam i synchronizację ustawisz w <a href="/ustawienia">Ustawieniach</a>.
      </p>

      <div className="whoami-sides">
        <div className="side-note">
          <label>
            Opis…
            <textarea
              className="input"
              rows={3}
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              maxLength={300}
              placeholder="Kilka słów o sobie…"
            />
          </label>
        </div>
        <div className="side-note">
          <span className="side-label">Ustaw ulubioną postać</span>
          <div className="char-picker">
            {p.postacie.map((n) => (
              <button
                key={n}
                type="button"
                className={'char-pick' + (ulubiona === n ? ' sel' : '')}
                onClick={() => setUlubiona(ulubiona === n ? '' : n)}
                data-tip={n}
              >
                <img src={ikonaPostaci(n)} alt={n} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {msg && (
        <p className="banner error">
          <Sprite name="bomb" size={18} /> {msg}
        </p>
      )}
      <button className="btn full" onClick={zapisz} disabled={busy}>
        {busy ? 'Zapisuję…' : 'Zapisz profil'}
      </button>
    </div>
  )
}
