'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
import { sprawdzKrok } from '@/app/actions/sekret'

/**
 * Wyzwanie Sekretnego Pokoju: TRZY PIECZĘCIE. Każda to zagadka; poprawna odpowiedź rozbija
 * pieczęć (rozbłysk + zapłon runy na pasku postępu) i odsłania następną. Trzecia domyka rytuał
 * — leci finałowy rozbłysk, a potem przechodzimy na ekran nagrody (`/sekret?ok=1`), gdzie
 * Shopkeeper „podnosi wzrok", gra dżingiel i wpada tytuł „Keeper".
 *
 * Odpowiedzi sprawdza WYŁĄCZNIE server action `sprawdzKrok` — w kliencie ich nie ma, więc
 * sekret zostaje sekretem. Klient trzyma tylko numer kroku i fazę animacji. Wymaga JS (to
 * ukryte easter-egg za zbombardowaną ścianą, nie ścieżka krytyczna) — bez JS pole nic nie robi.
 */
type Faza = 'pyt' | 'sprawdzanie' | 'zle' | 'otwarta' | 'final'

const ILE_PIECZECI = 3

export default function SekretnyPokoj() {
  const t = useT()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [krok, setKrok] = useState(0) // 0..2 — która pieczęć jest teraz
  const [rozbite, setRozbite] = useState(0) // ile już pękło (do paska run)
  const [faza, setFaza] = useState<Faza>('pyt')

  const zajete = faza === 'sprawdzanie' || faza === 'otwarta' || faza === 'final'

  async function nasluchaj(e: React.FormEvent) {
    e.preventDefault()
    if (zajete) return
    const val = inputRef.current?.value.trim() ?? ''
    if (!val) return

    setFaza('sprawdzanie')
    let res: { ok: boolean; koniec?: boolean }
    try {
      res = await sprawdzKrok(krok, val)
    } catch {
      res = { ok: false }
    }

    if (!res.ok) {
      // Zła odpowiedź → panel drży, wraca podpowiedź; pole zostaje, żeby dało się poprawić.
      setFaza('zle')
      inputRef.current?.focus()
      inputRef.current?.select()
      return
    }

    if (res.koniec) {
      // Ostatnia pieczęć: zapal ostatnią runę, odpal finałowy rozbłysk, potem ekran nagrody.
      setRozbite(ILE_PIECZECI)
      setFaza('final')
      window.setTimeout(() => router.push('/sekret?ok=1'), 2600)
      return
    }

    // Pieczęć pękła: zapal runę, pokaż rozbłysk, po chwili odsłoń następną zagadkę.
    setRozbite(krok + 1)
    setFaza('otwarta')
    window.setTimeout(() => {
      setKrok((k) => k + 1)
      if (inputRef.current) inputRef.current.value = ''
      setFaza('pyt')
      inputRef.current?.focus()
    }, 1150)
  }

  // Finał: krótki rytuał zamiast formularza (przejdziemy na ekran nagrody).
  if (faza === 'final') {
    return (
      <div className="sekret-panel sekret-final" role="status">
        <span className="sekret-final-blysk" aria-hidden />
        <div className="sekret-pieczecie sekret-pieczecie-final" aria-hidden>
          {Array.from({ length: ILE_PIECZECI }).map((_, i) => (
            <span key={i} className="sekret-pieczec zapalona" />
          ))}
        </div>
        <h2 className="sekret-final-naglowek">{t('sekret.finalNaglowek')}</h2>
        <p className="sekret-lore">{t('sekret.finalOpis')}</p>
      </div>
    )
  }

  const etapy = ['sekret.pieczec1', 'sekret.pieczec2', 'sekret.pieczec3'] as const
  const zagadki = ['sekret.zagadka1', 'sekret.zagadka2', 'sekret.zagadka3'] as const
  const bledy = ['sekret.blad1', 'sekret.blad2', 'sekret.blad3'] as const

  return (
    <div className={'sekret-panel sekret-zagadka' + (faza === 'zle' ? ' zle' : '')}>
      <p className="sekret-lore">{t('sekret.lore')}</p>

      <p className="sekret-mowi small muted">{t('sekret.wyzwanieNaglowek')}</p>

      {/* Pasek pieczęci: trzy runy, zapalają się w miarę rozbijania. */}
      <div
        className="sekret-pieczecie"
        role="img"
        aria-label={`${t('sekret.postepAria')}: ${rozbite} / ${ILE_PIECZECI}`}
      >
        {Array.from({ length: ILE_PIECZECI }).map((_, i) => (
          <span
            key={i}
            className={
              'sekret-pieczec' +
              (i < rozbite ? ' zapalona' : '') +
              (i === krok && faza !== 'otwarta' ? ' aktywna' : '') +
              (i === krok && faza === 'otwarta' ? ' zapala-sie' : '')
            }
          />
        ))}
      </div>

      {/* Zagadka bieżącej pieczęci — crossfade przy zmianie kroku (key wymusza remount). */}
      <p className="sekret-etap small muted">{t(etapy[krok])}</p>
      <blockquote key={krok} className="sekret-riddle sekret-riddle-in">
        „{t(zagadki[krok])}"
      </blockquote>

      <form onSubmit={nasluchaj} className="sekret-form">
        <span className="sekret-form-podpis small muted">{t('sekret.polePodpis')}</span>
        <div className="sekret-form-rzad">
          <input
            ref={inputRef}
            name="odpowiedz"
            className="input sekret-szept-pole"
            placeholder={t('sekret.polePlaceholder')}
            autoFocus
            autoComplete="off"
            maxLength={40}
            required
            disabled={zajete}
          />
          <button className="btn sekret-szept-btn" type="submit" disabled={zajete}>
            <Sprite name="shopkeeper" size={16} /> {t('sekret.przycisk')}
          </button>
        </div>
      </form>

      {faza === 'zle' && (
        <p className="sekret-zle small" role="status">
          {t(bledy[krok])}
        </p>
      )}
      {faza === 'otwarta' && (
        <p className="sekret-otwarta small" role="status">
          {t('sekret.krokOtwarty')}
        </p>
      )}
    </div>
  )
}
