'use client'

import { useRouter } from 'next/navigation'
import { useOptimistic, useTransition } from 'react'
import Sprite from '@/components/Sprite'
import { useZalogowany } from '@/components/KontoProvider'
import ItemSprite from '@/components/ItemSprite'
import DecorMark from '@/components/DecorMark'
import { przelaczLajk } from '@/app/actions/social'
import { avatarGracza, ikonaPostaci, wlasnyAvatar } from '@/lib/chars'
import { dekoracjaGracza, ETYKIETA, komentarz } from '@/lib/klimat'
import type { FeedWpis } from '@/lib/social'

/** „2 godz. temu" — jedna funkcja zamiast biblioteki. */
function kiedy(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'przed chwilą'
  if (min < 60) return `${min} min temu`
  const godz = Math.round(min / 60)
  if (godz < 24) return `${godz} godz. temu`
  const dni = Math.round(godz / 24)
  if (dni === 1) return 'wczoraj'
  if (dni < 31) return `${dni} dni temu`
  return new Date(iso).toLocaleDateString('pl-PL')
}

const pelnaData = (iso: string) =>
  new Date(iso).toLocaleString('pl-PL', { dateStyle: 'long', timeStyle: 'short' })

/**
 * Kartka feedu. Lajk leci server-action → baza, a UI reaguje natychmiast (useOptimistic),
 * więc klik jest płynny mimo round-tripu.
 *
 * Układ: kto + co zrobił + kiedy → ikona i tytuł → itemy z runu → flavor + lajk.
 * Typ wpisu koloruje lewą krawędź i ikonę, żeby feed dało się skanować wzrokiem.
 */
export default function FeedCard({ w }: { w: FeedWpis }) {
  const router = useRouter()
  const zalogowany = useZalogowany()
  const [czekam, start] = useTransition()
  const [stan, przelacz] = useOptimistic(
    { lajki: w.lajki, polubione: w.polubione },
    (s: { lajki: number; polubione: boolean }) => ({
      lajki: s.lajki + (s.polubione ? -1 : 1),
      polubione: !s.polubione,
    }),
  )

  // Gość może lajkować dopiero po założeniu konta — klik prowadzi go tam, zamiast udawać,
  // że policzył głos (serwer i tak by go odrzucił).
  const lajkuj = () => {
    if (!zalogowany) return router.push('/logowanie')
    start(async () => {
      przelacz(undefined)
      await przelaczLajk(w.id)
    })
  }

  const etykieta = ETYKIETA[w.typ]
  const wlasny = wlasnyAvatar(w.autor.avatar)
  const decor = dekoracjaGracza(w.autor.nick, wlasny)

  return (
    <article className={'feed-item feed-' + w.typ.toLowerCase()}>
      <header className="feed-head">
        <span className={'feed-ava-box' + (decor === 'none' ? '' : ' z-decor')}>
          <img
            className={'feed-ava' + (wlasny ? ' foto' : '')}
            src={avatarGracza(w.autor.avatar || w.postac)}
            alt=""
            width={32}
            height={32}
            aria-hidden
          />
          <DecorMark id={decor} />
        </span>
        <span className="feed-kto">
          <span className="feed-user" style={w.autor.kolor ? { color: w.autor.kolor } : undefined}>
            {w.autor.nick}
          </span>
          {w.autor.ja && <span className="feed-ty">Ty</span>}
          <span className="feed-co muted small">{etykieta.czasownik}</span>
        </span>
        <time className="feed-czas muted small" dateTime={w.czas} title={pelnaData(w.czas)}>
          {kiedy(w.czas)}
        </time>
      </header>

      <div className="feed-tresc">
        <span className="feed-ikona">
          {w.typ === 'UNLOCK' && w.ikonaUrl ? (
            <img src={w.ikonaUrl} alt="" width={44} height={44} loading="lazy" aria-hidden />
          ) : (
            <Sprite name={etykieta.ikona} size={34} />
          )}
        </span>
        <div className="feed-line">
          <strong>{w.tresc}</strong>
          {w.postac && w.typ !== 'TEKST' && (
            <span className="feed-postac muted small">
              <img src={ikonaPostaci(w.postac)} alt="" width={16} height={16} aria-hidden />
              {w.postac}
            </span>
          )}
        </div>
      </div>

      {w.itemy.length > 0 && (
        <div className="feed-run-items">
          {w.itemy.map((i) => (
            <span key={i} className="feed-run-tile" title={i}>
              <ItemSprite nazwa={i} size={28} />
            </span>
          ))}
        </div>
      )}

      <footer className="feed-akcje">
        <span className="feed-flavor muted small">{komentarz(w)}</span>
        <button
          className={'feed-like' + (stan.polubione ? ' on' : '')}
          onClick={lajkuj}
          disabled={czekam}
          aria-pressed={stan.polubione}
          aria-label={stan.polubione ? 'Cofnij polubienie' : 'Polub'}
        >
          <Sprite name="heart" size={16} /> {stan.lajki}
        </button>
      </footer>
    </article>
  )
}
