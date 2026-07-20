'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import Sprite, { type SpriteName } from '@/components/Sprite'
import PustyStan from '@/components/PustyStan'
import { useZalogowany } from '@/components/KontoProvider'
import { useT } from '@/components/JezykProvider'
import LinkGracza from '@/components/LinkGracza'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'
import type { Klucz, Tlumacz } from '@/lib/i18n/slownik'
import type { Powiadomienie, TypPowiadomienia } from '@/lib/powiadomienia'

/** Kształt z serwera 1:1 — typ mieszka w `lib/powiadomienia`, tu tylko go czytamy. */
type Notif = Powiadomienie

// Sprite z gry na każdy typ powiadomienia — jedno źródło prawdy zamiast ifów w JSX.
const IKONA: Record<TypPowiadomienia, SpriteName> = {
  follow: 'friendfinder', // Friend Finder — ktoś Cię obserwuje
  wiadomosc: 'friends', // BFFS! — wiadomość prywatna
  achievement: 'trophy', // Challenge Trophy — Twój achievement ze Steama
  achievementRzadki: 'membercard', // Member Card — achievement, którego prawie nikt nie ma
  znajomyUnlock: 'stopwatch', // Stop Watch — świeże odblokowanie obserwowanego gracza
  znajomyBoss: 'skull', // Dead Cat — pokonany boss
  znajomyRun: 'd6', // The D6 — zakończony run
}

// Zdanie „co zrobił" — serwer oddaje sam typ, tekst dopiero tutaj, w języku interfejsu.
// Dla cudzych zdarzeń bez nicku na początku: ten dokleja LinkGracza obok.
const TEKST: Record<TypPowiadomienia, Klucz> = {
  follow: 'spolecznosc.powiadomienieObserwuje',
  wiadomosc: 'spolecznosc.powiadomienieWiadomosc',
  achievement: 'spolecznosc.powiadomienieAchievement',
  achievementRzadki: 'spolecznosc.powiadomienieAchievementRzadki',
  znajomyUnlock: 'spolecznosc.powiadomienieZnajomyUnlock',
  znajomyBoss: 'spolecznosc.powiadomienieZnajomyBoss',
  znajomyRun: 'spolecznosc.powiadomienieZnajomyRun',
}

/** Kiedy ostatnio otwierałeś dzwonek — to preferencja tej przeglądarki, nie dane konta. */
const KLUCZ_WIDZIANE = 'idx_powiadomienia_widziane'

/** Opis runu bywa zdaniem, a nie nazwą — w jednej linijce wiersza musi się skończyć. */
const DETAL_MAX = 42

function ileTemu(iso: string, t: Tlumacz): string {
  const minuty = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minuty < 1) return t('spolecznosc.przedChwila')
  if (minuty < 60) return t('spolecznosc.minTemu', { liczba: minuty })
  const godziny = Math.round(minuty / 60)
  if (godziny < 24) return t('spolecznosc.godzTemu', { liczba: godziny })
  const dni = Math.round(godziny / 24)
  return dni === 1 ? t('spolecznosc.wczoraj') : t('spolecznosc.dniTemu', { liczba: dni })
}

/**
 * Portret w wierszu: KTO to zrobił.
 *
 * Wyjątek — Twoje własne achievementy. Tam „kto" jesteś Ty (i tak wiesz), więc
 * pole portretu dostaje prawdziwą ikonę achievementu ze Steama: niesie treść,
 * a nie powtarza Twój avatar cztery razy pod rząd.
 */
function portret(n: Notif): { src: string; wlasny: boolean } {
  if (n.ja && n.ikonaUrl) return { src: n.ikonaUrl, wlasny: true }
  return { src: avatarGracza(n.avatar), wlasny: wlasnyAvatar(n.avatar) }
}

/**
 * Dzwonek z licznikiem nieprzeczytanych + rozwijana kartka powiadomień.
 * Licznik gaśnie po ZAMKNIĘCIU panelu, nie po otwarciu — dzięki temu przez cały czas
 * czytania widać, które wpisy są nowe (czerwony akcent).
 */
