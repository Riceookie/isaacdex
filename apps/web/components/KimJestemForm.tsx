'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import AvatarUpload from '@/components/AvatarUpload'
import DecorMark from '@/components/DecorMark'
import { DECORATIONS, DEFAULT_DECOR, type DecorId } from '@/lib/pfpDecor'

type Props = {
  nick: string
  opis: string
  ulubionaPostac: string
  steamId: string
  zsynchronizowano: boolean
  postacie: string[]
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
            {DECORATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={'decor-pick' + (decor === d.id ? ' sel' : '')}
                onClick={() => setDecor(d.id)}
                data-tip={d.label}
                aria-label={d.label}
              >
                {d.id === 'none' ? (
                  <span className="decor-none">✕</span>
                ) : (
                  <DecorMark id={d.id} className="decor-swatch" />
                )}
              </button>
            ))}
          </div>
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
