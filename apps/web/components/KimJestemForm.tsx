'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
  const [steam, setSteam] = useState(p.zsynchronizowano)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

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
        <div className="whoami-avatar-col">
          <span className="hand-note">
            kliknij aby
            <br />
            zmienić profil
            <br />
            ————→
          </span>
        </div>
        <button className="avatar-box" title="Zmiana awatara — wkrótce" type="button">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="25" rx="15" ry="17" fill="#f7f2e6" stroke="#14100b" strokeWidth="2" />
            <circle cx="18" cy="24" r="2.4" fill="#14100b" />
            <circle cx="30" cy="24" r="2.4" fill="#14100b" />
            <path d="M19 33 Q24 30 29 33" stroke="#14100b" strokeWidth="1.6" fill="none" />
          </svg>
        </button>
        <span className="red-note">← domyślny profil</span>
      </div>

      <div className="whoami-name">
        <label>
          Wpisz nazwę…
          <span className="name-row">
            <input className="input grow" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={40} />
            <button className="dice" type="button" onClick={losujImie} data-tip="Losowe imię">
              🎲
            </button>
            <span className="red-note">← losowe</span>
          </span>
        </label>
      </div>

      <label className="steam-check">
        <input type="checkbox" checked={steam} onChange={(e) => setSteam(e.target.checked)} />
        Użyć Steam do achievementów?
      </label>
      {steam && (
        <p className="small">
          Steam: <b>{p.steamId}</b> {p.zsynchronizowano ? '· zsynchronizowano ✓' : ''} —{' '}
          <a href="/kolekcja">idź do Kolekcji, by zsynchronizować</a>
        </p>
      )}

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
          <label>
            Ustaw ulubioną postać
            <select className="input" value={ulubiona} onChange={(e) => setUlubiona(e.target.value)}>
              <option value="">— ?</option>
              {p.postacie.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {msg && <p className="banner error">⚠️ {msg}</p>}
      <button className="btn full" onClick={zapisz} disabled={busy}>
        {busy ? 'Zapisuję…' : 'Zapisz profil'}
      </button>
    </div>
  )
}
