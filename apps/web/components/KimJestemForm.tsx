'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ikonaPostaci, wlasnyAvatar } from '@/lib/chars'
import { wgrajAvatar } from '@/lib/zalaczniki'
import Sprite from '@/components/Sprite'
import AvatarUpload from '@/components/AvatarUpload'
import { DECORATIONS, decorOdblokowana, type DecorId } from '@/lib/pfpDecor'

type Props = {
  nick: string
  opis: string
  ulubionaPostac: string
  steamId: string
  zsynchronizowano: boolean
  postacie: string[]
  odblokowane: string[]
  /** Avatar i ozdoba z BAZY — widzą je inni gracze, więc nie mogą siedzieć w localStorage. */
  avatar: string | null
  dekoracja: DecorId
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
  /**
   * Avatar i ozdoba idą DO BAZY (widzą je inni), ale trzymamy je roboczo w stanie
   * i zapisujemy dopiero przy „Zapisz" — żeby wybór nie przeciekał na resztę apki
   * po samym kliknięciu i przejściu na inną zakładkę.
   *
   * `foto` to WYŁĄCZNIE wgrane zdjęcie (adres albo data-URL). Kolumna `Gracz.avatar`
   * trzyma jedno z dwojga: zdjęcie ALBO nazwę postaci — i podanie tej drugiej do podglądu
   * kończyło się `<img src="Isaac">`, czyli zepsutą ikoną w edytorze.
   */
  const [foto, setFoto] = useState<string | null>(wlasnyAvatar(p.avatar) ? p.avatar : null)
  const [decor, setDecor] = useState<DecorId>(p.dekoracja)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const odblokSet = new Set(p.odblokowane)

  function losujImie() {
    const i = Math.floor((Date.now() / 7) % IMIONA.length)
    setNick(IMIONA[i])
  }

  async function zapisz() {
    setBusy(true)
    setMsg(null)
    try {
      // Świeżo wybrane zdjęcie jest data-URL-em — najpierw do Storage, dopiero adres do bazy.
      let avatar: string | null = foto
      if (foto?.startsWith('data:')) {
        avatar = await wgrajAvatar(foto)
        if (!avatar) {
          setMsg('Nie udało się wysłać avatara. Spróbuj jeszcze raz.')
          return
        }
      }

      const r = await fetch('/api/profil', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nick,
          opis,
          ulubionaPostac: ulubiona,
          // Bez zdjęcia avatarem zostaje NAZWA POSTACI — `avatarGracza` zamieni ją na głowę.
          avatar: avatar ?? ulubiona ?? 'Isaac',
          dekoracja: decor,
        }),
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
        <AvatarUpload
          fallbackSrc={ikonaPostaci(ulubiona || 'Isaac')}
          value={foto}
          onPick={setFoto}
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
            {/* „Brak" jako jawny kafel: dotąd odznaczało się ponownym kliknięciem w wybraną
                postać, czego nikt nie mógł odgadnąć. */}
            <button
              type="button"
              className={'char-pick char-pick-brak' + (ulubiona === '' ? ' sel' : '')}
              onClick={() => setUlubiona('')}
              data-tip="Brak ulubionej postaci"
              aria-label="Brak ulubionej postaci"
            >
              <span aria-hidden>✕</span>
            </button>
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