export default function NotificationsBell() {
  const zalogowany = useZalogowany()
  const t = useT()
  const [notyfikacje, setNotyfikacje] = useState<Notif[]>([])
  const [pobrane, setPobrane] = useState(false)
  const [open, setOpen] = useState(false)
  const [zamyka, setZamyka] = useState(false)
  const [widziane, setWidziane] = useState<number>(0)
  const ref = useRef<HTMLDivElement>(null)

  // Gość nie ma powiadomień — pusty dzwonek z zaproszeniem do logowania.
  useEffect(() => {
    if (!zalogowany) return
    setWidziane(Number(localStorage.getItem(KLUCZ_WIDZIANE) ?? 0))
    fetch('/api/powiadomienia', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { powiadomienia: [] }))
      .then((d) => setNotyfikacje(d.powiadomienia ?? []))
      .catch(() => setNotyfikacje([]))
      // Pusty stan wolno pokazać DOPIERO po odpowiedzi — inaczej mignąłby „nic nowego"
      // w trakcie pobierania, u kogoś, kto ma dwanaście powiadomień.
      .finally(() => setPobrane(true))
  }, [zalogowany])

  // Nowe = zaszły po ostatnim otwarciu dzwonka w tej przeglądarce.
  const czyNowe = (n: Notif) => new Date(n.czas).getTime() > widziane
  const unread = notyfikacje.filter(czyNowe).length

  /** Zapisuje „widziałem wszystko do teraz" — w localStorage, bo to stan tej przeglądarki. */
  function oznaczPrzeczytane() {
    const teraz = Date.now()
    localStorage.setItem(KLUCZ_WIDZIANE, String(teraz))
    setWidziane(teraz)
  }

  function otworz() {
    setZamyka(false)
    setOpen(true)
  }
  // Zamknięcie tylko odpala animację wyjścia; odmontowanie robi onAnimationEnd.
  function zamknij() {
    if (open && !zamyka) setZamyka(true)
  }

  // Zamknij po kliknięciu poza panelem albo Escape.
  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) zamknij()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && zamknij()
    window.addEventListener('pointerdown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
    // `zamyka` w zależnościach: bez niego domknięcie trzymałoby nieaktualną wartość
    // i próbowałoby zamykać panel, który już się zamyka.
  }, [open, zamyka])

  /**
   * Koniec animacji WYJŚCIA → dopiero teraz znika panel i gaśnie licznik.
   * `target !== currentTarget` odsiewa animacje dzieci (kapiąca krew), które bąbelkują tutaj.
   */
  function onAnimEnd(e: AnimationEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || !zamyka) return
    setZamyka(false)
    setOpen(false)
    oznaczPrzeczytane()
  }

  return (
    <div className="notif" ref={ref}>
      <button
        className="util-icon"
        type="button"
        onClick={() => (open ? zamknij() : otworz())}
        aria-label={t('spolecznosc.powiadomienia')}
        aria-expanded={open}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        >
          <path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" strokeLinecap="round" />
          <path d="M10 20a2 2 0 004 0" strokeLinecap="round" />
        </svg>
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {open && (
        <div
          className={'notif-pop' + (zamyka ? ' notif-pop--zamyka' : '')}
          role="menu"
          onAnimationEnd={onAnimEnd}
        >
          <div className="notif-pop-head">
            <Sprite name="dadsnote" size={18} />
            {t('spolecznosc.powiadomienia')}
            {unread > 0 && (
              <span className="notif-head-licznik">
                {t('spolecznosc.nowePowiadomienia', { liczba: unread })}
              </span>
            )}
          </div>

          {!zalogowany ? (
            <div className="notif-pop-foot">
              {/* Zdanie z linkiem w środku — jako HTML, bo szyk różni się między językami. */}
              <span
                className="muted small"
                dangerouslySetInnerHTML={{ __html: t('spolecznosc.powiadomieniaZaloguj') }}
              />
            </div>
          ) : notyfikacje.length === 0 ? (
            pobrane && (
              <PustyStan
                maly
                tekst={t('spolecznosc.powiadomieniaPusto')}
                poza={t('spolecznosc.powiadomieniaPustoPoza')}
              />
            )
          ) : (
            <>
              <ul className="notif-list">
                {notyfikacje.map((n) => {
                  const p = portret(n)
                  return (
                    <li
                      key={n.id}
                      className={'notif-item' + (czyNowe(n) ? ' notif-item--nowe' : '')}
                      role="menuitem"
                    >
                      <LinkGracza nick={n.autor} ja={n.ja} className="notif-ic-link">
                        <span className={'notif-ic notif-ic--' + n.typ}>
                          <img
                            src={p.src}
                            alt=""
                            aria-hidden
                            draggable={false}
                            className={p.wlasny ? 'notif-portret--wlasny' : undefined}
                          />
                          {/* Portret mówi KTO, znaczek w rogu CO zrobił. */}
                          <span className="notif-typ">
                            <Sprite name={IKONA[n.typ]} size={14} />
                          </span>
                        </span>
                      </LinkGracza>
                      <span className="notif-body">
                        <span className="notif-tekst">
                          {/* Własne zdarzenie leci w 2. osobie — bez doklejania własnego nicku. */}
                          {!n.ja && (
                            <>
                              <LinkGracza nick={n.autor}>
                                <b className="notif-autor">{n.autor}</b>
                              </LinkGracza>{' '}
                            </>
                          )}
                          {t(TEKST[n.typ])}
                          {n.detal && (
                            // Nazwy z gry zostają po angielsku w obu językach — stąd sam `detal`.
                            <>
                              {' '}
                              <b className="notif-detal" title={n.detal}>
                                {n.detal.length > DETAL_MAX
                                  ? n.detal.slice(0, DETAL_MAX).trimEnd() + '…'
                                  : n.detal}
                              </b>
                            </>
                          )}
                        </span>
                        <span className="notif-czas">{ileTemu(n.czas, t)}</span>
                      </span>
                      {czyNowe(n) && (
                        <span className="notif-kropka" aria-label={t('spolecznosc.nowe')} />
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="notif-pop-akcje">
                {unread > 0 && (
                  <button type="button" className="notif-akcja" onClick={oznaczPrzeczytane}>
                    {t('spolecznosc.powiadomieniaPrzeczytaj')}
                  </button>
                )}
                <Link href="/znajomi" className="notif-akcja notif-akcja--link" prefetch={false}>
                  {t('spolecznosc.powiadomieniaZnajomi')}
                </Link>
              </div>
            </>
          )}

          {zalogowany && (
            <div className="notif-pop-foot">
              <span className="notif-stempel">{t('spolecznosc.powiadomieniaStempel')}</span>
              {/* „Przeczytane" siedzi w localStorage, więc na innym urządzeniu licznik wraca. */}
              <span className="notif-stempel-opis">
                {t('spolecznosc.powiadomieniaTaPrzegladarka')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
