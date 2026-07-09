'use client'

import { useState } from 'react'
import Sprite from '@/components/Sprite'

type Wynik = {
  item: string
  jakosc: number
  rekomendacja: string
  powody: string[]
}

export default function AdvisorForm() {
  const [item, setItem] = useState('')
  const [wynik, setWynik] = useState<Wynik | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setWynik(null)
    const res = await fetch(`/api/advice?item=${encodeURIComponent(item.trim())}`)
    const d = await res.json()
    if (!res.ok) setErr(d.error)
    else setWynik(d)
  }

  return (
    <div>
      <form className="row" onSubmit={submit}>
        <input
          className="input grow"
          placeholder="np. Brimstone, The Bible, The Poop…"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <button className="btn">Sprawdź</button>
      </form>
      {err && (
        <p className="banner error">
          <Sprite name="bomb" size={18} /> {err}
        </p>
      )}
      {wynik && (
        <div className={'card rek ' + wynik.rekomendacja}>
          <b>{wynik.item}</b> (Q{wynik.jakosc}) → <b>{wynik.rekomendacja.replace(/_/g, ' ')}</b>
          <ul>
            {wynik.powody.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
