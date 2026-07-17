import { getProfil, getDashboard, getItemyDoGabloty } from '@/lib/queries'
import {
  getAktywnosc,
  getGracze,
  getLicznikiSpoleczne,
  getObserwowanych,
  getObserwujacych,
} from '@/lib/social'
import ProfilWidok, { type DaneProfilu } from '@/components/ProfilWidok'
import ZalogujStan from '@/components/ZalogujStan'
import { czyZalogowany, mojGracz } from '@/lib/konto'
import { wlasnyAvatar } from '@/lib/chars'
import type { DecorId } from '@/lib/pfpDecor'

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

  /**
   * Steam bywa niepodpięty (`p` === null) i to NIE znaczy, że nie ma czego pokazać:
   * nick, opis, avatar, ulubiona postać i znajomi są w naszej bazie, odkąd założyłeś konto.
   * Kiedyś cały profil zastępowała wtedy jedna zachęta „Podłącz Steam" — przez co własny
   * profil był pustszy niż profil obcego gracza, któremu dane dorabiamy z nicku.
   * Teraz tożsamość jest zawsze, a za Steamem chowa się tylko to, co z niego pochodzi.
   */
  const steamPodlaczony = !!p

  // '' = świadome „Brak" z edytora → zostaje puste. null = nigdy nie ustawiono → podpowiadamy
  // postacią z avatara, potem najczęściej graną ze Steama (`fav`), a w ostateczności Isaakiem.
  // `avatar` bywa WGRANYM ZDJĘCIEM (ścieżka/URL), a nie nazwą postaci — takiego nie da się
  // podać do `pelnaPostaci()`, więc bierzemy go tylko wtedy, gdy jest nazwą z gry.
  const zAvatara = wlasnyAvatar(ja?.avatar) ? null : (ja?.avatar ?? null)
  const wybrana = p?.ulubiona ?? zAvatara
  const ulubionaPostac = wybrana === '' ? '' : (wybrana ?? p?.fav?.nazwa ?? 'Isaac')

  const dolaczyl = ja?.dolaczyl
    ? new Intl.DateTimeFormat('pl-PL', { month: 'short', year: 'numeric' }).format(ja.dolaczyl)
    : '—'

  const dane: DaneProfilu = {
    nick: p?.nick ?? ja?.nick ?? 'Gracz',
    opis: p?.opis ?? ja?.opis ?? '',
    ulubionaPostac,
    achProcent: p?.achProcent ?? 0,
    achUnlocked: p?.achUnlocked ?? 0,
    achTotal: p?.achTotal ?? 0,
    recent: p?.recent ?? [],
    postacie: dash.postacie,
    obserwujacych: liczniki.obserwujacych,
    obserwuje: liczniki.obserwuje,
    listaObserwujacych,
    listaObserwowanych,
    wpisy: aktywnosc,
    znajomi,
    meta: [
      { etykieta: 'CZŁONEK OD', wartosc: dolaczyl },
      { etykieta: 'REGION', wartosc: 'Europa' },
      {
        etykieta: 'ACHIEVEMENTY',
        wartosc: steamPodlaczony ? `${p!.achUnlocked}/${p!.achTotal}` : 'bez Steama',
      },
    ],
    steamPodlaczony,
    avatar: ja?.avatar,
    decor: (ja?.dekoracja ?? 'none') as DecorId,
    gablota: ja?.gablota ?? [],
    itemyDoWyboru,
  }

  return <ProfilWidok d={dane} wlasny />
}
