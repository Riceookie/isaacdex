'use client'

import { useState } from 'react'
import Sprite from '@/components/Sprite'
import ItemSprite from '@/components/ItemSprite'
import { ikonaPostaci } from '@/lib/chars'
import { KOLOR_AUTORA, type FeedWpis } from '@/lib/feed'

/** Ikona odblokowanego achievementu (ze Steama) dla wpisów typu „unlock". */
type Ach = { nazwa: string; ikonaUrl: string }

/** Jedna kartka feedu: unlock / boss-kill / run-post. Lajk klikalny (lokalny, demo). */
export default function FeedCard({ w, ach }: { w: FeedWpis; ach?: Ach }) {
  const [liked, setLiked] = useState(false)
  const kolor = KOLOR_AUTORA[w.user]
  const lajki = w.lajki + (liked ? 1 : 0)

  return (
    <article className={`feed-item feed-${w.typ}`}>
      <div className="feed-avatar">
        <img className="avatar-img" src={ikonaPostaci(w.postac)} alt="" />
      </div>

      <div className="feed-body">
        <p className="feed-line">
          <span className="feed-user" style={{ color: kolor }}>
            {w.user}
          </span>{' '}
          {w.typ === 'unlock' && (
            <>
              — odblokowano{' '}
              <span className="feed-cel">
                {ach && <img className="feed-ach" src={ach.ikonaUrl} alt="" />}
                {ach ? ach.nazwa : 'achievement'}
              </span>
            </>
          )}
          {w.typ === 'boss' && (
            <>
              — pokonano <span className="feed-cel">{w.boss}</span> jako {w.jako}
            </>
          )}
          {w.typ === 'run' && <>— {w.opis}</>}
        </p>

        {w.typ === 'run' && (
          <div className="feed-run-items">
            {w.itemy.map((it) => (
              <span className="feed-run-tile" key={it} title={it}>
                <ItemSprite nazwa={it} size={34} />
                <span className="small muted">{it}</span>
              </span>
            ))}
          </div>
        )}

        <span className="muted small feed-meta">
          gra jako {w.postac} · {w.czas}
        </span>
      </div>

      <div className="feed-actions">
        <button
          className={'feed-like' + (liked ? ' on' : '')}
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label="Polub"
        >
          <Sprite name="heart" size={18} /> {lajki}
        </button>
        <span className="feed-comments" aria-label="Komentarze">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          >
            <path d="M4 5h16v11H9l-4 3v-3H4z" strokeLinecap="round" />
          </svg>
          {w.komentarze}
        </span>
      </div>
    </article>
  )
}
