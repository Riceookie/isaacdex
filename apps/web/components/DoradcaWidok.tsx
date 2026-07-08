'use client'

import { useState } from 'react'
import Sprite from '@/components/Sprite'

type Item = {
  nazwa: string
  jakosc: number
  typ: string
  rekomendacja: string
  powody: string[]
}

export default function DoradcaWidok({ items }: { items: Item[] }) {
  const [q, setQ] = useState('')
  const [jak, setJak] = useState<number | null>(null)
  const [sel, setSel] = useState<Item | null>(null)

  const filt = items.filter(
    (i) =>
      (!q || i.nazwa.toLowerCase().includes(q.toLowerCase())) && (jak === null || i.jakosc === jak),
  )

  return (
    <section>
      <h1>
        <Sprite name="advisor" size={24} /> Doradca itemów
      </h1>
      <p className="muted small">Kliknij item, żeby zobaczyć rekomendację „brać czy zostawić".</p>

      <div className="kol-tools">
        <input
          className="input grow"
          placeholder="Szukaj itemu…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="filter-btns">
          <button className={'chip' + (jak === null ? ' on' : '')} onClick={() => setJak(null)}>
            Wszystkie
          </button>
          {[4, 3, 2, 1, 0].map((n) => (
            <button key={n} className={'chip' + (jak === n ? ' on' : '')} onClick={() => setJak(n)}>
              Q{n}
            </button>
          ))}
        </div>
      </div>

      <div className="item-grid">
        {filt.map((i) => (
          <button key={i.nazwa} className={'item-card q' + i.jakosc} onClick={() => setSel(i)}>
            <span className="q-badge">Q{i.jakosc}</span>
            <span className="item-name">{i.nazwa}</span>
          </button>
        ))}
      </div>

      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{sel.nazwa}</h2>
            <p className="muted small">
              Jakość {sel.jakosc} · {sel.typ.toLowerCase()}
            </p>
            <p className={'rek-tag ' + sel.rekomendacja}>{sel.rekomendacja.replace(/_/g, ' ')}</p>
            <ul className="rek-powody">
              {sel.powody.map((pw, idx) => (
                <li key={idx}>{pw}</li>
              ))}
            </ul>
            <button className="btn" onClick={() => setSel(null)}>
              Zamknij
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
