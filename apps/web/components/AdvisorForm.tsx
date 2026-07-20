'use client'

import { useState } from 'react'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
import type { Klucz } from '@/lib/i18n/slownik'

type Wynik = {
  item: string
  jakosc: number
  rekomendacja: string
  powody: string[]
}

/**
 * Werdykt wraca z @isaacdex/core jako stała (BIERZ, UWAGA…) — surowa wartość dalej nadaje
 * klasę CSS, a użytkownikowi pokazujemy jej tłumaczenie.
 */
const REKOMENDACJE: Record<string, Klucz> = {
  BIERZ: 'kolekcja.rekBierz',
  ZWYKLE_WARTO: 'kolekcja.rekZwykleWarto',
  SYTUACYJNIE: 'kolekcja.rekSytuacyjnie',
  RACZEJ_POMIN: 'kolekcja.rekRaczejPomin',
  UWAGA: 'kolekcja.rekUwaga',
}

export default function AdvisorForm() {
  const t = useT()
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
          placeholder={t('kolekcja.doradcaPlaceholder')}
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <button className="btn">{t('kolekcja.doradcaSprawdz')}</button>
      </form>
      {err && (
        <p className="banner error">
          <Sprite name="bomb" size={18} /> {err}
        </p>
      )}
      {wynik && (
        <div className={'card rek ' + wynik.rekomendacja}>
          <b>{wynik.item}</b> (Q{wynik.jakosc}) →{' '}
          <b>
            {REKOMENDACJE[wynik.rekomendacja]
              ? t(REKOMENDACJE[wynik.rekomendacja])
              : wynik.rekomendacja.replace(/_/g, ' ')}
          </b>
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
