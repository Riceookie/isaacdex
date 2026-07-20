'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
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
  const t = useT()
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
      throw new Error(d.error || t('kolekcja.markBladZapisu'))
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
      setErr(e instanceof Error ? e.message : t('kolekcja.markBlad'))
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
          data-tip={t('kolekcja.zmienPostac')}
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
              // Nazwa bossa (labels) zostaje po angielsku — tłumaczy się tylko podpowiedź.
              data-tip={(labels[b] || b) + t(on ? 'kolekcja.markOdznacz' : 'kolekcja.markZalicz')}
            >
              <img src={`/tboi/marks/${b}.webp`} alt={labels[b] || b} />
            </button>
          )
        })}
      </div>

      <p className="muted small" dangerouslySetInnerHTML={{ __html: t('kolekcja.markiPrzypis') }} />
    </div>
  )
}
