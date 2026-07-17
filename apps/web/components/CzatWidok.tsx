'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Sprite, { NAZWY_SPRITEOW } from '@/components/Sprite'
import DecorMark from '@/components/DecorMark'
import LinkGracza from '@/components/LinkGracza'
import WybieraczkaReakcji from '@/components/WybieraczkaReakcji'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import { dekoracjaGracza } from '@/lib/klimat'
import { powiedz } from '@/lib/companionGlos'
import { supabasePrzegladarka } from '@/lib/supabase/przegladarka'
import { MAX_OBRAZEK, wgrajObrazek } from '@/lib/zalaczniki'
import { wyslijWiadomosc } from '@/app/actions/czat'
import {
  czyOnline,
  dmSlug,
  DOMYSLNY_KANAL,
  KANALY,
  kwestiaCzatu,
  MAX_DLUGOSC,
  nickZDm,
  REAKCJE,
  statusGracza,
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
 * Czat piwnicy: kanał globalny, ogłoszenia od Dogmy i prywatne rozmowy ze znajomymi.
 *
 * Wiadomości siedzą w bazie (tabela `Wiadomosc`) i dolatują przez Supabase Realtime, więc
 * przeżywają odświeżenie i widzą je wszyscy w kanale. Pierwszy kanał przychodzi gotowy
 * z serwera; przy zmianie kanału dociągamy go z `/api/czat`.
 *
 * Familiar NIE jest tu renderowany — komentarze idą eventem do maskotki w TopBarze,
 * żeby w apce był jeden zwierzak, a nie dwa.
 */
export default function CzatWidok({
  gracze,
  mojNick,
  gosc = false,
  startowe,
  startowyKanalDb,
}: {
  gracze: Rozmowca[]
  mojNick: string
  /** Gość: tylko czat globalny + ogłoszenia, oba do CZYTANIA. Reszta zablokowana. */
  gosc?: boolean
  /** Wiadomości kanału startowego, wyrenderowane już na serwerze. */
  startowe: Wiad[]
  /** Nazwa kanału startowego w bazie — pod nią słucha Realtime. */
  startowyKanalDb: string | null
}) {
  // Gość widzi tylko kanały publiczne (globalny + ogłoszenia); znajomych i DM chowamy.
  const kanaly = useMemo(
    () => (gosc ? KANALY.filter((k) => k.typ === 'global' || k.typ === 'ogloszenia') : KANALY),
    [gosc],
  )
  const [kanal, setKanal] = useState(DOMYSLNY_KANAL)
  const [kanalDb, setKanalDb] = useState<string | null>(startowyKanalDb)
  const [lista, setLista] = useState<Wiad[]>(startowe)
  const [ladowanie, setLadowanie] = useState(false)
  const [blad, setBlad] = useState<string | null>(null)
  const [wysylanie, setWysylanie] = useState(false)
  const [reakcje, setReakcje] = useState<Record<string, Record<string, number>>>({})
  const [tekst, setTekst] = useState('')
  // Usunięte wiadomości: zostaje po nich ślad („Wiadomość usunięta"), jak na Discordzie.
  const [usuniete, setUsuniete] = useState<string[]>([])
  // Załącznik czekający na wysłanie: podgląd (blob:) + plik, który poleci do Storage.
  const [zalacznik, setZalacznik] = useState<{ podglad: string; plik: File } | null>(null)
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

  /** Dociąga wiadomości kanału (razem z autorami) i nazwę kanału w bazie dla Realtime. */
  const odswiez = useCallback(async (slug: string) => {
    const r = await fetch(`/api/czat?kanal=${encodeURIComponent(slug)}`, { cache: 'no-store' })
    if (!r.ok) return { ok: false }
    const dane = await r.json()
    setLista(dane.wiadomosci ?? [])
    setKanalDb(dane.kanalDb ?? null)
    return { ok: true }
  }, [])

  // Kanał startowy przyszedł z serwera — nie ma po co pytać o niego drugi raz przy montowaniu.
  const zamontowany = useRef(false)
  useEffect(() => {
    if (!zamontowany.current) {
      zamontowany.current = true
      return
    }
    let porzucone = false
    setLadowanie(true)
    setBlad(null)
    odswiez(kanal).finally(() => {
      // Zdążyłeś przełączyć kanał, zanim wróciła odpowiedź — jej wynik już nikogo nie obchodzi.
      if (!porzucone) setLadowanie(false)
    })
    return () => {
      porzucone = true
    }
  }, [kanal, odswiez])

  /**
   * Realtime: nasłuch INSERT-ów w TYM kanale.
   *
   * Zdarzenie niesie same kolumny tabeli (bez nicku i pfp autora), więc nie doklejamy go
   * do listy — pytamy o kanał jeszcze raz. Jedno zapytanie po indeksie (kanal, utworzono)
   * jest tańsze niż dociąganie autora osobno i nie potrafi się rozjechać z bazą.
   *
   * Ogłoszenia pomijamy: to treść w kodzie, nie tabela — nie ma tam czego słuchać.
   */
  useEffect(() => {
    if (!kanalDb || kanalDb === 'ogloszenia') return
    const supabase = supabasePrzegladarka()
    const kanalRt = supabase
      .channel(`czat:${kanalDb}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'isaacdex',
          table: 'Wiadomosc',
          filter: `kanal=eq.${kanalDb}`,
        },
        () => {
          odswiez(kanal)
        },
      )
      // Broadcast „ktoś pisze": leci obok bazy, bo takich rzeczy się nie zapisuje.
      .on('broadcast', { event: 'pisze' }, ({ payload }) => {
        const kto = String(payload?.nick ?? '')
        if (!kto || kto === mojNick) return
        setPiszacy((p) => (p.includes(kto) ? p : [...p, kto]))
        setTimeout(() => setPiszacy((p) => p.filter((n) => n !== kto)), 3000)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(kanalRt)
    }
  }, [kanalDb, kanal, mojNick, odswiez])

  /**
   * Zjeżdżamy na dół LISTY, ustawiając jej `scrollTop` — a nie `scrollIntoView` na kotwicy.
   * `scrollIntoView` przewija KAŻDEGO scrollowalnego przodka, więc razem z listą ruszał
   * całą stronę (po wysłaniu wiadomości widok skakał na górę).
   */
  useEffect(() => {
    const el = msgs.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lista.length, kanal])

  // Zmiana kanału czyści to, co dotyczyło poprzedniego (kto pisał, jaki był błąd).
  const wejdz = (slug: string) => {
    setKanal(slug)
    setPiszacy([])
    setBlad(null)
    powiedz(kwestiaCzatu('kanal', slug, ++licznik.current))
  }

  /**
   * Mówimy innym, że piszemy — nie częściej niż raz na 1,5 s, bo inaczej lecielibyśmy
   * z broadcastem na każdy znak.
   */
  const ostatnieStuknij = useRef(0)
  const stuknij = () => {
    if (tylkoOdczyt || !kanalDb || kanalDb === 'ogloszenia') return
    const teraz = Date.now()
    if (teraz - ostatnieStuknij.current < 1500) return
    ostatnieStuknij.current = teraz
    supabasePrzegladarka()
      .channel(`czat:${kanalDb}`)
      .send({ type: 'broadcast', event: 'pisze', payload: { nick: mojNick } })
  }

  /**
   * Wysyłka: zapis leci server action (Prisma), a wiadomość wraca tą samą drogą co cudze —
   * przez odświeżenie listy. Bez dopisywania „na oko" do stanu, więc na ekranie jest
   * dokładnie to, co naprawdę zapisała baza.
   */
  const wyslij = async () => {
    const t = tekst.trim()
    // Sam obrazek (bez tekstu) też jest wiadomością — stąd warunek na zalacznik.
    if ((!t && !zalacznik) || tylkoOdczyt || wysylanie) return

    setWysylanie(true)
    setBlad(null)
    try {
      let obrazekUrl: string | null = null
      if (zalacznik) {
        obrazekUrl = await wgrajObrazek(zalacznik.plik)
        if (!obrazekUrl) {
          setBlad('Nie udało się wysłać obrazka. Spróbuj jeszcze raz.')
          return
        }
      }

      const wynik = await wyslijWiadomosc(kanal, t, obrazekUrl)
      if (!wynik.ok) {
        setBlad(wynik.powod)
        return
      }

      setTekst('')
      if (zalacznik) URL.revokeObjectURL(zalacznik.podglad)
      setZalacznik(null)
      await odswiez(kanal)
      powiedz(kwestiaCzatu('wyslano', t || 'obrazek', ++licznik.current))
    } finally {
      setWysylanie(false)
    }
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

  /**
   * Obrazek z pliku albo ze schowka. Podgląd robimy lokalnie (blob:), ale trzymamy też sam
   * plik — dopiero przy wysyłce leci do Storage i wtedy dostaje adres, który przeżyje.
   */
  const wczytajObraz = (f: File | null | undefined) => {
    if (!f || !f.type.startsWith('image/')) return
    if (f.size > MAX_OBRAZEK) {
      setBlad('Obrazek jest za duży (maks. 3 MB).')
      return
    }
    setBlad(null)
    setZalacznik({ podglad: URL.createObjectURL(f), plik: f })
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
          {ladowanie && lista.length === 0 && <p className="cz-stan muted small">Wczytuję…</p>}
          {!ladowanie && lista.length === 0 && (
            <p className="cz-stan muted small">
              {rozmowca
                ? `Cisza. Napisz do ${rozmowca} pierwszy.`
                : 'Pusto jak w Sklepie o 3 w nocy. Napisz pierwszy.'}
            </p>
          )}
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
                <img src={zalacznik.podglad} alt="Podgląd załącznika" />
                <button
                  type="button"
                  className="cz-zalacznik-x"
                  onClick={() => {
                    URL.revokeObjectURL(zalacznik.podglad)
                    setZalacznik(null)
                  }}
                  aria-label="Usuń załącznik"
                >
                  ×
                </button>
              </div>
            )}

            {blad && (
              <p className="cz-blad" role="alert">
                <Sprite name="skull" size={14} /> {blad}
              </p>
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
              onChange={(e) => {
                setTekst(e.target.value)
                stuknij()
              }}
              onPaste={wklej}
              placeholder={rozmowca ? `Napisz do ${rozmowca}…` : `Napisz do #${naglowek.nazwa}…`}
              aria-label="Treść wiadomości"
              maxLength={MAX_DLUGOSC}
            />
            <button
              className="cz-wyslij"
              type="submit"
              disabled={(!tekst.trim() && !zalacznik) || wysylanie}
              aria-label="Wyślij"
            >
              <Sprite name={wysylanie ? 'godhead' : 'heart'} size={18} />
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
