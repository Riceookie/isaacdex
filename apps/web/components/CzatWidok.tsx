'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Sprite, { NAZWY_SPRITEOW } from '@/components/Sprite'
import DecorMark from '@/components/DecorMark'
import LinkGracza from '@/components/LinkGracza'
import WybieraczkaReakcji from '@/components/WybieraczkaReakcji'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import { dekoracjaGracza } from '@/lib/klimat'
import { powiedz } from '@/lib/companionGlos'
import {
  czyOnline,
  dmSlug,
  DOMYSLNY_KANAL,
  KANALY,
  kwestiaCzatu,
  nickZDm,
  PISZACY_W_KANALE,
  REAKCJE,
  rozmowaZ,
  statusGracza,
  WIADOMOSCI,
  type Wiad,
} from '@/lib/czat'
import type { SpriteName } from '@/components/Sprite'

/**
 * Zamienia tokeny `:nazwa:` na sprite'y z gry, resztę zostawia tekstem.
 * Nieznana nazwa (ktoś wpisał `:cos:` z palca) zostaje zwykłym tekstem — lepiej pokazać
 * to, co napisał, niż zjeść fragment zdania.
 */
function zTokenami(tekst: string): ReactNode[] {
  return tekst.split(/(:[a-zA-Z]+:)/g).map((kawalek, i) => {
    const m = kawalek.match(/^:([a-zA-Z]+):$/)
    const nazwa = m?.[1] as SpriteName | undefined
    if (nazwa && (NAZWY_SPRITEOW as string[]).includes(nazwa)) {
      return <Sprite key={i} name={nazwa} size={22} className="cz-naklejka-inline" />
    }
    return kawalek
  })
}

export type Rozmowca = {
  nick: string
  kolor: string | null
  avatar: string | null
  ja: boolean
  znajomy: boolean
}

/**
 * Czat piwnicy: kanał globalny, kanał znajomych, ogłoszenia od Dogmy i prywatne rozmowy
 * ze znajomymi. Bez backendu — wysłane wiadomości i reakcje żyją w stanie komponentu
 * (znikają po odświeżeniu); nicki, kolory i pfp lecą z bazy.
 *
 * Familiar NIE jest tu renderowany — komentarze idą eventem do maskotki w TopBarze,
 * żeby w apce był jeden zwierzak, a nie dwa.
 */
