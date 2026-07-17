import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  getGraczPoNicku,
  getObserwowanych,
  getObserwujacych,
  getZnajomychGracza,
} from '@/lib/social'
import { getSteamGracza } from '@/lib/queries'
import { wlasnyAvatar } from '@/lib/chars'
import ProfilWidok, { type DaneProfilu } from '@/components/ProfilWidok'
import PrzyciskObserwuj from '@/components/PrzyciskObserwuj'
import Sprite from '@/components/Sprite'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { nick: string } }) {
  const dane = await getGraczPoNicku(decodeURIComponent(params.nick))
  return { title: dane ? `${dane.gracz.nick} — IsaacDex` : 'Nie ma takiego gracza — IsaacDex' }
}

/**
 * Profil INNEGO gracza — ten sam układ co /profil (wspólny ProfilWidok), bez rzeczy, których
 * nie da się zrobić cudzemu profilowi (edycja, podmiana avatara). Własny nick przekierowuje
 * na /profil.
 *
 * Wszystko tu jest PRAWDZIWE. Kiedyś achievementy, postępy postaci, godziny i runy były
 * wyliczane z hasza nicku i oznaczane znaczkiem DEMO — profil obcego wyglądał przez to
 * bogaciej niż własny, a żadna z tych liczb nic nie znaczyła. Teraz: ma podpiętego Steama —
 * widać jego rzeczywisty postęp; nie ma — sekcji z gry po prostu nie ma.
 */
export default async function ProfilGracza({ params }: { params: { nick: string } }) {
  const nick = decodeURIComponent(params.nick)
  const dane = await getGraczPoNicku(nick)
  if (!dane) notFound()

  const { gracz: g, wpisy } = dane
  if (g.ja) redirect('/profil')

  const [znajomi, listaObserwujacych, listaObserwowanych, steam] = await Promise.all([
    getZnajomychGracza(g.id),
    getObserwujacych(g.id),
    getObserwowanych(g.id),
    getSteamGracza(g.profilId),
  ])

  // Avatar to zwykle ikona postaci z gry („Azazel") — wtedy jest zarazem „mainem". Gracz
  // z własnym zdjęciem nie mówi nam nic o postaci, więc pytamy Steam o najczęściej ogrywaną;
  // bez Steama zostaje pusto (cokół bez postaci), zamiast zgadywać.
  const ulubionaPostac = wlasnyAvatar(g.avatar)
    ? (steam?.fav ?? '')
    : (g.avatar ?? steam?.fav ?? '')

  const dolaczyl = new Intl.DateTimeFormat('pl-PL', { month: 'short', year: 'numeric' }).format(
    g.dolaczyl,
  )

  const d: DaneProfilu = {
    steamPodlaczony: steam !== null,
    nick: g.nick,
    kolor: g.kolor,
    opis: g.opis ?? '',
    ulubionaPostac,
    achProcent: steam?.achProcent ?? 0,
    achUnlocked: steam?.achUnlocked ?? 0,
    achTotal: steam?.achTotal ?? 0,
    recent: steam?.recent ?? [],
    postacie: steam?.postacie ?? [],
    obserwujacych: g.obserwujacych,
    // Ilu on obserwuje — z prawdziwej listy, a nie z liczby znajomych (to co innego:
    // znajomy = obserwacja odwzajemniona, więc licznik zaniżał się przy jednostronnych).
    obserwuje: listaObserwowanych.length,
    listaObserwujacych,
    listaObserwowanych,
    wpisy,
    znajomi,
    avatar: g.avatar,
    decor: g.dekoracja,
    meta: [
      { etykieta: 'CZŁONEK OD', wartosc: dolaczyl },
      { etykieta: 'WPISY', wartosc: String(g.wpisy) },
      {
        etykieta: 'ACHIEVEMENTY',
        wartosc: steam ? `${steam.achUnlocked}/${steam.achTotal}` : 'bez Steama',
      },
    ],
    gablota: g.gablota,
  }

  return (
    <>
      <p className="small gracz-wroc">
        <Link href="/znajomi">← Znajomi</Link>
      </p>
      <ProfilWidok
        d={d}
        wlasny={false}
        akcje={
          <>
            {g.znajomy && (
              <span className="rel-badge friend">
                <Sprite name="friends" size={13} /> Znajomy
              </span>
            )}
            {!g.znajomy && g.obserwujeMnie && <span className="rel-badge back">Obserwuje Cię</span>}
            <PrzyciskObserwuj
              graczId={g.id}
              obserwowany={g.obserwowany}
              obserwujeMnie={g.obserwujeMnie}
            />
          </>
        }
      />
    </>
  )
}
