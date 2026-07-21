'use client'

import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
import { sprawdzSekret } from '@/app/actions/sekret'

/**
 * Zagadka w Sekretnym Pokoju. Sprawdzanie robi server action `sprawdzSekret` (odpowiedzi NIE ma
 * w kliencie), a tu jest tylko oprawa: lore, pole na szept i reakcja na pudło (`blad` → klasa
 * `.zle`, która potrząsa panelem). Klient, żeby dało się od razu wpisywać (autofocus).
 */
export default function SekretnyPokoj({ blad }: { blad: boolean }) {
  const t = useT()
  return (
    <div className={'sekret-panel sekret-zagadka' + (blad ? ' zle' : '')}>
      <p className="sekret-lore">{t('sekret.lore')}</p>
      <p className="sekret-mowi small muted">{t('sekret.zagadkaNaglowek')}</p>
      <blockquote className="sekret-riddle">„{t('sekret.zagadka')}"</blockquote>

      <form action={sprawdzSekret} className="sekret-form">
        <input
          name="odpowiedz"
          className="input"
          placeholder={t('sekret.polePlaceholder')}
          autoFocus
          autoComplete="off"
          maxLength={40}
          required
        />
        <button className="btn" type="submit">
          <Sprite name="keeper" size={16} /> {t('sekret.przycisk')}
        </button>
      </form>

      {blad && (
        <p className="sekret-zle small" role="status">
          {t('sekret.zlaOdpowiedz')}
        </p>
      )}
    </div>
  )
}
