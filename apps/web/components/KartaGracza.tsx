import Sprite from '@/components/Sprite'
import ItemSprite from '@/components/ItemSprite'
import PrzyciskObserwuj from '@/components/PrzyciskObserwuj'
import DecorMark from '@/components/DecorMark'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import { dekoracjaGracza, statyGracza } from '@/lib/klimat'
import type { GraczKarta } from '@/lib/social'

/** Avatar gracza + jego dekoracja pfp. Własne zdjęcia kadrujemy (object-fit), sprite'y zostają ostre. */
function Awatar({ g, rozmiar, klasa }: { g: GraczKarta; rozmiar: number; klasa: string }) {
  const wlasny = wlasnyAvatar(g.avatar)
  const decor = dekoracjaGracza(g.nick, wlasny)
  return (
    <span className={klasa + '-box' + (decor === 'none' ? '' : ' z-decor')}>
      <img
        className={klasa + (wlasny ? ' foto' : '')}
        src={avatarGracza(g.avatar)}
        alt=""
        width={rozmiar}
        height={rozmiar}
        aria-hidden
      />
      <DecorMark id={decor} />
    </span>
  )
}

/**
 * Gracz w dwóch odsłonach:
 *  - `WierszGracza` — wąski wiersz do list w panelu bocznym,
 *  - `KartaGracza`  — podgląd profilu (avatar, pasek postępu, statystyki) do „Odkryj graczy"
 *    i wyników szukania.
 *
 * Statystyki (%, godziny, ulubiony item) są PLACEHOLDEREM z lib/klimat — w bazie trzymamy
 * na razie tylko nick/opis/avatar. Docelowo przyjdą ze Steama, tak jak Twoje.
 */

/** Znaczek relacji: znajomy / obserwuje Cię — czytelny na pierwszy rzut oka. */
function Relacja({ g }: { g: GraczKarta }) {
  if (g.ja) return <span className="rel-badge ja">To Ty</span>
  if (g.znajomy)
    return (
      <span className="rel-badge friend">
        <Sprite name="friends" size={13} /> Znajomy
      </span>
    )
  if (g.obserwujeMnie) return <span className="rel-badge back">Obserwuje Cię</span>
  return null
}

export function WierszGracza({ g }: { g: GraczKarta }) {
  return (
    <li className="soc-wiersz">
      <Awatar g={g} rozmiar={34} klasa="soc-ava" />
      {/* Bez znaczka relacji: wiersze siedzą już w sekcjach „Znajomi"/„Obserwowani",
          a przycisk obok mówi to samo. Znaczek zostaje na kartach w „Odkryj graczy". */}
      <span className="soc-kto">
        <b className="soc-nick" style={g.kolor ? { color: g.kolor } : undefined}>
          {g.nick}
        </b>
        <span className="muted small">{g.opis ?? 'Bez opisu.'}</span>
      </span>
      {!g.ja && (
        <PrzyciskObserwuj
          graczId={g.id}
          obserwowany={g.obserwowany}
          obserwujeMnie={g.obserwujeMnie}
        />
      )}
    </li>
  )
}

export function KartaGracza({ g }: { g: GraczKarta }) {
  const s = statyGracza(g.nick)

  return (
    <article className={'gracz-karta' + (s.deadGod ? ' deadgod' : '')}>
      <header className="gk-head">
        <Awatar g={g} rozmiar={48} klasa="gk-ava" />
        <div className="gk-id">
          <span className="gk-nick" style={g.kolor ? { color: g.kolor } : undefined}>
            {g.nick}
          </span>
          <Relacja g={g} />
        </div>
        {s.deadGod && (
          <span className="gk-dg" title="Dead God — 100% osiągnięć">
            <Sprite name="deadgod" size={22} />
          </span>
        )}
      </header>

      <p className="gk-opis muted small">{g.opis ?? 'Bez opisu.'}</p>

      <div className="gk-postep">
        <div className="bar">
          <div className="bar-fill" style={{ width: `${s.procent}%` }} />
        </div>
        <b className="gk-pct">{s.procent}%</b>
      </div>

      <ul className="gk-staty">
        <li title="Ulubiony item">
          <ItemSprite nazwa={s.ulubiony} size={18} /> {s.ulubiony}
        </li>
        <li title="Godziny w grze">
          <Sprite name="clock" size={15} /> {s.godziny} h
        </li>
        <li title="Obserwujący">
          <Sprite name="friendfinder" size={15} /> {g.obserwujacych}
        </li>
        <li title="Wpisy w feedzie">
          <Sprite name="book" size={15} /> {g.wpisy}
        </li>
      </ul>

      {!g.ja && (
        <PrzyciskObserwuj
          graczId={g.id}
          obserwowany={g.obserwowany}
          obserwujeMnie={g.obserwujeMnie}
          pelna
        />
      )}
    </article>
  )
}
