import Link from 'next/link'
import { getProfil, getDashboard, getItemyDoGabloty } from '@/lib/queries'
import {
  getAktywnosc,
  getGracze,
  getLicznikiSpoleczne,
  getObserwowanych,
  getObserwujacych,
} from '@/lib/social'
import ProfilWidok, { type DaneProfilu } from '@/components/ProfilWidok'
import PustyStan from '@/components/PustyStan'
import ZalogujStan from '@/components/ZalogujStan'
import { czyZalogowany, mojGracz } from '@/lib/konto'
import { demoRuny } from '@/lib/demoProfil'

export const dynamic = 'force-dynamic'

export default async function ProfilPage() {
  // Gość nie ma profilu — zamiast cudzych osiągnięć widzi zaproszenie do założenia konta.
  if (!(await czyZalogowany())) {
    return (
      <section className="pf-page">
        <div className="note gosc-panel">
          <ZalogujStan
            tekst={
              <>
                <b>Nawet Isaac musiał gdzieś zacząć.</b> Załóż konto, podłącz Steam i zdobądź własne
                Dead God, completion marks i najrzadsze achievementy — zamiast oglądać cudze.
              </>
            }
            cta="Zacznij swoją drogę"
          />
        </div>
      </section>
    )
  }

  const [p, dash, liczniki, aktywnosc, gracze, itemyDoWyboru, ja] = await Promise.all([
    getProfil(),
    getDashboard(),
    getLicznikiSpoleczne(),
    getAktywnosc(),
    getGracze(),
    getItemyDoGabloty(),
    mojGracz(),
  ])
  // Listy pod klikalne liczniki — prawdziwe relacje z tabeli Obserwacja.
  const [listaObserwujacych, listaObserwowanych] = ja
    ? await Promise.all([getObserwujacych(ja.id), getObserwowanych(ja.id)])
    : [[], []]
  const znajomi = gracze.filter((g) => g.znajomy)
  if (!p) {
    return (
      <section className="pf-page">
        <div className="note gosc-panel">
          <PustyStan
            tekst={
              <>
                <b>Profil świeci pustkami.</b> Podłącz swojego Steama, a osiągnięcia i completion
                marks same tu spłyną.
              </>
            }
            akcja={
              <Link className="btn" href="/kim-jestem">
                Podłącz Steam
              </Link>
            }
          />
        </div>
      </section>
    )
  }

  // '' = świadome „Brak" z edytora → zostaje puste. null = nigdy nie ustawiono → podpowiadamy
  // najczęściej graną postacią ze Steama (`fav`), a w ostateczności Isaakiem.
  const ulubionaPostac = p.ulubiona === '' ? '' : (p.ulubiona ?? p.fav?.nazwa ?? 'Isaac')

  // Runy są nadal DEMO (Steam ich nie udostępnia) — ale generowane z nicku, więc mój
  // profil nie pokazuje tych samych czterech runów co cudze.
  const dane: DaneProfilu = {
    nick: p.nick,
    opis: p.opis,
    ulubionaPostac,
    achProcent: p.achProcent,
    achUnlocked: p.achUnlocked,
    achTotal: p.achTotal,
    recent: p.recent,
    postacie: dash.postacie,
    runy: demoRuny(p.nick),
    obserwujacych: liczniki.obserwujacych,
    obserwuje: liczniki.obserwuje,
    listaObserwujacych,
    listaObserwowanych,
    wpisy: aktywnosc,
    znajomi,
    meta: [
      { etykieta: 'CZŁONEK OD', wartosc: 'Sty 2023' },
      { etykieta: 'REGION', wartosc: 'Europa' },
      { etykieta: 'ACHIEVEMENTY', wartosc: `${p.achUnlocked}/${p.achTotal}` },
    ],
    // Mój profil ma prawdziwego Steama — achievementy i postacie NIE są dorobione.
    steamDemo: false,
    // Moja gablota siedzi w localStorage — Gablota czyta ją sama (jak ProfileAvatar).
    itemyDoWyboru,
  }

  return <ProfilWidok d={dane} wlasny />
}
