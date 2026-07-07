'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Ach = {
  apiName: string
  nazwa: string
  opis: string | null
  ikonaUrl: string | null
  globalnyProcent: number | null
  odblokowany: boolean
  dataOdblokowania: string | null
}

function rzadka(p: number | null) {
  return p != null && p < 5
}

export default function KolekcjaWidok({ achievements }: { achievements: Ach[] }) {
  const router = useRouter()
  const [sel, setSel] = useState<Ach | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const unlocked = achievements.filter((a) => a.odblokowany).length

  async function sync() {
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch('/api/sync', { method: 'POST' })
      const d = await r.json()
      if (!r.ok) {
        setMsg(d.error || 'Nie udało się zsynchronizować.')
        return
      }
      router.refresh()
    } catch {
      setMsg('Błąd sieci przy synchronizacji.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <div className="kol-head">
        <h1>📖 Kolekcja</h1>
        <button className="btn" onClick={sync} disabled={busy}>
          {busy ? 'Synchronizuję…' : 'Synchronizuj ze Steam'}
        </button>
      </div>

      {achievements.length > 0 ? (
        <p className="muted">
          Odblokowane <b>{unlocked}</b> / {achievements.length}
        </p>
      ) : (
        <div className="note">
          <p>Brak danych. Kliknij „Synchronizuj ze Steam", żeby zassać swoje achievementy.</p>
        </div>
      )}
      {msg && <p className="banner error">⚠️ {msg}</p>}

      <div className="ach-grid">
        {achievements.map((a) => (
          <button
            key={a.apiName}
            className={
              'ach ' + (a.odblokowany ? 'on' : 'off') + (rzadka(a.globalnyProcent) ? ' rare' : '')
            }
            onClick={() => setSel(a)}
            data-tip={a.nazwa}
          >
            {a.ikonaUrl ? (
              <img src={a.ikonaUrl} alt={a.nazwa} loading="lazy" />
            ) : (
              <span>?</span>
            )}
          </button>
        ))}
      </div>

      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal note" onClick={(e) => e.stopPropagation()}>
            {sel.ikonaUrl && (
              <img className={'ach-big ' + (sel.odblokowany ? '' : 'off')} src={sel.ikonaUrl} alt="" />
            )}
            <h2>{sel.nazwa}</h2>
            <p>{sel.opis}</p>
            <p className="muted small">
              {sel.odblokowany
                ? 'Odblokowane' +
                  (sel.dataOdblokowania
                    ? ': ' + new Date(sel.dataOdblokowania).toLocaleDateString('pl-PL')
                    : '')
                : 'Nie odblokowane'}
              {sel.globalnyProcent != null && ` · globalnie ${sel.globalnyProcent}%`}
              {rzadka(sel.globalnyProcent) && ' 🏆'}
            </p>
            <button className="btn" onClick={() => setSel(null)}>
              Zamknij
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
