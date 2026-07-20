'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Sprite, { NAZWY_SPRITEOW } from '@/components/Sprite'
import DecorMark from '@/components/DecorMark'
import LinkGracza from '@/components/LinkGracza'
import WybieraczkaReakcji from '@/components/WybieraczkaReakcji'
import WybieraczkaNaklejek from '@/components/WybieraczkaNaklejek'
import IkonaCzatu from '@/components/IkonaCzatu'
import { naklejka } from '@/lib/naklejki'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import { powiedz } from '@/lib/companionGlos'
import { supabasePrzegladarka } from '@/lib/supabase/przegladarka'
import { MAX_OBRAZEK, wgrajObrazek } from '@/lib/zalaczniki'
import { przelaczReakcje, wyslijWiadomosc } from '@/app/actions/czat'
import {
  dmSlug,
  DOMYSLNY_KANAL,
  KANALY,
  kwestiaCzatu,
  MAX_DLUGOSC,
  nickZDm,
  REAKCJE,
  type Wiad,
} from '@/lib/czat'
import type { SpriteName } from '@/components/Sprite'
import type { DecorId } from '@/lib/pfpDecor'
import { useT } from '@/components/JezykProvider'

/**
 * Zamienia tokeny `:nazwa:` na sprite'y z gry, resztę zostawia tekstem.
 * Nieznana nazwa (ktoś wpisał `:cos:` z palca) zostaje zwykłym tekstem — lepiej pokazać
 * to, co napisał, niż zjeść fragment zdania.
 *
 * Dwa źródła: rejestr ikon interfejsu (`:godhead:`) i katalog naklejek, czyli komplet
 * itemów/trinketów/pickupów po ID z gry (`:c105:`). Rejestr sprawdzamy pierwszy, bo to on
 * jest w starszych wiadomościach.
 *
 * Token dopuszcza cyfry (`:c105:`), ale musi zaczynać się od litery — inaczej godzina
 * w zdaniu („10:30-11:") zaczęłaby wyglądać jak naklejka.
 */
function zTokenami(tekst: string): ReactNode[] {
  return tekst.split(/(:[a-zA-Z][a-zA-Z0-9]*:)/g).map((kawalek, i) => {
    const m = kawalek.match(/^:([a-zA-Z][a-zA-Z0-9]*):$/)
    if (!m) return kawalek
    const nazwa = m[1]
    if ((NAZWY_SPRITEOW as string[]).includes(nazwa)) {
      return <Sprite key={i} name={nazwa as SpriteName} size={22} className="cz-naklejka-inline" />
    }
    const n = naklejka(nazwa)
    if (n) {
      return (
        <img
          key={i}
          src={n.src}
          alt={n.nazwa}
          title={n.nazwa}
          width={22}
          height={22}
          loading="lazy"
          decoding="async"
          className="sprite cz-naklejka-inline"
          draggable={false}
        />
      )
    }
    return kawalek
  })
}

