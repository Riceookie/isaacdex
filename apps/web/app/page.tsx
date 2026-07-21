import Link from 'next/link'
import { getProfil, getDashboard } from '@/lib/queries'
import { getFeed, getLicznikiSpoleczne } from '@/lib/social'
import { czyZalogowany, mojGracz } from '@/lib/konto'
import { getOnboarding } from '@/lib/onboarding'
import { policzOdznaki, tytulyDoPokazania } from '@/lib/odznaki'
import { ikonaPostaci } from '@/lib/chars'
import type { DecorId } from '@/lib/pfpDecor'
import { PUSTKA } from '@/lib/klimat'
import { tlumacz } from '@/lib/i18n/serwer'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import PierwszeKroki from '@/components/PierwszeKroki'
import FeedCard from '@/components/FeedCard'
import FeedMore from '@/components/FeedMore'
import BasementRadio from '@/components/BasementRadio'
import FeedZakres from '@/components/FeedZakres'
import PustyStan from '@/components/PustyStan'
import ZalogujStan from '@/components/ZalogujStan'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ feed?: string }>
}) {
  const t = tlumacz()
  const zakres = (await searchParams)?.feed === 'znajomi' ? 'znajomi' : 'global'
  const [zalogowany, p, feed, liczniki, ja, onboarding, dash] = await Promise.all([
    czyZalogowany(),
    getProfil(),
    getFeed(zakres),
    getLicznikiSpoleczne(),
    mojGracz(),
    getOnboarding(),
    getDashboard(),
  ])
  const gosc = !zalogowany

  // Tytuł pod nickiem = PRAWDZIWA odznaka policzona z danych (te same reguły co na profilu),
  // a nie wpisany na sztywno „Dead God". Keeper (z Sekretnego Pokoju) nie zależy od Steama, więc
  // liczymy odznaki, gdy jest Steam ALBO gdy gracz odkrył sekret — inaczej Keeper nie pokazałby
  // się na Pulpicie bez podpiętego konta.
  const sekretOdkryty = ja?.sekretOdkryty ?? false
  const odznaki =
    p || sekretOdkryty
      ? policzOdznaki({
          achProcent: p?.achProcent ?? 0,
          postacie: dash.postacie,
          obserwujacych: liczniki.obserwujacych,
          steamPodlaczony: !!p,
          sekretOdkryty,
          wlascicielWlasny: ja?.ja ?? false,
        })
      : []
  // Ten sam wybór, co pod nickiem na profilu: gracz może wskazać, który zdobyty tytuł jest pierwszy.
  const tytul = tytulyDoPokazania(odznaki, ja?.wybranyTytul)[0]

  // Feed globalny jest wspólny — pokazujemy go i gościowi. Personalna prawa szyna (profil,
  // postęp, najrzadsze) zależy od `p`: gość dostaje zamiast niej zaproszenie do logowania.

  // Feed jest teraz PRAWDZIWY: wpisy leżą w bazie (Twoje = z odblokowań Steam).
  const feedNodes = feed.slice(0, 6).map((w) => <FeedCard key={w.id} w={w} />)

  // Pusty feed znajomych zwykle znaczy „nie masz jeszcze znajomych", a nie „cisza w piwnicy" —
  // i wtedy jedyne sensowne wyjście prowadzi na Znajomych, nie do odświeżania Pulpitu.
  const brakZnajomych = zakres === 'znajomi' && liczniki.znajomi === 0

  return (
    <section className="home-grid">
      {/* ── GŁÓWNA KOLUMNA ── */}
      <div className="home-feed">
        <div className="feed-head">
          <h2>
            <Sprite name="friendfinder" size={26} /> {t('spolecznosc.coSlychac')}
          </h2>
          <Link className="small" href="/znajomi">
            {t('spolecznosc.wszyscyZnajomi')}
          </Link>
        </div>

        <FeedZakres zakres={zakres} />

        {feed.length === 0 ? (
          /* Pusty feed ma trzy różne przyczyny i każda ma inne wyjście. Kiedyś wszystkie
             prowadziły na „Zobacz feed globalny" — czyli tam, gdzie już jesteś. */
          <PustyStan
            tekst={
              brakZnajomych
                ? PUSTKA.brakZnajomych
                : gosc
                  ? PUSTKA.brakAktywnosciGosc
                  : PUSTKA.brakAktywnosci
            }
            akcja={
              brakZnajomych ? (
                <Link className="btn" href="/znajomi">
                  {t('spolecznosc.znajdzGraczy')}
                </Link>
              ) : gosc ? (
                <Link className="btn" href="/logowanie">
                  {t('spolecznosc.zalozKonto')}
                </Link>
              ) : (
                <Link className="btn" href="/kolekcja">
                  {t('spolecznosc.synchronizujSteam')}
                </Link>
              )
            }
            // Zdania z wplecionymi linkami trzymamy jako HTML w słowniku — inaczej trzeba
            // by je ciąć na kilka kluczy, a szyk zdania i tak różni się między językami.
            poza={
              <span
                dangerouslySetInnerHTML={{
                  __html: gosc ? t('spolecznosc.pulpitGoscPoza') : t('spolecznosc.pulpitPoza'),
                }}
              />
            }
          />
        ) : (
          <div className="feed">
            {feedNodes.slice(0, 3)}
            <FeedMore count={feedNodes.length - 3}>{feedNodes.slice(3)}</FeedMore>
          </div>
        )}
      </div>

      {/* ── PRAWA SZYNA ── */}
      <aside className="home-aside">
        {/* Świeże konto dostaje listę kroków zamiast pięciu osobnych „nic tu nie ma".
            Znika sama, gdy wszystko odhaczone. */}
        {onboarding?.pokazuj && <PierwszeKroki stan={onboarding} />}

        {p ? (
          <>
            {/* Profil mini z licznikami (Obserwujący/Obserwowani/Runy) */}
            <div className="note me-card pin-synced">
              <div className="me-head">
                <div className="avatar sm pfp-frame">
                  <ProfileAvatar
                    fallbackSrc={ikonaPostaci(p.ulubiona || ja?.avatar || 'Isaac')}
                    avatar={ja?.avatar}
                    dekoracja={(ja?.dekoracja ?? 'none') as DecorId}
                  />
                </div>
                <div className="me-id">
                  <h3>{ja?.nick ?? p.nick}</h3>
                  {/* Najwyższy zdobyty tytuł — albo nic, gdy gracz nie ma jeszcze żadnego.
                      Lepszy brak podpisu niż podpis nieprawdziwy. */}
                  {tytul && (
                    <span className="muted small" title={t(tytul.kluczOpisu, tytul.zmienne)}>
                      {tytul.postac ? (
                        <img src={ikonaPostaci(tytul.postac)} alt="" width={16} height={16} />
                      ) : (
                        tytul.sprite && <Sprite name={tytul.sprite} size={16} />
                      )}{' '}
                      {t(tytul.klucz, tytul.zmienne)}
                    </span>
                  )}
                </div>
              </div>
              {/* Skrót do sieci — te same liczby co u Znajomych, żeby Pulpit i Znajomi
                  mówili jednym głosem (a nie były dwiema osobnymi apkami). */}
              <div className="me-siec">
                <Link href="/znajomi">
                  <b>{liczniki.znajomi}</b>{' '}
                  {t('spolecznosc.licznikZnajomi', { liczba: liczniki.znajomi })}
                </Link>
                <Link href="/znajomi">
                  <b>{liczniki.obserwujacych}</b>{' '}
                  {t('spolecznosc.licznikObserwujacych', { liczba: liczniki.obserwujacych })}
                </Link>
              </div>
              <Link className="small" href="/profil">
                {t('spolecznosc.mojProfil')}
              </Link>
            </div>

            {/* Progress */}
            <div className="note">
              <div className="feed-head">
                <h3>{t('spolecznosc.postep')}</h3>
              </div>
              {/* Cel paska = 100% kolekcji, czyli ranga „Dead God" (żargon z gry, po angielsku
                  w obu językach) — przez klucz słownika, nie wpisany na sztywno. */}
              <p className="small muted">{t('profil.odznakaDeadGod')}</p>
              <div className="prog-row">
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
                </div>
                <b className="prog-pct">{p.achProcent}%</b>
              </div>
            </div>
          </>
        ) : gosc ? (
          // Gość: zamiast cudzego profilu — zaproszenie, ale z pokazaniem, co działa bez konta.
          <div className="note me-card">
            <ZalogujStan
              maly
              tekst={
                <span dangerouslySetInnerHTML={{ __html: t('spolecznosc.goscProfilTekst') }} />
              }
              cta={t('spolecznosc.zalozKonto')}
              poza={<span dangerouslySetInnerHTML={{ __html: t('spolecznosc.goscProfilPoza') }} />}
            />
          </div>
        ) : null}

        {/* Wyzwanie dnia (Basement Radio) — wspólne, widać je i bez konta. */}
        <BasementRadio />

        {/* Trending / najrzadsze */}
        {p && p.showcase.length > 0 && (
          <div className="note">
            <div className="feed-head">
              <h3>{t('spolecznosc.trendujace')}</h3>
              <Link className="paper-more" href="/statystyki">
                {t('spolecznosc.wszystkie')}
              </Link>
            </div>
            <ol className="trend-list">
              {p.showcase.slice(0, 3).map((a, i) => (
                <li key={a.nazwa}>
                  <span className="trend-rank">{i + 1}.</span>
                  {a.ikonaUrl && <img src={a.ikonaUrl} alt="" />}
                  <span className="grow">{a.nazwa}</span>
                  <b>{a.p}%</b>
                </li>
              ))}
            </ol>
          </div>
        )}
      </aside>
    </section>
  )
}
