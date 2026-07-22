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

/** Kilka monet unoszących się w blasku — czysta dekoracja (pozycje/animacje w CSS). */
function Monety() {
  return (
    <div className="sekret-monety" aria-hidden>
      {Array.from({ length: 7 }).map((_, i) => (
        <img key={i} className={`sekret-moneta m${i}`} src="/tboi/icons/coin.webp" alt="" />
      ))}
    </div>
  )
}

/** Drobinki kurzu unoszące się w świetle — miękka atmosfera piwnicy (pozycje/animacje w CSS). */
function Kurz() {
  return (
    <div className="sekret-kurz" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <i key={i} className={`sekret-pylek k${i}`} />
      ))}
    </div>
  )
}

/** Mały stos monet na kontuarze (kilka nakładających się sprite'ów pickupów). */
function StosMonet({ typy }: { typy: string[] }) {
  return (
    <span className="sekret-stos" aria-hidden>
      {typy.map((t, i) => (
        <img key={i} className={`sekret-stos-m s${i}`} src={`/tboi/pickupy/${t}.png`} alt="" />
      ))}
    </span>
  )
}

/**
 * Sekretny Pokój — ekran za „zbombardowaną ścianą". Wchodzi się przez zataczone wejścia
 * (mały Keeper na górnym pasku, rysa na dole sidebara), a nie z menu. Trzy stany:
 *  - gość        → sekretów nie ma komu nadać, zaproszenie do logowania,
 *  - nieodkryty  → zagadka Keepera (sprawdza server action, patrz components/SekretnyPokoj),
 *  - odkryty     → ekran nagrody (tytuł „Keeper"), świeżo (?ok=1) z dżinglem „secret found".
 *
 * Scena: Shopkeeper (przeszkoda-sklepikarz z Shopa, nie grywalny Keeper) stoi za kontuarem
 * w blasku monet — stosy bilonu na ladzie, sekretny towar na cokole, drobinki kurzu w świetle
 * i mamrotanie zza lady. Ciemny pokój z migoczącą poświatą i winietą; odkrycie rozświetla go
 * złotem (klasa `odkryty`), a Shopkeeper podnosi wzrok.
 */
export default async function SekretPage({
  searchParams,
}: {
  searchParams: { ok?: string; blad?: string }
}) {
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
        <Monety />
        <Kurz />

        {/* Wystawa sklepu: Shopkeeper (przeszkoda-sklepikarz, nie grywalny Keeper) za kontuarem,
            stosy monet i sekretny towar na cokole. Kontuar zasłania mu nogi — stoi „za ladą". */}
        <div className="sekret-scena">
          <div className="sekret-wystawa">
            <img
              className={'sekret-shopkeeper' + (odkryty ? ' patrzy' : '')}
              src="/tboi/sekret/shopkeeper.png"
              alt="Shopkeeper"
              width={28}
              height={34}
            />

            {/* Sekretny towar — nierozpoznawalny przedmiot na cokole z metką „??¢". */}
            <div className="sekret-oferta" aria-hidden title={t('sekret.ofertaTip')}>
              <span className="sekret-item">
                <span className="sekret-item-glow" />
                <span className="sekret-item-znak">?</span>
              </span>
              <img className="sekret-cokol" src="/tboi/ui/pedestal.png" alt="" />
              <span className="sekret-cena">{t('sekret.cena')}</span>
            </div>

            {/* Kontuar (rysowany w CSS) — na nim stosy monet, za nim Shopkeeper. */}
            <div className="sekret-lada" aria-hidden>
              <StosMonet typy={['penny', 'nickel', 'penny']} />
              <StosMonet typy={['golden-penny', 'penny']} />
            </div>
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
            <h2>{t(swiezo ? 'sekret.sukcesNaglowek' : 'sekret.powrotNaglowek')}</h2>
            <p className="sekret-lore">{t(swiezo ? 'sekret.sukcesOpis' : 'sekret.powrotOpis')}</p>

            <div className="sekret-nagroda">
              <span className="small muted">{t('sekret.nagroda')}</span>
              <span className="pf-odznaka zloto sekret-tytul">
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
          <SekretnyPokoj blad={searchParams.blad === '1'} />
        )}

        {/* Mamrotanie zza kontuaru — trzy szepty przewijają się w tle, jeden po drugim. */}
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
