'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sprite from '@/components/Sprite'

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
  const [q, setQ] = useState('')
  const [filtr, setFiltr] = useState<'all' | 'unlocked' | 'locked' | 'rare'>('all')

  const unlocked = achievements.filter((a) => a.odblokowany).length
  const filtrowane = achievements.filter((a) => {
    if (q && !a.nazwa.toLowerCase().includes(q.toLowerCase())) return false
    if (filtr === 'unlocked') return a.odblokowany
    if (filtr === 'locked') return !a.odblokowany
    if (filtr === 'rare') return a.globalnyProcent != null && a.globalnyProcent < 5
    return true
  })

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
        <button className="btn" onClick={sync} disabled={busy}>
          {busy ? 'Synchronizuję…' : 'Synchronizuj ze Steam'}
        </button>
      </div>

      {achievements.length > 0 ? (
        <>
          <p className="muted">
            Odblokowane <b>{unlocked}</b> / {achievements.length}
            {(q || filtr !== 'all') && ` · pokazuję ${filtrowane.length}`}
          </p>
          <div className="kol-tools">
            <input
              className="input grow"
              placeholder="Szukaj achievementu…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="filter-btns">
              {(
                [
                  ['all', 'Wszystkie'],
                  ['unlocked', 'Odblokowane'],
                  ['locked', 'Zablokowane'],
                  ['rare', 'Rzadkie'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  className={'chip' + (filtr === k ? ' on' : '')}
                  onClick={() => setFiltr(k)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="note">
          <p>Brak danych. Kliknij „Synchronizuj ze Steam", żeby zassać swoje achievementy.</p>
        </div>
      )}
      {msg && (
        <p className="banner error">
          <Sprite name="bomb" size={18} /> {msg}
        </p>
      )}

      <div className="ach-grid">
        {filtrowane.map((a) => (
          <button
            key={a.apiName}
            className={
              'ach ' + (a.odblokowany ? 'on' : 'off') + (rzadka(a.globalnyProcent) ? ' rare' : '')
            }
            onClick={() => setSel(a)}
            data-tip={a.nazwa}
          >
            {a.ikonaUrl ? <img src={a.ikonaUrl} alt={a.nazwa} loading="lazy" /> : <span>?</span>}
          </button>
        ))}
      </div>

      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal note" onClick={(e) => e.stopPropagation()}>
            {sel.ikonaUrl && (
              <img
                className={'ach-big ' + (sel.odblokowany ? '' : 'off')}
                src={sel.ikonaUrl}
                alt=""
              />
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
              {rzadka(sel.globalnyProcent) && (
                <>
                  {' '}
                  <Sprite name="coin" size={18} />
                </>
              )}
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