export type Rozmowca = {
  nick: string
  kolor: string | null
  avatar: string | null
  dekoracja: DecorId
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
  const tl = useT()
  // Gość widzi tylko kanały publiczne (globalny + ogłoszenia); znajomych i DM chowamy.
  const kanaly = useMemo(() => (gosc ? KANALY.filter((k) => k.typ === 'global') : KANALY), [gosc])
  const [kanal, setKanal] = useState(DOMYSLNY_KANAL)
  const [kanalDb, setKanalDb] = useState<string | null>(startowyKanalDb)
  const [lista, setLista] = useState<Wiad[]>(startowe)
  const [ladowanie, setLadowanie] = useState(false)
  const [blad, setBlad] = useState<string | null>(null)
  const [wysylanie, setWysylanie] = useState(false)
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
  /**
   * Lista „W piwnicy" domyślnie SCHOWANA — zabierała 240 px stałej szerokości, żeby
   * pokazać zwykle jedną osobę. Odzyskane miejsce idzie na wiadomości; kto chce, otwiera
   * ją strzałką. Wybór pamiętamy w przeglądarce (to preferencja widoku, nie dane konta).
   */
  const [obecniOtwarci, setObecniOtwarci] = useState(false)
  /**
   * Na wąskim ekranie nie da się pokazać listy kanałów I rozmowy naraz — pokazujemy jedno
   * albo drugie. Wejście w kanał przesuwa na rozmowę, „← Kanały" wraca.
   * Na desktopie ta flaga nic nie znaczy (CSS pokazuje oba panele).
   */
  const [mobilnaRozmowa, setMobilnaRozmowa] = useState(false)
  const licznik = useRef(0)
  const msgs = useRef<HTMLDivElement>(null)
  const plik = useRef<HTMLInputElement>(null)
  const pole = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setObecniOtwarci(localStorage.getItem('idx_czat_obecni') === '1')
  }, [])
  const przelaczObecnych = () =>
    setObecniOtwarci((v) => {
      localStorage.setItem('idx_czat_obecni', v ? '0' : '1')
      return !v
    })

  const znajomi = useMemo(() => gracze.filter((g) => g.znajomy), [gracze])
  const wgNicku = useMemo(() => new Map(gracze.map((g) => [g.nick, g])), [gracze])
  // Kto NAPRAWDĘ siedzi teraz na czacie (Realtime presence) — patrz useEffect niżej.
  const [obecni, setObecni] = useState<string[]>([])
  const online = useMemo(() => gracze.filter((g) => obecni.includes(g.nick)), [gracze, obecni])

  const rozmowca = nickZDm(kanal)
  const definicja = KANALY.find((k) => k.slug === kanal)
  // Gość czyta, ale nie pisze — jedyny powód, dla którego kanał bywa tylko do odczytu.
  const tylkoOdczyt = gosc

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
   */
  useEffect(() => {
    if (!kanalDb) return
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
      // Reakcje też mają pojawiać się od razu. Bez filtra po kanale — reakcja go nie zna,
      // a wierszy jest na tyle mało, że dociągnięcie listy jest tańsze niż kolejne złączenie.
      .on(
        'postgres_changes',
        { event: '*', schema: 'isaacdex', table: 'ReakcjaWiadomosci' },
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
   * Kto jest w piwnicy — Realtime presence.
   *
   * Wcześniej „online" wychodziło z hasza nicku: lista zawsze pokazywała tych samych ludzi
   * jako obecnych, niezależnie od tego, czy ktokolwiek tam był. Teraz każdy zalogowany
   * melduje się w kanale obecności i znika z listy, gdy zamknie stronę — więc lista bywa
   * krótka, ale mówi prawdę.
   *
   * Osobny kanał od wiadomości: obecność dotyczy CAŁEGO czatu, a nie tego, w którym
   * pokoju akurat jesteś.
   */
  useEffect(() => {
    if (gosc) return // gość nie melduje obecności — nie ma tożsamości
    const supabase = supabasePrzegladarka()
    const kanalObecnych = supabase.channel('piwnica:obecni', {
      config: { presence: { key: mojNick } },
    })

    const przelicz = () => {
      const stan = kanalObecnych.presenceState()
      setObecni(Object.keys(stan))
    }

    kanalObecnych
      .on('presence', { event: 'sync' }, przelicz)
      .on('presence', { event: 'join' }, przelicz)
      .on('presence', { event: 'leave' }, przelicz)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') kanalObecnych.track({ nick: mojNick })
      })

    return () => {
      supabase.removeChannel(kanalObecnych)
    }
  }, [gosc, mojNick])

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
    setMobilnaRozmowa(true)
    powiedz(kwestiaCzatu(tl, 'kanal', slug, ++licznik.current))
  }

  /**
   * Mówimy innym, że piszemy — nie częściej niż raz na 1,5 s, bo inaczej lecielibyśmy
   * z broadcastem na każdy znak.
   */
  const ostatnieStuknij = useRef(0)
  const stuknij = () => {
    if (tylkoOdczyt || !kanalDb) return
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
          setBlad(tl('czat.bladWysylkiObrazka'))
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
      powiedz(kwestiaCzatu(tl, 'wyslano', t || 'obrazek', ++licznik.current))
    } finally {
      setWysylanie(false)
    }
  }

  /**
   * Naklejka wchodzi do POLA jako token `:nazwa:`, a nie leci osobną wiadomością —
   * dzięki temu da się ją dopisać do zdania („gg :trophy:") i poprawić przed wysłaniem.
   * Render zamienia token z powrotem na sprite (patrz `zTokenami`).
   */
  const wstawNaklejke = (id: string) => {
    if (tylkoOdczyt) return
    setTekst((t) => (t ? t.replace(/\s*$/, '') + ' ' : '') + `:${id}: `)
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
      setBlad(tl('czat.bladObrazekZaDuzy'))
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

  /**
   * Reakcja leci do bazy i wraca odświeżeniem listy — tak samo jak wiadomość. Bez
   * dopisywania „na oko" do stanu: liczniki mają pokazywać to, co naprawdę stoi w bazie,
   * a nie to, co przed chwilą kliknąłeś.
   */
  const zareaguj = async (idWiad: string, ikona: string) => {
    if (gosc) return
    const wynik = await przelaczReakcje(Number(idWiad), ikona)
    if (!wynik.ok) {
      setBlad(wynik.powod)
      return
    }
    await odswiez(kanal)
  }

  const naglowek = rozmowca
    ? { nazwa: rozmowca, ikona: null, opis: tl('czat.dmOpis') }
    : {
        nazwa: definicja ? tl(definicja.kluczNazwy) : '',
        ikona: definicja?.ikona ?? null,
        opis: definicja ? tl(definicja.kluczOpisu) : '',
      }

  return (
    <div
      className={
        'cz' +
        (obecniOtwarci ? ' z-obecnymi' : '') +
        (mobilnaRozmowa ? ' mob-rozmowa' : ' mob-kanaly')
      }
    >
      {/* ── KANAŁY + PRYWATNE ── */}
      <aside className="cz-mapa">
        <div className="cz-mapa-head">
          <Sprite name="dadsnote" size={18} /> {tl('czat.piwnicaNaglowek')}
        </div>

        <div className="cz-kanaly">
          <ul className="cz-lista-kanalow">
            {kanaly.map((k) => (
              <li key={k.slug}>
                <button
                  className={'cz-kanal' + (k.slug === kanal ? ' tu' : '')}
                  onClick={() => wejdz(k.slug)}
                  aria-current={k.slug === kanal}
                  title={tl(k.kluczOpisu)}
                >
                  <span className="cz-kanal-ic">
                    <Sprite name={k.ikona} size={18} />
                  </span>
                  <span className="cz-kanal-nazwa">{tl(k.kluczNazwy)}</span>
                  {k.slug === kanal && <span className="cz-tu-kropka" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>

          <div className="cz-grupa">{tl('czat.grupaPrywatne')}</div>
          {gosc ? (
            <p className="cz-brak-dm muted small">
              <a href="/logowanie">{tl('czat.goscZalogujSie')}</a>
              {tl('czat.goscZalogujReszta')}
            </p>
          ) : znajomi.length === 0 ? (
            <p className="cz-brak-dm muted small">{tl('czat.brakZnajomych')}</p>
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
                        <DecorMark id={g.dekoracja} />
                      </span>
                      <span
                        className="cz-kanal-nazwa"
                        style={g.kolor ? { color: g.kolor } : undefined}
                      >
                        {g.nick}
                      </span>
                      {obecni.includes(g.nick) && (
                        <span className="cz-zyje" aria-label={tl('czat.online')} />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Offline w klimacie apki: nie „offline", tylko martwi. Liczba jest prawdziwa —
            tylu zarejestrowanych graczy nie ma teraz na czacie. */}
        <div className="cz-zgineli">
          <span className="cz-trup" aria-hidden />
          <span className="muted small">
            <b>{gracze.length - online.length}</b>{' '}
            {tl('czat.zgineli', { liczba: gracze.length - online.length })}
          </span>
        </div>
      </aside>

      {/* ── KANAŁ: nagłówek, wiadomości, pisanie ── */}
      <div className="cz-pokoj-widok">
        <header className="cz-head">
          {/* Widoczny tylko na wąskim ekranie (CSS) — desktop ma listę kanałów obok. */}
          <button
            className="cz-wroc"
            onClick={() => setMobilnaRozmowa(false)}
            aria-label={tl('czat.wrocDoKanalow')}
          >
            ‹
          </button>
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

          <button
            className={'cz-obecni-btn' + (obecniOtwarci ? ' otwarty' : '')}
            onClick={przelaczObecnych}
            aria-label={tl(obecniOtwarci ? 'czat.schowajObecnych' : 'czat.pokazObecnych')}
            aria-expanded={obecniOtwarci}
            title={
              obecniOtwarci
                ? tl('czat.schowajListe')
                : tl('czat.wPiwnicyIle', { liczba: online.length })
            }
          >
            <Sprite name="fly" size={16} />
            <span className="cz-obecni-ile">{online.length}</span>
            <span className="cz-obecni-strzalka" aria-hidden>
              ›
            </span>
          </button>
        </header>

        <div className="cz-msgs" ref={msgs}>
          {ladowanie && lista.length === 0 && (
            <p className="cz-stan muted small">{tl('czat.wczytuje')}</p>
          )}
          {!ladowanie && lista.length === 0 && (
            <p className="cz-stan muted small">
              {rozmowca
                ? tl('czat.ciszaDm', { nick: rozmowca })
                : tl(gosc ? 'czat.piwnicaMilczyGosc' : 'czat.piwnicaMilczy')}
            </p>
          )}
          {lista.map((w) => {
            const g = wgNicku.get(w.autor)
            const wlasny = wlasnyAvatar(g?.avatar)
            const moja = w.autor === mojNick
            const skasowana = usuniete.includes(w.id)

            return (
              <article
                key={w.id}
                className={'cz-msg' + (moja ? ' moja' : '') + (skasowana ? ' skasowana' : '')}
              >
                <LinkGracza nick={w.autor} ja={moja} brak={!g} className="cz-ava-link">
                  <span className="cz-ava-box">
                    <img
                      className={'cz-ava' + (wlasny ? ' foto' : '')}
                      src={avatarGracza(g?.avatar, 'Isaac')}
                      alt=""
                      width={34}
                      height={34}
                      aria-hidden
                    />
                    <DecorMark id={g?.dekoracja ?? 'none'} />
                  </span>
                </LinkGracza>

                <div className="cz-bak">
                  <div className="cz-msg-top">
                    <LinkGracza nick={w.autor} ja={moja} brak={!g}>
                      <span className="cz-autor" style={g?.kolor ? { color: g.kolor } : undefined}>
                        {w.autor}
                      </span>
                    </LinkGracza>
                    {moja && <span className="cz-ty">{tl('czat.ty')}</span>}
                    <span className="cz-czas muted small">{w.czas}</span>
                  </div>

                  {skasowana ? (
                    <p className="cz-linia cz-skasowana">{tl('czat.wiadomoscUsunieta')}</p>
                  ) : (
                    <>
                      {w.tekst.map((t, j) => (
                        <p className="cz-linia" key={j}>
                          {zTokenami(t)}
                        </p>
                      ))}
                      {w.obraz && (
                        <img className="cz-obraz" src={w.obraz} alt={tl('czat.zalacznikAlt')} />
                      )}
                    </>
                  )}

                  {/* Skasowana wiadomość nie ma czego zbierać — ani reakcji, ani akcji. */}
                  {!skasowana && (w.reakcje?.length ?? 0) > 0 && (
                    <div className="cz-reakcje">
                      {w.reakcje!.map((r) => (
                        <button
                          key={r.ikona}
                          className={'cz-reakcja' + (r.moja ? ' on' : '')}
                          onClick={() => zareaguj(w.id, r.ikona)}
                          aria-pressed={r.moja}
                          disabled={gosc}
                        >
                          <IkonaCzatu id={r.ikona} size={14} /> {r.ile}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Akcje wiadomości: „+" (reakcje) i kasowanie własnych. Prawy dolny róg. */}
                  {!skasowana && !gosc && (
                    <div className="cz-msg-akcje">
                      <button
                        className="cz-akcja cz-plus"
                        onClick={(e) => {
                          setKotwica(e.currentTarget)
                          setPicker(picker === w.id ? null : w.id)
                        }}
                        aria-label={tl('czat.dodajReakcje')}
                        aria-expanded={picker === w.id}
                      >
                        +
                      </button>
                      {moja && (
                        <button
                          className="cz-akcja cz-usun"
                          onClick={() => usun(w.id)}
                          aria-label={tl('czat.usunWiadomosc')}
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

        {/* „X pisze…" — prawdziwe: broadcast od innych (patrz useEffect wyżej). */}
        <div className="cz-pisza" aria-live="polite">
          {piszacy.length > 0 && (
            <>
              <span className="cz-kropki" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="muted small">
                {tl('czat.pisze', {
                  kto: piszacy.join(` ${tl('czat.lacznikI')} `),
                  liczba: piszacy.length,
                })}
              </span>
            </>
          )}
        </div>

        {/* Tylko do odczytu = jesteś gościem (kanałów bez prawa głosu już nie ma).
            Zamiast suchej blokady: powiedz, co dostaniesz po założeniu konta. */}
        {tylkoOdczyt ? (
          <div className="cz-pisz cz-zamkniete">
            <Sprite name="heart" size={18} />
            <span className="muted small">
              {tl('czat.goscCzytasz')} <a href="/logowanie">{tl('czat.goscZalozKonto')}</a>
              {tl('czat.goscZalozKontoReszta')}
            </span>
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
                <img src={zalacznik.podglad} alt={tl('czat.podgladZalacznika')} />
                <button
                  type="button"
                  className="cz-zalacznik-x"
                  onClick={() => {
                    URL.revokeObjectURL(zalacznik.podglad)
                    setZalacznik(null)
                  }}
                  aria-label={tl('czat.usunZalacznik')}
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
              aria-label={tl('czat.dodajObrazek')}
              title={tl('czat.dodajObrazekTytul')}
            >
              <Sprite name="kidsdrawing" size={18} />
            </button>

            <button
              ref={naklejkiBtn}
              type="button"
              className={'cz-narzedzie' + (naklejki ? ' tu' : '')}
              onClick={() => setNaklejki((v) => !v)}
              aria-label={tl('czat.naklejkiPrzycisk')}
              aria-expanded={naklejki}
              title={tl('czat.naklejkaTytul')}
            >
              <Sprite name="godhead" size={18} />
            </button>
            {naklejki && (
              <WybieraczkaNaklejek
                kotwica={naklejkiBtn.current}
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
              placeholder={
                rozmowca
                  ? tl('czat.napiszDoNicku', { nick: rozmowca })
                  : tl('czat.napiszDoKanalu', { kanal: naglowek.nazwa })
              }
              aria-label={tl('czat.trescWiadomosci')}
              maxLength={MAX_DLUGOSC}
            />
            <button
              className="cz-wyslij"
              type="submit"
              disabled={(!tekst.trim() && !zalacznik) || wysylanie}
              aria-label={tl('czat.wyslij')}
            >
              <Sprite name={wysylanie ? 'godhead' : 'wyslij'} size={18} />
            </button>
          </form>
        )}
      </div>

      {/* ── W PIWNICY ── */}
      <aside className="cz-online" aria-hidden={!obecniOtwarci}>
        <div className="cz-online-head">
          <span>
            <Sprite name="fly" size={18} /> {tl('czat.wPiwnicyNaglowek', { liczba: online.length })}
          </span>
          <button
            className="cz-online-x"
            onClick={przelaczObecnych}
            aria-label={tl('czat.schowajListe')}
          >
            ×
          </button>
        </div>
        <ul className="cz-online-lista">
          {online.map((g) => {
            const wlasny = wlasnyAvatar(g.avatar)
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
                    <DecorMark id={g.dekoracja} />
                  </span>
                </LinkGracza>
                <span className="cz-on-kto">
                  <LinkGracza nick={g.nick} ja={g.ja}>
                    <b style={g.kolor ? { color: g.kolor } : undefined}>{g.nick}</b>
                  </LinkGracza>
                  {/* Bez zmyślonych statusów („krwawi na Sheol") — nie wiemy, co ktoś
                      robi w grze. Wiemy tylko, że tu jest. */}
                  <span className="cz-on-status muted small">
                    <Sprite name={g.ja ? 'isaacHead' : 'fly'} size={13} />
                    {tl(g.ja ? 'czat.toTy' : 'czat.statusWPiwnicy')}
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
