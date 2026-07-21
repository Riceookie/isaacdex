import Link from 'next/link'
import Sprite from '@/components/Sprite'
import ZalogujStan from '@/components/ZalogujStan'
import SekretnyPokoj from '@/components/SekretnyPokoj'
import { mojGracz } from '@/lib/konto'
import { tlumacz } from '@/lib/i18n/serwer'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  // Nawet w tytule karty tylko „???" — sekret nie zdradza się w zakładce przeglądarki.
  return { title: tlumacz()('sekret.tab') }
}

/**
 * Sekretny Pokój — ekran za „zbombardowaną ścianą". Wchodzi się przez zataczone wejścia
 * (mały Keeper na górnym pasku, rysa na dole sidebara), a nie z menu. Trzy stany:
 *  - gość        → sekretów nie ma komu nadać, zaproszenie do logowania,
 *  - nieodkryty  → zagadka Keepera (sprawdza server action, patrz components/SekretnyPokoj),
 *  - odkryty     → ekran nagrody (tytuł „Keeper"), świeżo (?ok=1) głośniej niż przy powrocie.
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
      <div className={'sekret-room' + (odkryty ? ' odkryty' : '')}>
        <div className="sekret-keeper" aria-hidden>
          <Sprite name="keeper" size={76} />
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

        <Link className="sekret-wroc small muted" href="/">
          {t('sekret.wroc')}
        </Link>
      </div>
    </section>
  )
}
