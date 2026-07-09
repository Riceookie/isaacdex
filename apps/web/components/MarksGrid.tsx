'use client'

import { useState } from 'react'
import Sprite from '@/components/Sprite'

type Props = {
  postac: string
  bossy: string[]
  tryby: string[]
  zaznaczone: string[]
}

export default function MarksGrid({ postac, bossy, tryby, zaznaczone }: Props) {
  const [set, setSet] = useState<Set<string>>(new Set(zaznaczone))
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  async function toggle(boss: string, tryb: string) {
    setErr(null)
    const key = `${boss}:${tryb}`
    const zaliczone = !set.has(key)
    setBusy(key)
    try {
      const res = await fetch('/api/completion', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ postac, boss, tryb, zaliczone }),
      })
      const d = await res.json()
      if (!res.ok) {
        setErr(d.error)
        return
      }
      setSet((prev) => {
        const n = new Set(prev)
        if (zaliczone) n.add(key)
        else n.delete(key)
        return n
      })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      {err && (
        <p className="banner error">
          <Sprite name="bomb" size={18} /> {err}
        </p>
      )}
      <table className="marks">
        <thead>
          <tr>
            <th>Boss</th>
            {tryby.map((t) => (
              <th key={t}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bossy.map((b) => (
            <tr key={b}>
              <td>{b.replace(/_/g, ' ')}</td>
              {tryby.map((t) => {
                const key = `${b}:${t}`
                const on = set.has(key)
                return (
                  <td key={t}>
                    <button
                      className={'mark ' + (on ? 'on' : '')}
                      disabled={busy === key}
                      onClick={() => toggle(b, t)}
                      title={on ? 'Odznacz' : 'Zaznacz'}
                    >
                      {on ? '✓' : ''}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
