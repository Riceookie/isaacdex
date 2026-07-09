'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sprite from '@/components/Sprite'
import { ikonaPostaci } from '@/lib/chars'

type Props = {
  postac: string
  bossy: string[]
  zaznaczone: string[] // klucze "BOSS:HARD"
  labels: Record<string, string>
  roster: string[]
}

/**
 * Ekran save-file: klikalna siatka completion marks (ręczna korekta, gdy apka źle
 * wczytała achievement) + klik w portret zmienia postać. Mark = tryb HARD; włączenie
 * ustawia najpierw NORMAL (wymóg reguły), wyłączenie zdejmuje HARD.
 */
export default function MarksBoard({ postac, bossy, zaznaczone, labels, roster }: Props) {
  const [done, setDone] = useState<Set<string>>(new Set(zaznaczone.map((z) => z.split(':')[0])))
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const doneCount = bossy.filter((b) => done.has(b)).length
  const pct = bossy.length ? Math.round((doneCount / bossy.length) * 100) : 0

  async function poslij(boss: string, tryb: string, zaliczone: boolean) {
    const res = await fetch('/api/completion', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ postac, boss, tryb, zaliczone }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      throw new Error(d.error || 'Nie udało się zapisać marka.')
    }
  }

  async function toggle(boss: string) {
    if (busy) return
    setErr(null)
    setBusy(boss)
    const wlacz = !done.has(boss)
    try {
      if (wlacz) {
        await poslij(boss, 'NORMAL', true) // HARD wymaga zaliczonego NORMAL
        await poslij(boss, 'HARD', true)
      } else {
        await poslij(boss, 'HARD', false)
      }
      setDone((prev) => {
        const n = new Set(prev)
        if (wlacz) n.add(boss)
        else n.delete(boss)
        return n
      })
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Błąd zapisu.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="savefile">
      <div className="savefile-head">
        <button
          className="char-portrait"
          onClick={() => setPickerOpen((o) => !o)}
          aria-expanded={pickerOpen}
          data-tip="Zmień postać"
        >
          <img className="char-icon big" src={ikonaPostaci(postac)} alt={postac} />
        </button>
        <div>
          <h1>{postac}</h1>
          <p className="muted small">
            {doneCount}/{bossy.length} completion marks · {pct}%
          </p>
        </div>
      </div>

      {pickerOpen && (
        <div className="char-picker mb">
          {roster.map((r) => (
            <Link
              key={r}
              href={`/profil/${encodeURIComponent(r)}`}
              className={'char-pick' + (r === postac ? ' sel' : '')}
              data-tip={r}
            >
              <img src={ikonaPostaci(r)} alt={r} />
            </Link>
          ))}
        </div>
      )}

      {err && (
        <p className="banner error">
          <Sprite name="bomb" size={20} /> {err}
        </p>
      )}

      <div className="marks-grid">
        {bossy.map((b) => {
          const on = done.has(b)
          return (
            <button
              key={b}
              className={'mark-cell' + (on ? ' on' : '') + (busy === b ? ' busy' : '')}
              onClick={() => toggle(b)}
              disabled={busy === b}
              data-tip={
                (labels[b] || b) + (on ? ' — kliknij, by odznaczyć' : ' — kliknij, by zaliczyć')
              }
            >
              <img src={`/tboi/marks/${b}.webp`} alt={labels[b] || b} />
            </button>
          )
        })}
      </div>

      <p className="muted small">
        Marki wyliczają się z achievementów (Steam), ale możesz je <b>kliknąć</b>, by ręcznie
        poprawić, gdyby coś się nie zgadzało. Czerwone = Hard.
      </p>
    </div>
  )
}
