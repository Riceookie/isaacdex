import Link from 'next/link'
import type { ReactNode } from 'react'
import Sprite from '@/components/Sprite'
import ItemSprite from '@/components/ItemSprite'
import FeedCard from '@/components/FeedCard'
import ProfileAvatar from '@/components/ProfileAvatar'
import DecorMark from '@/components/DecorMark'
import LinkGracza from '@/components/LinkGracza'
import PustyStan from '@/components/PustyStan'
import Gablota, { type ItemDoWyboru } from '@/components/Gablota'
import LicznikiObserwacji from '@/components/LicznikiObserwacji'
import { avatarGracza, ikonaPostaci, pelnaPostaci } from '@/lib/chars'
import { PUSTKA, statyGracza } from '@/lib/klimat'
import type { DecorId } from '@/lib/pfpDecor'
import type { DemoAch, DemoRun } from '@/lib/demoProfil'
import type { FeedWpis, GraczKarta } from '@/lib/social'

/**
 * Znormalizowany profil — jeden kształt danych dla MOJEGO profilu (dane ze Steama)
 * i profilu CUDZEGO (dane z bazy + dorobione demo). Dzięki temu layout niżej jest
 * jeden, a nie dwa rozjeżdżające się z czasem.
 */
export type DaneProfilu = {
  nick: string
  kolor?: string | null
  opis: string
  ulubionaPostac: string
  achProcent: number
  achUnlocked: number
  achTotal: number
  recent: DemoAch[]
  postacie: { nazwa: string; procent: number }[]
  runy: DemoRun[]
  obserwujacych: number
  obserwuje: number
  /** Listy pod klikalne liczniki — PRAWDZIWE (tabela Obserwacja). */
  listaObserwujacych?: GraczKarta[]
  listaObserwowanych?: GraczKarta[]
  wpisy: FeedWpis[]
  znajomi: GraczKarta[]
  /** Meta w nagłówku: 3 pary etykieta/wartość (u mnie Steam, u obcych godziny itd.). */
  meta: { etykieta: string; wartosc: string }[]
  /** Avatar cudzego gracza (mój leci przez ProfileAvatar → localStorage). */
  avatar?: string | null
  decor?: DecorId
  /** Czy sekcje Steamowe są dorobione — wtedy dostają znaczek DEMO. */
  steamDemo: boolean
  /**
   * Czy Steam jest podpięty. Gdy nie, profil dalej pokazuje TOŻSAMOŚĆ (avatar, nick, bio,
   * ulubioną postać, znajomych) — bo to dane, które użytkownik już podał — a chowa tylko
   * sekcje, które bez Steama nie mają z czego powstać (postęp, achievementy, runy).
   */
  steamPodlaczony: boolean
  /** Gablota cudzego gracza (moja siedzi w localStorage, więc czyta ją sam komponent). */
  gablota?: (string | null)[]
  /** Katalog itemów do wybieraczki — tylko na własnym profilu. */
  itemyDoWyboru?: ItemDoWyboru[]
}

/** Nagłówek sekcji: tytuł + (opcjonalnie) link „więcej" albo znaczek DEMO. */
function GlowaSekcji({
  children,
  wiecej,
  demo,
}: {
  children: ReactNode
  wiecej?: { href: string; tekst: string } | null
  demo?: boolean
}) {
  return (
    <div className="paper-head">
      {children}
      {demo && <span className="muted small">DEMO</span>}
      {wiecej && (
        <Link className="paper-more" href={wiecej.href}>
          {wiecej.tekst}
        </Link>
      )}
    </div>
  )
}

/**
 * Bogaty widok profilu — ten sam układ dla mnie i dla innych.
 *
 * `wlasny` decyduje TYLKO o rzeczach, których nie da się zrobić cudzemu profilowi:
 * edycja (ołówek, „Zmień →"), podmiana avatara i linki do MOICH podstron (Kolekcja,
 * Statystyki — cudzych nie mamy gdzie pokazać). Cała reszta jest wspólna.
 */
