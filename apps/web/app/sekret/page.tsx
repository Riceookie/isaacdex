import Link from 'next/link'
import Sprite from '@/components/Sprite'
import ZalogujStan from '@/components/ZalogujStan'
import SekretnyPokoj from '@/components/SekretnyPokoj'
import SekretMuzyka from '@/components/SekretMuzyka'
import SekretSukcesDzwiek from '@/components/SekretSukcesDzwiek'
import { mojGracz } from '@/lib/konto'
import { tlumacz } from '@/lib/i18n/serwer'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  // Nawet w tytule karty tylko „???" — sekret nie zdradza się w zakładce przeglądarki.
  return { title: tlumacz()('sekret.tab') }
}

/** Drobinki kurzu unoszące się w świetle — miękka atmosfera piwnicy (pozycje/animacje w CSS). */
function Kurz() {
  return (
    <div className="sekret-kurz" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <i key={i} className={`sekret-pylek k${i}`} />
      ))}
    </div>
  )
}

/** Iskry — drobne złote punkty wzbijające się z mroku (nie monety: bardziej „energia" niż kasa). */
function Iskry() {
  return (
    <div className="sekret-iskry" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <i key={i} className={`sekret-iskra i${i}`} />
      ))}
    </div>
  )
}

/**
 * Krąg run wokół postaci — arkaniczna pieczęć: dwa okręgi, pierścień „ticków" i osiem run
 * Algiz obróconych w mandalę. Jedna runa w `<defs>`, powielona `<use>`. Kolory/obrót/blask w CSS
 * (`stroke: currentColor` dziedziczy do klonów), a `.odkryty` rozpala krąg na złoto.
 */
function KragRun() {
  return (
    <div className="sekret-krag" aria-hidden>
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="sk-runa" d="M100 52 L100 30 M100 37 L92 29 M100 37 L108 29" />
        </defs>
        <circle cx="100" cy="100" r="90" className="sk-obwod" />
        <circle cx="100" cy="100" r="76" className="sk-ticki" />
        <circle cx="100" cy="100" r="46" className="sk-obwod" />
        {Array.from({ length: 8 }).map((_, i) => (
          <use key={i} href="#sk-runa" transform={`rotate(${i * 45} 100 100)`} />
        ))}
      </svg>
    </div>
  )
}

/**
 * Sekretny Pokój — ekran za „zbombardowaną ścianą". Wchodzi się przez zataczone wejścia
 * (mały Keeper na górnym pasku, rysa na dole sidebara), a nie z menu. Trzy stany:
 *  - gość        → sekretów nie ma komu nadać, zaproszenie do logowania,
 *  - nieodkryty  → rytuał: 3 zagadki + 2 mini-gry (patrz components/SekretnyPokoj; serwer sprawdza zagadki),
 *  - odkryty     → ekran nagrody (tytuł „Keeper"), świeżo (?ok=1) z dżinglem „secret found".
 *
 * Scena: NIE ma już sklepu. Shopkeeper (przeszkoda-sklepikarz z Shopa, nie grywalny Keeper)
 * wisi w ciemności, otoczony powoli obracającym się kręgiem run, z aurą pod spodem; z mroku
 * wzbijają się iskry i kurz, a z ciemności dochodzi szept. Odkrycie rozpala krąg i pokój na
 * złoto (klasa `odkryty`), a Shopkeeper „podnosi wzrok".
 */
export default async function SekretPage({ searchParams }: { searchParams: { ok?: string } }) {
  const t = tlumacz()
  const ja = await mojGracz()
  const swiezo = searchParams.ok === '1'
  const odkryty = (ja?.sekretOdkryty ?? false) || swiezo

  return (
    <section className="sekret-page">
      {/* Motyw Sekretnego Pokoju leci, dopóki tu jesteś (cichnie przy wyjściu). */}
      <SekretMuzyka />
      {/* Świeże odkrycie (?ok=1) — jednorazowy dżingiel „secret found". */}
      {swiezo && ja && <SekretSukcesDzwiek />}
      <div className={'sekret-room' + (odkryty ? ' odkryty' : '')}>
        <div className="sekret-poswiata" aria-hidden />
        <div className="sekret-vignette" aria-hidden />
        <Iskry />
        <Kurz />

        {/* Scena: Shopkeeper wiszący w mroku w kręgu run (nie za kontuarem). */}
        <div className="sekret-scena">
          <KragRun />
          <span className="sekret-aura" aria-hidden />
          <div className="sekret-shopkeeper-wrap">
            <img
              className={'sekret-shopkeeper' + (odkryty ? ' patrzy' : '')}
              src="/tboi/sekret/shopkeeper.png"
              alt="Shopkeeper"
              width={28}
              height={34}
            />
          </div>
        </div>

        <h1 className="sekret-title">{t('sekret.naglowek')}</h1>

        {!ja ? (
          <div className="sekret-panel">
            <ZalogujStan
              tekst={
                <>
                  <b>{t('sekret.goscNaglowek')}</b> {t('sekret.goscOpis')}
                </>
              }
              cta={t('wspolne.zaloguj')}
            />
          </div>
        ) : odkryty ? (
          <div className="sekret-panel sekret-sukces">
            {swiezo && <span className="sekret-sukces-aureola" aria-hidden />}
            <h2>{t(swiezo ? 'sekret.sukcesNaglowek' : 'sekret.powrotNaglowek')}</h2>
            <p className="sekret-lore">{t(swiezo ? 'sekret.sukcesOpis' : 'sekret.powrotOpis')}</p>

            <div className="sekret-nagroda">
              <span className="small muted">{t('sekret.nagroda')}</span>
              <span className={'pf-odznaka zloto sekret-tytul' + (swiezo ? ' sekret-tytul-in' : '')}>
                <Sprite name="keeper" size={14} />
                <span>{t('sekret.nagrodaTytul')}</span>
              </span>
            </div>

            {swiezo && <p className="small muted">{t('sekret.nagrodaOpis')}</p>}
            <Link className="btn" href="/kim-jestem">
              <Sprite name="pencil" size={16} /> {t('sekret.doEdytora')}
            </Link>
          </div>
        ) : (
          <SekretnyPokoj />
        )}

        {/* Mamrotanie z ciemności — trzy szepty przewijają się w tle, jeden po drugim. */}
        <div className="sekret-szepty" aria-hidden>
          <span className="sekret-szept sz0">{t('sekret.szept1')}</span>
          <span className="sekret-szept sz1">{t('sekret.szept2')}</span>
          <span className="sekret-szept sz2">{t('sekret.szept3')}</span>
        </div>

        <Link className="sekret-wroc small muted" href="/">
          {t('sekret.wroc')}
        </Link>
      </div>
    </section>
  )
}
