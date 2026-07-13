import EncLista from '@/components/EncLista'
import { getDashboard, getOdblokowaneAchievementy } from '@/lib/queries'
import { MARK_NA_POSTAC } from '@/lib/queries'
import { ikonaPostaci, jestTainted } from '@/lib/chars'
import { danePostaci, opisZdrowia, opisZnajdziek } from '@/lib/enc/postacieDane'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'

export const dynamic = 'force-dynamic'

const FILTRY: EncFiltr[] = [
  { id: 'bazowe', label: 'Bazowe' },
  { id: 'tainted', label: 'Splugawione' },
]

/**
 * Sekcja „Postacie": 34 postacie z danymi z gry (zdrowie, znajdźki, itemy startowe,
 * birthright), opisem i warunkiem odblokowania z wiki oraz TWOIM postępem completion marks.
 *
 * Uwaga: marki postaci splugawionych nie są achievementami Steam, więc dla nich postępu
 * nie ma — pokazujemy to wprost, zamiast mylącego 0%.
 */
export default async function PostaciePage() {
  const [dash, odblokowane] = await Promise.all([getDashboard(), getOdblokowaneAchievementy()])
  const postep = new Map(dash.postacie.map((p) => [p.nazwa, p]))

  const wpisy: EncWpis[] = dash.postacie
    .slice()
    .sort((a, b) => a.nazwa.localeCompare(b.nazwa))
    .map((p) => {
      const d = danePostaci(p.nazwa)
      const tainted = jestTainted(p.nazwa)
      const marki = postep.get(p.nazwa)
      const znajdzki = d ? opisZnajdziek(d) : null

      const pola = [
        ...(d ? [{ label: 'Zdrowie', wartosc: opisZdrowia(d.hp) }] : []),
        ...(znajdzki ? [{ label: 'Na start', wartosc: znajdzki }] : []),
        {
          label: 'Twoje marki',
          wartosc: tainted
            ? 'brak danych ze Steama'
            : `${marki?.zaliczone ?? 0} / ${MARK_NA_POSTAC} (${marki?.procent ?? 0}%)`,
        },
      ]

      // Kolor krawędzi karty wg postępu — od razu widać, gdzie masz komplet marek.
      const klasa = tainted
        ? 'postac tainted'
        : p.procent === 100
          ? 'postac q4'
          : p.procent >= 50
            ? 'postac q3'
            : p.procent > 0
              ? 'postac q1'
              : 'postac q0'

      return {
        id: p.nazwa,
        nazwa: p.nazwa,
        ikona: ikonaPostaci(p.nazwa),
        // Splugawione nie mają marek w Steamie, więc odznaka z procentem byłaby kłamstwem.
        odznaka: tainted ? undefined : `${p.procent}%`,
        klasa,
        opis: d?.birthright ?? (tainted ? 'postać splugawiona' : 'postać'),
        grupy: [tainted ? 'tainted' : 'bazowe'],
        waga: tainted ? -1 : p.procent,
        szczegoly: {
          // Birthright jest „mottem" postaci — czytelniej jako cytat pod nazwą niż w tabelce.
          cytat: d?.birthright ?? undefined,
          znaczniki: [
            tainted ? 'splugawiona' : 'bazowa',
            ...(tainted ? [] : [`${p.procent}% marek`]),
          ],
          pola,
          itemy: d?.itemy.map((i) => ({ idW: i.id, nazwa: i.nazwa })),
          pelnyOpis: d?.opis ?? undefined,
          odblokowanie: d?.achievement
            ? {
                nazwa: d.achievement,
                warunek: d.warunek ?? undefined,
                zdobyte: odblokowane.has(d.achievement),
              }
            : undefined,
        },
      }
    })

  return (
    <EncLista
      wpisy={wpisy}
      filtry={FILTRY}
      sortWaga="Postęp"
      placeholder="Szukaj postaci…"
      wstep="Kliknij postać, żeby zobaczyć szczegóły i swój postęp."
    />
  )
}
