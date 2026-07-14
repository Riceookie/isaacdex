'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Sprite from '@/components/Sprite'
import DecorMark from '@/components/DecorMark'
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
  REAKCJE,
  rozmowaZ,
  statusGracza,
  WIADOMOSCI,
  type Wiad,
} from '@/lib/czat'
import type { SpriteName } from '@/components/Sprite'

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
export default function CzatWidok({ gracze, mojNick }: { gracze: Rozmowca[]; mojNick: string }) {
  const [kanal, setKanal] = useState(DOMYSLNY_KANAL)
  const [wyslane, setWyslane] = useState<Record<string, Wiad[]>>({})
  const [reakcje, setReakcje] = useState<Record<string, Record<string, number>>>({})
  const [tekst, setTekst] = useState('')
  const licznik = useRef(0)
  const dol = useRef<HTMLDivElement>(null)

  const znajomi = useMemo(() => gracze.filter((g) => g.znajomy), [gracze])
  const wgNicku = useMemo(() => new Map(gracze.map((g) => [g.nick, g])), [gracze])
  const online = useMemo(() => gracze.filter((g) => g.ja || czyOnline(g.nick)), [gracze])
  const zginelo = gracze.length - online.length

  const rozmowca = nickZDm(kanal)
  const definicja = KANALY.find((k) => k.slug === kanal)
  const tylkoOdczyt = !!definicja?.tylkoOdczyt

  // Wiadomości kanału = startowe (demo albo wygenerowana rozmowa) + to, co dopisałeś.
  const lista = useMemo(() => {
    const bazowe = rozmowca ? rozmowaZ(rozmowca, mojNick) : (WIADOMOSCI[kanal] ?? [])
    return [...bazowe, ...(wyslane[kanal] ?? [])]
  }, [kanal, rozmowca, mojNick, wyslane])

  useEffect(() => {
    dol.current?.scrollIntoView({ block: 'end' })
  }, [lista.length, kanal])

  const wejdz = (slug: string) => {
    setKanal(slug)
    powiedz(kwestiaCzatu('kanal', slug, ++licznik.current))
  }

  const wyslij = () => {
    const t = tekst.trim()
    if (!t || tylkoOdczyt) return
    const teraz = new Date()
    const wiad: Wiad = {
      id: `moja-${teraz.getTime()}`,
      autor: mojNick,
      czas: `${String(teraz.getHours()).padStart(2, '0')}:${String(teraz.getMinutes()).padStart(2, '0')}`,
      tekst: [t],
    }
    setWyslane((w) => ({ ...w, [kanal]: [...(w[kanal] ?? []), wiad] }))
    setTekst('')
    powiedz(kwestiaCzatu('wyslano', t, ++licznik.current))
  }

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
            {KANALY.map((k) => (
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
          {znajomi.length === 0 ? (
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
              {naglowek.nazwa}
            </h2>
            <p className="muted small">{naglowek.opis}</p>
          </div>
        </header>

        <div className="cz-msgs">
          {lista.map((w) => {
            const g = wgNicku.get(w.autor)
            const wlasny = wlasnyAvatar(g?.avatar)
            const moja = w.autor === mojNick
            const moje = reakcje[w.id] ?? {}

            return (
              <article
                key={w.id}
                className={'cz-msg' + (w.bot ? ' bot' : '') + (moja ? ' moja' : '')}
              >
                <span className="cz-ava-box">
                  {w.bot ? (
                    <Sprite name="deadgod" size={34} />
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

                <div className="cz-bak">
                  <div className="cz-msg-top">
                    <span className="cz-autor" style={g?.kolor ? { color: g.kolor } : undefined}>
                      {w.autor}
                    </span>
                    {w.bot && <span className="cz-bot">DOGMA</span>}
                    {moja && <span className="cz-ty">Ty</span>}
                    <span className="cz-czas muted small">{w.czas}</span>
                  </div>

                  {w.tekst.map((t, j) => (
                    <p className="cz-linia" key={j}>
                      {t}
                    </p>
                  ))}

                  <div className="cz-reakcje">
                    {(w.reakcje ?? []).map((r) => {
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

                    {/* Szybkie reakcje — wyjeżdżają dopiero po najechaniu na wiadomość. */}
                    <span className="cz-szybkie">
                      {REAKCJE.filter((i) => !(w.reakcje ?? []).some((r) => r.ikona === i)).map(
                        (i) => {
                          const dodane = (moje[i] ?? 0) > 0
                          return (
                            <button
                              key={i}
                              className={'cz-reakcja pusta' + (dodane ? ' on' : '')}
                              onClick={() => zareaguj(w.id, i)}
                              aria-label={`Reakcja ${i}`}
                              aria-pressed={dodane}
                            >
                              <Sprite name={i} size={14} />
                              {dodane ? ' 1' : ''}
                            </button>
                          )
                        },
                      )}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
          <div ref={dol} />
        </div>

        {tylkoOdczyt ? (
          <div className="cz-pisz cz-zamkniete">
            <Sprite name="deadgod" size={18} />
            <span className="muted small">Tu mówi tylko Dogma. Ty słuchasz.</span>
          </div>
        ) : (
          <form
            className="cz-pisz"
            onSubmit={(e) => {
              e.preventDefault()
              wyslij()
            }}
          >
            <input
              className="cz-pole"
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              placeholder={rozmowca ? `Napisz do ${rozmowca}…` : `Napisz do #${naglowek.nazwa}…`}
              aria-label="Treść wiadomości"
              maxLength={280}
            />
            <button
              className="cz-wyslij"
              type="submit"
              disabled={!tekst.trim()}
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
                <span className="cz-on-kto">
                  <b style={g.kolor ? { color: g.kolor } : undefined}>{g.nick}</b>
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