export default function ProfilWidok({
  d,
  wlasny,
  akcje,
}: {
  d: DaneProfilu
  wlasny: boolean
  /** Prawy górny róg karty: ołówek (ja) albo „Obserwuj" (obcy). */
  akcje?: ReactNode
}) {
  return (
    <section className="pf-page">
      <div className="pf-grid">
        {/* ── LEWA KOLUMNA ── */}
        <div className="pf-main">
          {/* Karta profilu (polaroid + tożsamość + meta) */}
          {/* Bez pająka z FrameDecor: wisiał w prawym górnym rogu, czyli dokładnie na
              pierwszej etykiecie mety („CZŁONEK OD" / „GODZINY"), i przy węższych ekranach
              ją zasłaniał. W karcie i tak siedzi już stwór wystający z polaroidu — dwa
              potwory na jednym nagłówku to nie klimat, tylko bałagan. */}
          <div className="profil-hero pf-hero pin-synced">
            <div className="pf-photo">
              {wlasny ? (
                <ProfileAvatar fallbackSrc={ikonaPostaci(d.ulubionaPostac)} />
              ) : (
                <>
                  {/* ProfileAvatar czyta localStorage, więc pokazałby MOJE zdjęcie na
                      cudzym profilu — obcy avatar leci wprost z bazy. */}
                  <img src={avatarGracza(d.avatar, d.ulubionaPostac)} alt="" draggable={false} />
                  <DecorMark id={d.decor ?? 'none'} />
                </>
              )}
            </div>
            <div className="pf-id">
              <h1 style={d.kolor ? { color: d.kolor } : undefined}>
                {d.nick}{' '}
                {wlasny && (
                  <Link className="pf-edit" href="/kim-jestem" aria-label="Edytuj profil">
                    {/* Lead Pencil z gry zamiast znaku „✎" — ikona, nie glif z fontu. */}
                    <Sprite name="pencil" size={26} />
                  </Link>
                )}
              </h1>
              {/* Bez odznak „Dead God %" i „X main" — pierwsze mówi to samo co wielki pasek
                  postępu, drugie to samo co pełna sylwetka w „Ulubionej postaci". Zostają
                  liczniki, bo są jedyną rzeczą, której nie widać nigdzie indziej.
                  Siedzą tuż pod nickiem (jak podpis), a cytat zamyka blok tożsamości. */}
              <LicznikiObserwacji
                nick={d.nick}
                obserwujacych={d.obserwujacych}
                obserwuje={d.obserwuje}
                listaObserwujacych={d.listaObserwujacych ?? []}
                listaObserwowanych={d.listaObserwowanych ?? []}
              />
              <p className="pf-bio">„{d.opis || 'Za dużo gram w Isaaca. Ratunku.'}"</p>
            </div>
            <div className="pf-meta">
              {d.meta.map((m) => (
                <div key={m.etykieta}>
                  <span className="muted small">{m.etykieta}</span>
                  <b>{m.wartosc}</b>
                </div>
              ))}
            </div>
            {akcje && <div className="pf-akcje">{akcje}</div>}
          </div>

          {/* Ulubiona postać + Dead God progress obok siebie */}
          <div className="pf-favprog">
            <div className="note fav-char-card">
              <h3>Ulubiona postać</h3>
              {/* Brak ulubionej to prawidłowy wybór („Brak" w edytorze) — pokazujemy pusty
                  cokół, a nie podstawiamy Isaaca i nie udajemy, że ktoś go wybrał. */}
              {d.ulubionaPostac ? (
                <div className="fav-char">
                  <div className="fav-char-portrait">
                    {/* Pełna sylwetka (chars-full), nie głowa — to gablota, ma robić wrażenie. */}
                    <img
                      className="fav-char-body"
                      src={pelnaPostaci(d.ulubionaPostac)}
                      alt={d.ulubionaPostac}
                    />
                    <span className="fav-char-cien" aria-hidden />
                  </div>
                  <div className="fav-char-name">{d.ulubionaPostac}</div>
                </div>
              ) : (
                <div className="fav-char">
                  <div className="fav-char-portrait fav-char-brak">
                    <span className="fav-char-znak" aria-hidden>
                      ?
                    </span>
                    <span className="fav-char-cien" aria-hidden />
                  </div>
                  <div className="fav-char-name muted">
                    {wlasny ? 'Nie wybrano' : 'Brak ulubionej'}
                  </div>
                </div>
              )}
            </div>

            {/* Top 3: 3 pedestały z itemami. Na własnym profilu klikalne („+"). */}
            <Gablota
              itemy={wlasny ? undefined : (d.gablota ?? [])}
              edycja={wlasny}
              doWyboru={d.itemyDoWyboru ?? []}
            />
          </div>

          {/* Aktywność — wpisy są PRAWDZIWE (baza), u mnie i u innych. */}
          <div className="note">
            <GlowaSekcji wiecej={wlasny ? { href: '/', tekst: 'Feed →' } : null}>
              <h2>
                <Sprite name="stats" size={24} /> Ostatnia aktywność
              </h2>
            </GlowaSekcji>
            <p className="sekcja-opis muted small">
              {wlasny
                ? 'Twoje wpisy w feedzie — odblokowane achievementy i ubici bossowie, prosto ze Steama. To samo widzą znajomi.'
                : `Co ${d.nick} wrzucił do feedu — odblokowania i ubici bossowie.`}
            </p>
            {d.wpisy.length === 0 ? (
              wlasny ? (
                <PustyStan
                  tekst={
                    <>
                      <b>Jeszcze nic tu nie zrobiłeś.</b> Zsynchronizuj Steam, a Twoje odblokowania
                      same trafią do feedu.
                    </>
                  }
                  akcja={
                    <Link className="btn" href="/kolekcja">
                      Przejdź do Osiągnięć
                    </Link>
                  }
                />
              ) : (
                <PustyStan maly tekst={<>Cisza. {d.nick} jeszcze nic tu nie wrzucił.</>} />
              )
            ) : (
              <div className="feed">
                {d.wpisy.slice(0, 4).map((w) => (
                  <FeedCard key={w.id} w={w} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Runs — zmyślone na podstawie nicku, więc bez Steama nie ma dla nich
              żadnej podstawy; pokazujemy je dopiero, gdy profil w ogóle ma dane z gry. */}
          {d.steamPodlaczony && (
            <div className="note recent-runs">
              <GlowaSekcji demo>
                <h2>
                  <Sprite name="stopwatch" size={24} /> Ostatnie runy
                </h2>
              </GlowaSekcji>
              <p className="sekcja-opis muted small">
                Ostatnie podejścia: wynik, czas, piętro i seed. Steam nie udostępnia historii runów
                przez API — te są zmyślone, dopóki nie zbierzemy ich z zapisu gry.
              </p>
              <div className="runs-list">
                {d.runy.map((r, i) => (
                  <div key={i} className="run-row">
                    <span className={'run-result ' + (r.wynik === 'WYGRANA' ? 'win' : 'loss')}>
                      {r.wynik}
                      <span className="muted small">
                        {r.wynik === 'WYGRANA' ? 'vs' : 'do'} {r.boss}
                      </span>
                    </span>
                    <span className="run-time">{r.czas}</span>
                    <span className="run-seed">
                      <span className="muted small">{r.piętro}</span>
                      <code>{r.seed}</code>
                    </span>
                    <span className="run-items">
                      {r.itemy.map((it) => (
                        <ItemSprite key={it} nazwa={it} size={26} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── PRAWA KOLUMNA ── */}
        <div className="pf-side">
          {/* Bez Steama nie ma czego liczyć — zamiast paska „0%", który wygląda jak porażka,
              stoi tu zaproszenie. Reszta profilu (tożsamość, znajomi) działa i tak. */}
          {d.steamPodlaczony ? (
            <div
              className={
                'note dead-god-card pin-featured' + (d.achProcent >= 100 ? ' komplet' : '')
              }
            >
              <h3>
                <Sprite name="deadgod" size={20} /> Dead God — postęp
              </h3>
              <div className="hero-progress">
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${d.achProcent}%` }} />
                </div>
                <span className="hero-pct">{d.achProcent}%</span>
              </div>
              <p className="small muted">
                {d.achUnlocked}/{d.achTotal} achievementów
              </p>
            </div>
          ) : (
            wlasny && (
              <div className="note dead-god-card">
                <h3>
                  <Sprite name="deadgod" size={20} /> Dead God — postęp
                </h3>
                <PustyStan
                  maly
                  tekst={
                    <>
                      <b>641 achievementów czeka.</b> Podłącz Steam, a postęp, marki i najrzadsze
                      zdobycze pojawią się tutaj same.
                    </>
                  }
                  akcja={
                    <Link className="btn" href="/kolekcja">
                      Podłącz Steam
                    </Link>
                  }
                />
              </div>
            )
          )}

          {/* Recent Achievements */}
          {d.recent.length > 0 && (
            <div className="note">
              <GlowaSekcji
                demo={d.steamDemo}
                wiecej={wlasny ? { href: '/kolekcja', tekst: 'Wszystkie →' } : null}
              >
                <h3>
                  <Sprite name="trophy" size={22} /> Ostatnie achievementy
                </h3>
              </GlowaSekcji>
              <ul className="ra-list">
                {d.recent.slice(0, 4).map((a) => (
                  <li key={a.nazwa}>
                    {a.ikonaUrl && <img src={a.ikonaUrl} alt="" />}
                    <span className="grow">{a.nazwa}</span>
                    <span className="muted small">
                      {new Date(a.data).toLocaleDateString('pl-PL')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Character Completion — u obcych linki do postaci prowadziłyby na MOJE marki,
              więc tam zostają zwykłe kafle bez linku.
              Bez Steama cała siatka to same zera — nie pokazujemy jej wcale. */}
          {d.steamPodlaczony && (
            <div className="note">
              <GlowaSekcji
                demo={d.steamDemo}
                wiecej={wlasny ? { href: '/statystyki', tekst: 'Statystyki →' } : null}
              >
                <h3>
                  <Sprite name="chad" size={22} /> Postępy postaci
                </h3>
              </GlowaSekcji>
              <div className="char-grid">
                {d.postacie.slice(0, 12).map((c) =>
                  wlasny ? (
                    <Link
                      key={c.nazwa}
                      href={`/profil/${encodeURIComponent(c.nazwa)}`}
                      className="char-cell"
                    >
                      <img src={ikonaPostaci(c.nazwa)} alt="" />
                      <span className="nm">{c.nazwa}</span>
                      <span className="pct">{c.procent}%</span>
                    </Link>
                  ) : (
                    <span key={c.nazwa} className="char-cell">
                      <img src={ikonaPostaci(c.nazwa)} alt="" />
                      <span className="nm">{c.nazwa}</span>
                      <span className="pct">{c.procent}%</span>
                    </span>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Znajomi — PRAWDZIWI (obserwacja w obie strony), nie mock jak reszta demo. */}
          <div className="note">
            <GlowaSekcji wiecej={wlasny ? { href: '/znajomi', tekst: 'Wszyscy →' } : null}>
              <h3>
                <Sprite name="friendfinder" size={22} /> Znajomi ({d.znajomi.length})
              </h3>
            </GlowaSekcji>
            {d.znajomi.length === 0 ? (
              wlasny ? (
                <PustyStan
                  maly
                  tekst={PUSTKA.brakZnajomychLista}
                  akcja={
                    <Link className="btn" href="/znajomi">
                      Znajdź graczy
                    </Link>
                  }
                />
              ) : (
                <PustyStan maly tekst={<>{d.nick} nie ma jeszcze znajomych.</>} />
              )
            ) : (
              <ul className="fr-list">
                {d.znajomi.slice(0, 6).map((g) => (
                  <li key={g.id}>
                    <LinkGracza nick={g.nick} ja={g.ja} className="fr-link">
                      <img src={avatarGracza(g.avatar)} alt="" />
                      <span className="grow" style={g.kolor ? { color: g.kolor } : undefined}>
                        {g.nick}
                      </span>
                    </LinkGracza>
                    <span className="muted small">{statyGracza(g.nick).procent}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
