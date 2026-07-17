import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  getGraczPoNicku,
  getObserwowanych,
  getObserwujacych,
  getZnajomychGracza,
} from '@/lib/social'
import { getKatalogAchievementow, getPostacie } from '@/lib/queries'
import { wlasnyAvatar } from '@/lib/chars'
import { dekoracjaGracza, statyGracza } from '@/lib/klimat'
import {
  demoPostacie,
  demoRecent,
  demoRuny,
  demoUlubionaPostac,
  demoUlubioneItemy,
} from '@/lib/demoProfil'
import ProfilWidok, { type DaneProfilu } from '@/components/ProfilWidok'
import PrzyciskObserwuj from '@/components/PrzyciskObserwuj'
import Sprite from '@/components/Sprite'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { nick: string } }) {
  const dane = await getGraczPoNicku(decodeURIComponent(params.nick))
  return { title: dane ? `${dane.gracz.nick} — IsaacDex` : 'Nie ma takiego gracza — IsaacDex' }
}

/**
 * Profil INNEGO gracza — ten sam bogaty układ co /profil (wspólny ProfilWidok), tylko bez
 * rzeczy, których nie da się zrobić cudzemu profilowi (edycja, podmiana avatara).
 * Własny nick przekierowuje na /profil, gdzie jest edycja i prawdziwy Steam.
 *
 * Skąd dane: nick, opis, avatar, relacja, liczniki i wpisy są PRAWDZIWE (baza).
 * Steama ma podpiętego tylko właściciel apki, więc achievementy, postępy postaci, runy
 * i ulubione itemy są dorabiane z nicku (lib/demoProfil) i oznaczone w UI jako DEMO.
 */
export default async function ProfilGracza({ params }: { params: { nick: string } }) {
  const nick = decodeURIComponent(params.nick)
  const dane = await getGraczPoNicku(nick)
  if (!dane) notFound()

  const { gracz: g, wpisy } = dane
  if (g.ja) redirect('/profil')

  const [znajomi, katalog, postacie, listaObserwujacych, listaObserwowanych] = await Promise.all([
    getZnajomychGracza(g.id),
    getKatalogAchievementow(),
    getPostacie(),
    getObserwujacych(g.id),
    getObserwowanych(g.id),
  ])

  const staty = statyGracza(g.nick)
  // Avatar to zwykle ikona postaci z gry („Azazel") — wtedy jest zarazem „mainem".
  // Gracz z własnym zdjęciem nie mówi nam nic o postaci, więc main losujemy z nicku.
  const ulubionaPostac = wlasnyAvatar(g.avatar)
    ? demoUlubionaPostac(g.nick, postacie)
    : (g.avatar ?? demoUlubionaPostac(g.nick, postacie))

  const d: DaneProfilu = {
    nick: g.nick,
    kolor: g.kolor,
    opis: g.opis ?? '',
    ulubionaPostac,
    achProcent: staty.procent,
    achUnlocked: Math.round((staty.procent / 100) * katalog.length),
    achTotal: katalog.length,
    recent: demoRecent(g.nick, katalog),
    postacie: demoPostacie(g.nick, postacie, staty.procent),
    runy: demoRuny(g.nick),
    obserwujacych: g.obserwujacych,
    // Ilu on obserwuje — z prawdziwej listy, a nie z liczby znajomych (to co innego:
    // znajomy = obserwacja odwzajemniona, więc licznik zaniżał się przy jednostronnych).
    obserwuje: listaObserwowanych.length,
    listaObserwujacych,
    listaObserwowanych,
    wpisy,
    znajomi,
    avatar: g.avatar,
    decor: dekoracjaGracza(g.nick, wlasnyAvatar(g.avatar)),
    meta: [
      { etykieta: 'GODZINY', wartosc: `${staty.godziny} h` },
      { etykieta: 'WPISY', wartosc: String(g.wpisy) },
      { etykieta: 'DEAD GOD', wartosc: staty.deadGod ? 'TAK' : 'JESZCZE NIE' },
    ],
    // Ten gracz nie ma podpiętego Steama — sekcje Steamowe są dorobione.
    steamDemo: true,
    // Cudzej gabloty nie mamy gdzie trzymać (localStorage jest MOJE), więc pierwsze
    // trzy z jego dorobionych ulubionych itemów — spójnie z sekcją „Ulubione itemy".
    gablota: demoUlubioneItemy(g.nick).slice(0, 3),
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
