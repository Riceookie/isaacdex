'use client'

import { useState } from 'react'
import Sprite from '@/components/Sprite'

/**
 * Pole hasła z okiem-przełącznikiem: Mom's Eye = pokaż, Mom's Contact = ukryj (klimat gry).
 * Jedno miejsce, żeby logowanie i „nowe hasło" wyglądały tak samo.
 */
export default function PoleHasla({
  etykieta = 'Hasło',
  name = 'haslo',
  autoComplete = 'current-password',
  placeholder = 'Co najmniej 8 znaków',
}: {
  etykieta?: string
  name?: string
  autoComplete?: string
  placeholder?: string
}) {
  const [widoczne, setWidoczne] = useState(false)
  return (
    <label className="log-pole">
      <span>{etykieta}</span>
      <span className="haslo-pole">
        <input
          className="input"
          name={name}
          type={widoczne ? 'text' : 'password'}
          required
          minLength={8}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="haslo-oko"
          onClick={() => setWidoczne((v) => !v)}
          aria-pressed={widoczne}
          aria-label={widoczne ? 'Ukryj hasło' : 'Pokaż hasło'}
          title={widoczne ? 'Ukryj hasło' : 'Pokaż hasło'}
        >
          <Sprite name={widoczne ? 'momsContact' : 'momsEye'} size={32} />
        </button>
      </span>
    </label>
  )
}
