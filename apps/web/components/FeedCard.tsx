'use client'

import { useRouter } from 'next/navigation'
import { useOptimistic, useTransition } from 'react'
import Sprite from '@/components/Sprite'
import { useZalogowany } from '@/components/KontoProvider'
import ItemSprite from '@/components/ItemSprite'
import DecorMark from '@/components/DecorMark'
import LinkGracza from '@/components/LinkGracza'
import { przelaczLajk } from '@/app/actions/social'
import { powiedz } from '@/lib/companionGlos'
import { avatarGracza, ikonaPostaci, wlasnyAvatar } from '@/lib/chars'
import { ETYKIETA, komentarz } from '@/lib/klimat'
import { useJezyk, useT } from '@/components/JezykProvider'
import type { Tlumacz } from '@/lib/i18n/slownik'
import type { Jezyk } from '@/lib/i18n/jezyk'
import type { FeedWpis } from '@/lib/social'

/** Kod locale dla `Intl` — daty starsze niż miesiąc pokazujemy w formacie języka UI. */
const locale = (jezyk: Jezyk) => (jezyk === 'pl' ? 'pl-PL' : 'en-US')

/** „2 godz. temu" — jedna funkcja zamiast biblioteki. */
function kiedy(iso: string, t: Tlumacz, jezyk: Jezyk): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return t('spolecznosc.przedChwila')
  if (min < 60) return t('spolecznosc.minTemu', { liczba: min })
  const godz = Math.round(min / 60)
  if (godz < 24) return t('spolecznosc.godzTemu', { liczba: godz })
  const dni = Math.round(godz / 24)
  if (dni === 1) return t('spolecznosc.wczoraj')
  if (dni < 31) return t('spolecznosc.dniTemu', { liczba: dni })
  return new Date(iso).toLocaleDateString(locale(jezyk))
}

const pelnaData = (iso: string, jezyk: Jezyk) =>
  new Date(iso).toLocaleString(locale(jezyk), { dateStyle: 'long', timeStyle: 'short' })

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
  const t = useT()
  const jezyk = useJezyk()
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
    // Maskotka cieszy się z polubienia (tylko przy dodaniu, żeby nie gadała przy cofaniu).
    if (!stan.polubione) powiedz(t('spolecznosc.serduchoPoszlo'), 'happy')
    start(async () => {
      przelacz(undefined)
      await przelaczLajk(w.id)
    })
  }

  const etykieta = ETYKIETA[w.typ]
  const wlasny = wlasnyAvatar(w.autor.avatar)
  const decor = w.autor.dekoracja

  return (
    <article className={'feed-item feed-' + w.typ.toLowerCase()}>
      <header className="feed-head">
        <LinkGracza nick={w.autor.nick} ja={w.autor.ja} className="feed-ava-link">
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
        </LinkGracza>
        <span className="feed-kto">
          <LinkGracza nick={w.autor.nick} ja={w.autor.ja}>
            <span
              className="feed-user"
              style={w.autor.kolor ? { color: w.autor.kolor } : undefined}
            >
              {w.autor.nick}
            </span>
          </LinkGracza>
          {w.autor.ja && <span className="feed-ty">{t('spolecznosc.ty')}</span>}
          <span className="feed-co muted small">{etykieta.czasownik}</span>
        </span>
        <time className="feed-czas muted small" dateTime={w.czas} title={pelnaData(w.czas, jezyk)}>
          {kiedy(w.czas, t, jezyk)}
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
          aria-label={stan.polubione ? t('spolecznosc.cofnijPolubienie') : t('spolecznosc.polub')}
        >
          <Sprite name="heart" size={16} /> {stan.lajki}
        </button>
      </footer>
    </article>
  )
}