export default function CzatWidok({
  gracze,
  mojNick,
  gosc = false,
}: {
  gracze: Rozmowca[]
  mojNick: string
  /** Gość: tylko czat globalny + ogłoszenia, oba do CZYTANIA. Reszta zablokowana. */
  gosc?: boolean
}) {
  // Gość widzi tylko kanały publiczne (globalny + ogłoszenia); znajomych i DM chowamy.
  const kanaly = useMemo(
    () => (gosc ? KANALY.filter((k) => k.typ === 'global' || k.typ === 'ogloszenia') : KANALY),
    [gosc],
  )
  const [kanal, setKanal] = useState(DOMYSLNY_KANAL)
  const [wyslane, setWyslane] = useState<Record<string, Wiad[]>>({})
  const [reakcje, setReakcje] = useState<Record<string, Record<string, number>>>({})
  const [tekst, setTekst] = useState('')
  // Usunięte wiadomości: zostaje po nich ślad („Wiadomość usunięta"), jak na Discordzie.
  const [usuniete, setUsuniete] = useState<string[]>([])
  // Załącznik czekający na wysłanie (blob: URL z pliku albo ze schowka).
  const [zalacznik, setZalacznik] = useState<string | null>(null)
  const [picker, setPicker] = useState<string | null>(null)
  const [kotwica, setKotwica] = useState<HTMLElement | null>(null)
  const [naklejki, setNaklejki] = useState(false)
  const naklejkiBtn = useRef<HTMLButtonElement>(null)
  const [piszacy, setPiszacy] = useState<string[]>([])
  const licznik = useRef(0)
  const msgs = useRef<HTMLDivElement>(null)
  const plik = useRef<HTMLInputElement>(null)
  const pole = useRef<HTMLInputElement>(null)

  const znajomi = useMemo(() => gracze.filter((g) => g.znajomy), [gracze])
  const wgNicku = useMemo(() => new Map(gracze.map((g) => [g.nick, g])), [gracze])
  const online = useMemo(() => gracze.filter((g) => g.ja || czyOnline(g.nick)), [gracze])
  const zginelo = gracze.length - online.length

  const rozmowca = nickZDm(kanal)
  const definicja = KANALY.find((k) => k.slug === kanal)
  // Gość nie pisze nigdzie — wszystkie kanały są dla niego tylko do czytania.
  const tylkoOdczyt = gosc || !!definicja?.tylkoOdczyt

  // Wiadomości kanału = startowe (demo albo wygenerowana rozmowa) + to, co dopisałeś.
  const lista = useMemo(() => {
    const bazowe = rozmowca ? rozmowaZ(rozmowca, mojNick) : (WIADOMOSCI[kanal] ?? [])
    return [...bazowe, ...(wyslane[kanal] ?? [])]
  }, [kanal, rozmowca, mojNick, wyslane])

  /**
   * Zjeżdżamy na dół LISTY, ustawiając jej `scrollTop` — a nie `scrollIntoView` na kotwicy.
   * `scrollIntoView` przewija KAŻDEGO scrollowalnego przodka, więc razem z listą ruszał
   * całą stronę (po wysłaniu wiadomości widok skakał na górę).
   */
  useEffect(() => {
    const el = msgs.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lista.length, kanal])

  /**
   * „X pisze…" — DEMO. Bez backendu nikt naprawdę nie pisze, więc co kilka sekund
   * bierzemy kogoś z kanału, pokazujemy go na chwilę i chowamy.
   *
   * Cały ruch siedzi w useEffect (klient), a nie w renderze — inaczej serwer i klient
   * wylosowałyby innych ludzi i React zgłosiłby błąd hydratacji.
   */
  useEffect(() => {
    const kandydaci = rozmowca ? [rozmowca] : (PISZACY_W_KANALE[kanal] ?? [])
    if (kandydaci.length === 0 || tylkoOdczyt) {
      setPiszacy([])
      return
    }
    let ubij: ReturnType<typeof setTimeout>
    const tik = () => {
      const ilu = Math.random() < 0.25 ? 2 : 1
      const kto = [...kandydaci].sort(() => Math.random() - 0.5).slice(0, ilu)
      setPiszacy(Math.random() < 0.55 ? kto : [])
      ubij = setTimeout(tik, 2200 + Math.random() * 2600)
    }
    ubij = setTimeout(tik, 1200)
    return () => clearTimeout(ubij)
  }, [kanal, rozmowca, tylkoOdczyt])

  const wejdz = (slug: string) => {
    setKanal(slug)
    powiedz(kwestiaCzatu('kanal', slug, ++licznik.current))
  }

  /** Wspólny szkielet mojej wiadomości — tekst i obrazek idą tą samą drogą. */
  const mojaWiad = (poza: Partial<Wiad>): Wiad => {
    const teraz = new Date()
    return {
      id: `moja-${teraz.getTime()}-${++licznik.current}`,
      autor: mojNick,
      czas: `${String(teraz.getHours()).padStart(2, '0')}:${String(teraz.getMinutes()).padStart(2, '0')}`,
      tekst: [],
      ...poza,
    }
  }

  const dopisz = (w: Wiad) => setWyslane((s) => ({ ...s, [kanal]: [...(s[kanal] ?? []), w] }))

  const wyslij = () => {
    const t = tekst.trim()
    // Sam obrazek (bez tekstu) też jest wiadomością — stąd warunek na zalacznik.
    if ((!t && !zalacznik) || tylkoOdczyt) return
    dopisz(mojaWiad({ tekst: t ? [t] : [], obraz: zalacznik ?? undefined }))
    setTekst('')
    setZalacznik(null)
    powiedz(kwestiaCzatu('wyslano', t || 'obrazek', licznik.current))
  }

  /**
   * Naklejka wchodzi do POLA jako token `:nazwa:`, a nie leci osobną wiadomością —
   * dzięki temu da się ją dopisać do zdania („gg :trophy:") i poprawić przed wysłaniem.
   * Render zamienia token z powrotem na sprite (patrz `zTokenami`).
   */
  const wstawNaklejke = (ikona: SpriteName) => {
    if (tylkoOdczyt) return
    setTekst((t) => (t ? t.replace(/\s*$/, '') + ' ' : '') + `:${ikona}: `)
    setNaklejki(false)
    pole.current?.focus()
  }

  /** Obrazek z pliku albo ze schowka → blob: URL (bez backendu nie ma gdzie go wysłać). */
  const wczytajObraz = (f: File | null | undefined) => {
    if (!f || !f.type.startsWith('image/')) return
    setZalacznik(URL.createObjectURL(f))
  }

  const wklej = (e: React.ClipboardEvent) => {
    const obraz = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'))
    if (!obraz) return
    e.preventDefault()
    wczytajObraz(obraz.getAsFile())
  }

  const usun = (id: string) => setUsuniete((u) => [...u, id])

  const zareaguj = (idWiad: string, ikona: SpriteName) =>
    setReakcje((r) => {
      const dla = { ...(r[idWiad] ?? {}) }
      dla[ikona] = (dla[ikona] ?? 0) === 0 ? 1 : 0 // toggle mojego głosu
      return { ...r, [idWiad]: dla }
    })

  const naglowek = rozmowca
    ? { nazwa: rozmowca, ikona: null, opis: 'Rozmowa prywatna. Nikt inny tego nie widzi.' }
    : {
        nazwa: definicja?.nazwa ?? '',
        ikona: definicja?.ikona ?? null,
        opis: definicja?.opis ?? '',
      }

  return (
    <div className="cz">
      {/* ── KANAŁY + PRYWATNE ── */}
      <aside className="cz-mapa">
        <div className="cz-mapa-head">
          <Sprite name="dadsnote" size={18} /> Piwnica
        </div>

        <div className="cz-kanaly">
          <ul className="cz-lista-kanalow">
            {kanaly.map((k) => (
              <li key={k.slug}>
                <button
                  className={'cz-kanal' + (k.slug === kanal ? ' tu' : '')}
                  onClick={() => wejdz(k.slug)}
                  aria-current={k.slug === kanal}
                  title={k.opis}
                >
                  <span className="cz-kanal-ic">
                    <Sprite name={k.ikona} size={18} />
                  </span>
                  <span className="cz-kanal-nazwa">{k.nazwa}</span>
                  {k.slug === kanal && <span className="cz-tu-kropka" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>

          <div className="cz-grupa">Prywatne</div>
          {gosc ? (
            <p className="cz-brak-dm muted small">
              <a href="/logowanie">Zaloguj się</a>, aby pisać prywatnie ze znajomymi.
            </p>
          ) : znajomi.length === 0 ? (
            <p className="cz-brak-dm muted small">
              Brak znajomych. Prywatnie nie ma z kim pogadać.
            </p>
          ) : (
            <ul className="cz-lista-kanalow">
              {znajomi.map((g) => {
                const slug = dmSlug(g.nick)
                const wlasny = wlasnyAvatar(g.avatar)
                return (
                  <li key={g.nick}>
                    <button
                      className={'cz-kanal cz-dm' + (slug === kanal ? ' tu' : '')}
                      onClick={() => wejdz(slug)}
                      aria-current={slug === kanal}
                    >
                      <span className="cz-ava-box maly">
                        <img
                          className={'cz-ava' + (wlasny ? ' foto' : '')}
                          src={avatarGracza(g.avatar, 'Isaac')}
                          alt=""
                          width={24}
                          height={24}
                          aria-hidden
                        />
                        <DecorMark id={dekoracjaGracza(g.nick, wlasny)} />
                      </span>
                      <span
                        className="cz-kanal-nazwa"
                        style={g.kolor ? { color: g.kolor } : undefined}
                      >
                        {g.nick}
                      </span>
                      {czyOnline(g.nick) && <span className="cz-zyje" aria-label="online" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Offline w klimacie apki: nie „offline", tylko martwi. */}
        <div className="cz-zgineli">
          <span className="cz-trup" aria-hidden />
          <span className="muted small">
            <b>{zginelo}</b> {zginelo === 1 ? 'zginął' : 'zginęło'} — offline
          </span>
        </div>
      </aside>

      {/* ── KANAŁ: nagłówek, wiadomości, pisanie ── */}
      <div className="cz-pokoj-widok">
        <header className="cz-head">
          <div className="cz-head-kartka">
            <h2>
              {naglowek.ikona ? <Sprite name={naglowek.ikona} size={20} /> : <span>@</span>}
              {/* W DM nagłówek to nick rozmówcy — klikalny. Kanały (#piwnica) to nie gracze. */}
              {rozmowca ? (
                <LinkGracza nick={rozmowca} brak={!wgNicku.has(rozmowca)}>
                  {naglowek.nazwa}
                </LinkGracza>
              ) : (
                naglowek.nazwa
              )}
            </h2>
            <p className="muted small">{naglowek.opis}</p>
          </div>
        </header>

        <div className="cz-msgs" ref={msgs}>
          {lista.map((w) => {
            const g = wgNicku.get(w.autor)
            const wlasny = wlasnyAvatar(g?.avatar)
            const moja = w.autor === mojNick
            const moje = reakcje[w.id] ?? {}
            const skasowana = usuniete.includes(w.id)

            return (
              <article
                key={w.id}
                className={
                  'cz-msg' +
                  (w.bot ? ' bot' : '') +
                  (moja ? ' moja' : '') +
                  (skasowana ? ' skasowana' : '')
                }
              >
                <LinkGracza nick={w.autor} ja={moja} brak={w.bot || !g} className="cz-ava-link">
                  <span className="cz-ava-box">
                    {w.bot ? (
                      // Ogłoszenia wygłasza Dogma — jej własny sprite, nie ikonka Dead God.
                      <Sprite name="dogma" size={34} className="cz-dogma" />
                    ) : (
                      <>
                        <img
                          className={'cz-ava' + (wlasny ? ' foto' : '')}
                          src={avatarGracza(g?.avatar, 'Isaac')}
                          alt=""
                          width={34}
                          height={34}
                          aria-hidden
                        />
                        <DecorMark id={dekoracjaGracza(w.autor, wlasny)} />
                      </>
                    )}
                  </span>
                </LinkGracza>

                <div className="cz-bak">
                  <div className="cz-msg-top">
                    <LinkGracza nick={w.autor} ja={moja} brak={w.bot || !g}>
                      <span className="cz-autor" style={g?.kolor ? { color: g.kolor } : undefined}>
                        {w.autor}
                      </span>
                    </LinkGracza>
                    {w.bot && <span className="cz-bot">DOGMA</span>}
                    {moja && <span className="cz-ty">Ty</span>}
                    <span className="cz-czas muted small">{w.czas}</span>
                  </div>

                  {skasowana ? (
                    <p className="cz-linia cz-skasowana">Wiadomość usunięta</p>
                  ) : (
                    <>
                      {w.tekst.map((t, j) => (
                        <p className="cz-linia" key={j}>
                          {zTokenami(t)}
                        </p>
                      ))}
                      {w.obraz && <img className="cz-obraz" src={w.obraz} alt="Załącznik" />}
                    </>
                  )}

                  {/* Skasowana wiadomość nie ma czego zbierać — ani reakcji, ani akcji. */}
                  {!skasowana && (
                    <div className="cz-reakcje">
                      {/* Doklejone reakcje (te z licznikiem) — również te dodane z pickera. */}
                      {[
                        ...(w.reakcje ?? []),
                        ...Object.keys(moje)
                          .filter(
                            (i) =>
                              (moje[i] ?? 0) > 0 && !(w.reakcje ?? []).some((r) => r.ikona === i),
                          )
                          .map((i) => ({ ikona: i as SpriteName, ile: 0 })),
                      ].map((r) => {
                        const dodane = (moje[r.ikona] ?? 0) > 0
                        return (
                          <button
                            key={r.ikona}
                            className={'cz-reakcja' + (dodane ? ' on' : '')}
                            onClick={() => zareaguj(w.id, r.ikona)}
                            aria-pressed={dodane}
                          >
                            <Sprite name={r.ikona} size={14} /> {r.ile + (dodane ? 1 : 0)}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Akcje wiadomości: „+" (reakcje) i kasowanie własnych. Prawy dolny róg. */}
                  {!skasowana && (
                    <div className="cz-msg-akcje">
                      <button
                        className="cz-akcja cz-plus"
                        onClick={(e) => {
                          setKotwica(e.currentTarget)
                          setPicker(picker === w.id ? null : w.id)
                        }}
                        aria-label="Dodaj reakcję"
                        aria-expanded={picker === w.id}
                      >
                        +
                      </button>
                      {moja && (
                        <button
                          className="cz-akcja cz-usun"
                          onClick={() => usun(w.id)}
                          aria-label="Usuń wiadomość"
                        >
                          ×
                        </button>
                      )}
                      {picker === w.id && (
                        <WybieraczkaReakcji
                          kotwica={kotwica}
                          domyslne={REAKCJE}
                          onWybierz={(i) => {
                            zareaguj(w.id, i)
                            setPicker(null)
                          }}
                          onZamknij={() => setPicker(null)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* „X pisze…" — DEMO, symulowane (patrz useEffect wyżej). */}
        <div className="cz-pisza" aria-live="polite">
          {piszacy.length > 0 && (
            <>
              <span className="cz-kropki" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="muted small">
                {piszacy.join(' i ')} {piszacy.length > 1 ? 'piszą' : 'pisze'}…
              </span>
            </>
          )}
        </div>

        {tylkoOdczyt ? (
          <div className="cz-pisz cz-zamkniete">
            <Sprite name="deadgod" size={18} />
            {gosc ? (
              <span className="muted small">
                <a href="/logowanie">Zaloguj się</a>, aby dołączyć do rozmowy.
              </span>
            ) : (
              <span className="muted small">Tu mówi tylko Dogma. Ty słuchasz.</span>
            )}
          </div>
        ) : (
          <form
            className="cz-pisz"
            onSubmit={(e) => {
              e.preventDefault()
              wyslij()
            }}
          >
            {/* Podgląd załącznika nad polem — widać, co poleci, i da się zdjąć. */}
            {zalacznik && (
              <div className="cz-zalacznik">
                <img src={zalacznik} alt="Podgląd załącznika" />
                <button
                  type="button"
                  className="cz-zalacznik-x"
                  onClick={() => setZalacznik(null)}
                  aria-label="Usuń załącznik"
                >
                  ×
                </button>
              </div>
            )}

            <input
              ref={plik}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                wczytajObraz(e.target.files?.[0])
                e.target.value = '' // ten sam plik ma dać się wybrać drugi raz
              }}
            />
            <button
              type="button"
              className="cz-narzedzie"
              onClick={() => plik.current?.click()}
              aria-label="Dodaj obrazek"
              title="Dodaj obrazek (możesz też wkleić ze schowka)"
            >
              <Sprite name="kidsdrawing" size={18} />
            </button>

            <button
              ref={naklejkiBtn}
              type="button"
              className={'cz-narzedzie' + (naklejki ? ' tu' : '')}
              onClick={() => setNaklejki((v) => !v)}
              aria-label="Naklejki"
              aria-expanded={naklejki}
              title="Naklejka"
            >
              <Sprite name="godhead" size={18} />
            </button>
            {naklejki && (
              <WybieraczkaReakcji
                kotwica={naklejkiBtn.current}
                domyslne={REAKCJE}
                tryb="naklejki"
                onWybierz={wstawNaklejke}
                onZamknij={() => setNaklejki(false)}
              />
            )}

            <input
              ref={pole}
              className="cz-pole"
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              onPaste={wklej}
              placeholder={rozmowca ? `Napisz do ${rozmowca}…` : `Napisz do #${naglowek.nazwa}…`}
              aria-label="Treść wiadomości"
              maxLength={280}
            />
            <button
              className="cz-wyslij"
              type="submit"
              disabled={!tekst.trim() && !zalacznik}
              aria-label="Wyślij"
            >
              <Sprite name="heart" size={18} />
            </button>
          </form>
        )}
      </div>

      {/* ── W PIWNICY ── */}
      <aside className="cz-online">
        <div className="cz-online-head">
          <Sprite name="fly" size={18} /> W piwnicy — {online.length}
        </div>
        <ul className="cz-online-lista">
          {online.map((g) => {
            const wlasny = wlasnyAvatar(g.avatar)
            const status = statusGracza(g.nick)
            return (
              <li key={g.nick}>
                <LinkGracza nick={g.nick} ja={g.ja} className="cz-ava-link">
                  <span className="cz-ava-box maly">
                    <img
                      className={'cz-ava' + (wlasny ? ' foto' : '')}
                      src={avatarGracza(g.avatar, 'Isaac')}
                      alt=""
                      width={28}
                      height={28}
                      aria-hidden
                    />
                    <DecorMark id={dekoracjaGracza(g.nick, wlasny)} />
                  </span>
                </LinkGracza>
                <span className="cz-on-kto">
                  <LinkGracza nick={g.nick} ja={g.ja}>
                    <b style={g.kolor ? { color: g.kolor } : undefined}>{g.nick}</b>
                  </LinkGracza>
                  {/* Mała ikona Isaaca przy statusie — widać, co ktoś robi, bez czytania. */}
                  <span className="cz-on-status muted small">
                    <Sprite name={g.ja ? 'isaacHead' : status.ikona} size={13} />
                    {g.ja ? 'to Ty' : status.tekst}
                  </span>
                </span>
                <span className="cz-on-serce" aria-hidden>
                  <Sprite name="heart" size={12} />
                </span>
              </li>
            )
          })}
        </ul>
      </aside>
    </div>
  )
}
