'use client'

import { useState } from 'react'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'

/**
 * Pole hasła z okiem-przełącznikiem: Mom's Eye = pokaż, Mom's Contact = ukryj (klimat gry).
 * Jedno miejsce, żeby logowanie i „nowe hasło" wyglądały tak samo.
 *
 * Etykieta i placeholder nie mają domyślnych wartości w sygnaturze, tylko niżej w ciele —
 * domyślny parametr policzyłby się przed `useT()`, a tekst musi znać język.
 */
export default function PoleHasla({
  etykieta,
  name = 'haslo',
  autoComplete = 'current-password',
  placeholder,
}: {
  etykieta?: string
  name?: string
  autoComplete?: string
  placeholder?: string
}) {
  const [widoczne, setWidoczne] = useState(false)
  const t = useT()
  const opisOka = t(widoczne ? 'konto.ukryjHaslo' : 'konto.pokazHaslo')
  return (
    <label className="log-pole">
      <span>{etykieta ?? t('konto.poleHaslo')}</span>
      <span className="haslo-pole">
        <input
          className="input"
          name={name}
          type={widoczne ? 'text' : 'password'}
          required
          minLength={8}
          placeholder={placeholder ?? t('konto.hasloPlaceholder')}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="haslo-oko"
          onClick={() => setWidoczne((v) => !v)}
          aria-pressed={widoczne}
          aria-label={opisOka}
          title={opisOka}
        >
          <Sprite name={widoczne ? 'momsContact' : 'momsEye'} size={32} />
        </button>
      </span>
    </label>
  )
}
