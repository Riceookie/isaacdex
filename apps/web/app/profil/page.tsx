import { getProfil, getDashboard, getItemyDoGabloty, getItemyPoNazwach } from '@/lib/queries'
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
import { jezykSerwera, tlumacz } from '@/lib/i18n/serwer'

export const dynamic = 'force-dynamic'

export default async function ProfilPage() {
  const t = tlumacz()

  // Gość nie ma profilu — zamiast cudzych osiągnięć widzi zaproszenie do założenia konta.
  if (!(await czyZalogowany())) {
    return (
      <section className="pf-page">
        <div className="note gosc-panel">
          <ZalogujStan
            tekst={
              <>
                <b>{t('profil.goscTytul')}</b> {t('profil.goscOpis')}
              </>
            }
            cta={t('profil.goscCta')}
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
  // Jakość wystawionych itemów — pedestały kolorują cokół tą samą skalą co Encyklopedia.
  const gablotaMeta = await getItemyPoNazwach(ja?.gablota ?? [])

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

  // Data dołączenia w formacie języka interfejsu („mar 2021" / „Mar 2021").
  const locale = jezykSerwera() === 'pl' ? 'pl-PL' : 'en-GB'
  const dolaczyl = ja?.dolaczyl
    ? new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(ja.dolaczyl)
    : '—'

  const dane: DaneProfilu = {
    // Nick i opis z KONTA (Gracz) jako źródło prawdy — te same, co w TopBarze i feedzie.
    // Profil.* (Steam) tylko jako awaryjny fallback, nigdy przebijając konto.
    nick: ja?.nick ?? p?.nick ?? t('profil.graczDomyslny'),
    opis: ja?.opis ?? p?.opis ?? '',
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
      { etykieta: t('profil.metaCzlonekOd'), wartosc: dolaczyl },
      { etykieta: t('profil.metaRegion'), wartosc: t('profil.metaRegionEuropa') },
      {
        etykieta: t('profil.metaAchievementy'),
        wartosc: steamPodlaczony ? `${p!.achUnlocked}/${p!.achTotal}` : t('profil.metaBezSteama'),
      },
    ],
    steamPodlaczony,
    sekretOdkryty: ja?.sekretOdkryty ?? false,
    // To MÓJ profil (wlasny) — jeśli jestem właścicielem apki, wchodzi tytuł właściciela.
    wlascicielWlasny: ja?.ja ?? false,
    wybranyTytul: ja?.wybranyTytul ?? null,
    avatar: ja?.avatar,
    decor: (ja?.dekoracja ?? 'none') as DecorId,
    gablota: ja?.gablota ?? [],
    gablotaMeta,
    itemyDoWyboru,
  }

  return <ProfilWidok d={dane} wlasny />
}
