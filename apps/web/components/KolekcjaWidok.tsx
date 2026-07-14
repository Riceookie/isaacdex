'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Sprite from '@/components/Sprite'
import EncDetal from '@/components/EncDetal'
import warunki from '@/lib/enc/achievementy.json'
import type { EncWpis } from '@/lib/enc/typy'

const WARUNKI = warunki as Record<string, string>

/** Achievement → wpis Encyklopedii, żeby modal był ten sam co przy itemach. */
function naWpis(a: Ach): EncWpis {
  const warunek = WARUNKI[a.nazwa]
  return {
    id: a.apiName,
    nazwa: a.nazwa,
    ikona: a.ikonaUrl ?? undefined,
    klasa: a.odblokowany ? 'ach-detal' : 'ach-detal zablokowany',
    opis: a.opis ?? '',
    szczegoly: {
      znaczniki: [
        a.odblokowany ? 'odblokowane' : 'zablokowane',
        ...(rzadka(a.globalnyProcent) ? ['rzadkie'] : []),
      ],
      pola: [
        ...(a.globalnyProcent != null
          ? [{ label: 'Ma je globalnie', wartosc: `${a.globalnyProcent}% graczy` }]
          : []),
        ...(a.dataOdblokowania
          ? [
              {
                label: 'Zdobyte',
                wartosc: new Date(a.dataOdblokowania).toLocaleDateString('pl-PL'),
              },
            ]
          : []),
      ],
      pelnyOpis: a.opis ?? undefined,
      // Warunek zdobycia bierzemy z wiki (Steam podaje go tylko dla części achievementów).
      odblokowanie: warunek
        ? { nazwa: 'Jak zdobyć', warunek, zdobyte: a.odblokowany }
        : { nazwa: 'Jak zdobyć', warunek: 'Brak opisu na wiki.', zdobyte: a.odblokowany },
    },
  }
}

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

export default function KolekcjaWidok({
  achievements,
  ostatniSync,
}: {
  achievements: Ach[]
  ostatniSync: string | null
}) {
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
    <section className="note paper-panel">
      <div className="kol-head">
        <button className="btn" onClick={sync} disabled={busy}>
          <Sprite name="gear" size={18} /> {busy ? 'Synchronizuję…' : 'Synchronizuj ze Steam'}
        </button>
        <span className="sync-info muted small">
          {busy
            ? 'Zaciągam achievementy ze Steama…'
            : ostatniSync
              ? `Ostatnia synchronizacja: ${new Date(ostatniSync).toLocaleString('pl-PL', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}`
              : 'Jeszcze nie synchronizowano'}
        </span>
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

      {sel &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="modal-bg" onClick={() => setSel(null)}>
            <EncDetal wpis={naWpis(sel)} onZamknij={() => setSel(null)} />
          </div>,
          document.body,
        )}
    </section>
  )
}
