import Sprite from '@/components/Sprite'
import PrzyciskObserwuj from '@/components/PrzyciskObserwuj'
import DecorMark from '@/components/DecorMark'
import LinkGracza from '@/components/LinkGracza'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import type { GraczKarta } from '@/lib/social'

/** Avatar gracza + jego dekoracja pfp. Własne zdjęcia kadrujemy (object-fit), sprite'y zostają ostre. */
function Awatar({ g, rozmiar, klasa }: { g: GraczKarta; rozmiar: number; klasa: string }) {
  const wlasny = wlasnyAvatar(g.avatar)
  const decor = g.dekoracja
  return (
    <LinkGracza nick={g.nick} ja={g.ja} className="ava-link">
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
    </LinkGracza>
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
        <LinkGracza nick={g.nick} ja={g.ja}>
          <b className="soc-nick" style={g.kolor ? { color: g.kolor } : undefined}>
            {g.nick}
          </b>
        </LinkGracza>
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
  const deadGod = g.procent === 100

  return (
    <article className={'gracz-karta' + (deadGod ? ' deadgod' : '')}>
      <header className="gk-head">
        <Awatar g={g} rozmiar={48} klasa="gk-ava" />
        <div className="gk-id">
          <LinkGracza nick={g.nick} ja={g.ja}>
            <span className="gk-nick" style={g.kolor ? { color: g.kolor } : undefined}>
              {g.nick}
            </span>
          </LinkGracza>
          <Relacja g={g} />
        </div>
        {deadGod && (
          <span className="gk-dg" title="Dead God — 100% osiągnięć">
            <Sprite name="deadgod" size={22} />
          </span>
        )}
      </header>

      <p className="gk-opis muted small">{g.opis ?? 'Bez opisu.'}</p>

      {/* Postęp tylko dla graczy z podpiętym Steamem. „Godziny w grze" i „ulubiony item"
          zniknęły stąd na dobre: Steam Web API ich nie daje, więc jedyne, co dało się
          pokazać, to liczby wymyślone z nicku. */}
      {g.procent !== null ? (
        <div className="gk-postep">
          <div className="bar">
            <div className="bar-fill" style={{ width: `${g.procent}%` }} />
          </div>
          <b className="gk-pct">{g.procent}%</b>
        </div>
      ) : (
        <p className="gk-bez-steama muted small">Bez podpiętego Steama</p>
      )}

      <ul className="gk-staty">
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
