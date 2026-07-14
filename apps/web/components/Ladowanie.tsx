'use client'

import { useEffect, useState } from 'react'

/**
 * Wspólny loader: płacząca buźka Isaaca miga między dwiema klatkami i podpis „Loading…".
 * Używany wszędzie, gdzie coś się wczytuje.
 */
const TEMPO_MS = 400

export default function Ladowanie({ tekst = 'Loading…' }: { tekst?: string }) {
  const [klatka, setKlatka] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setKlatka((k) => (k === 0 ? 1 : 0)), TEMPO_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="ladowanie" role="status" aria-live="polite">
      <img
        src={`/tboi/ui/loading${klatka + 1}.png`}
        alt=""
        width={96}
        height={100}
        aria-hidden
        draggable={false}
      />
      <p>{tekst}</p>
    </div>
  )
}
