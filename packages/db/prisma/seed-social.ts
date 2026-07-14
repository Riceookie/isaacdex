import { PrismaClient, TypWpisu } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Zasiew społeczności. „Ja" = gracz z flagą `ja` (nick z Profilu Steam) — jego wpisy
 * pochodzą z PRAWDZIWYCH achievementów (nazwa, ikona i data odblokowania ze Steama).
 * Pozostali gracze są demo (nie ma jeszcze logowania), ale relacje i wpisy leżą w bazie,
 * więc obserwowanie i lajki są trwałe.
 *
 * Znajomy = obserwacja w OBIE strony, więc zasiew musi zawierać też obserwacje zwrotne
 * (inaczej sekcja „Znajomi" byłaby zawsze pusta).
 */
const DEMO = [
  // Czterech graczy ma WŁASNE pfp (pliki w /public/pfp) zamiast głowy postaci — pole `avatar`
  // trzyma wtedy ścieżkę, a nie nazwę postaci (patrz avatarGracza w lib/chars).
  { nick: 'VoidKing', kolor: '#8a6fd6', avatar: '/pfp/spike.png', opis: 'Void albo nic.' },
  {
    nick: 'Lilith',
    kolor: '#b06ad6',
    avatar: '/pfp/apples.jpeg',
    opis: 'Incubus main, bez wstydu.',
  },
  { nick: 'Jorge', kolor: '#c98a4e', avatar: 'Samson', opis: 'Berserk do końca.' },
  { nick: 'Chomik', kolor: '#5fb4d8', avatar: '/pfp/thumbsup.png', opis: 'Dead God w 3 tygodnie.' },
  { nick: 'Mama', kolor: '#e5544b', avatar: 'Eve', opis: 'Zabijam Mamę w 4 minuty.' },
  { nick: 'Kostka', kolor: '#4ec98a', avatar: 'Eden', opis: 'Rerolluję wszystko.' },
  // ── Gracze do „Odkryj graczy" ──
  {
    nick: 'Sadza',
    kolor: '#c9c4d8',
    avatar: '/pfp/die.webp',
    opis: 'The Lost bez blindfolda? Nuda.',
  },
  { nick: 'Brimstone', kolor: '#7a5cc0', avatar: 'Azazel', opis: 'Brimstone albo restart.' },
  { nick: 'Grzesiek', kolor: '#d8b45f', avatar: 'Cain', opis: 'Speedrun. Mama poniżej 3 minut.' },
  { nick: 'Klucznik', kolor: '#9aa3ad', avatar: 'Keeper', opis: 'Zbieram monety, nie znajomych.' },
  { nick: 'Zapomniana', kolor: '#a8b6c2', avatar: 'The Forgotten', opis: 'Kość, łańcuch i tyle.' },
  { nick: 'Bracia', kolor: '#8fbf7a', avatar: 'Jacob & Esau', opis: 'Dwa razy więcej itemów.' },
  { nick: 'Wisp', kolor: '#e8d48a', avatar: 'Bethany', opis: 'Duszki do końca świata.' },
  {
    nick: 'Skazany',
    kolor: '#b85c5c',
    avatar: 'Tainted Judas',
    opis: 'Tainted only. Bez wyjątków.',
  },
]

const WPISY_DEMO: {
  nick: string
  typ: TypWpisu
  tresc: string
  postac?: string
  itemy?: string[]
}[] = [
  { nick: 'VoidKing', typ: 'BOSS', tresc: 'Delirium', postac: 'Apollyon' },
  {
    nick: 'Lilith',
    typ: 'RUN',
    tresc: 'Dead God run bez trafienia',
    postac: 'Lilith',
    itemy: ['Brimstone', 'Sacred Heart', 'Godhead'],
  },
  { nick: 'Jorge', typ: 'BOSS', tresc: 'Mother', postac: 'Samson' },
  { nick: 'Chomik', typ: 'TEKST', tresc: 'Kto ma pomysł na build z Tech X i Brimstone?' },
  {
    nick: 'Mama',
    typ: 'RUN',
    tresc: 'Boss Rush w 12 minut',
    postac: 'Eve',
    itemy: ['Polyphemus', "Mom's Knife"],
  },
  { nick: 'Kostka', typ: 'BOSS', tresc: 'The Beast', postac: 'Eden' },
  { nick: 'Sadza', typ: 'BOSS', tresc: 'Mega Satan', postac: 'The Lost' },
  {
    nick: 'Brimstone',
    typ: 'RUN',
    tresc: 'Azazel, same czerwone serca',
    postac: 'Azazel',
    itemy: ['Brimstone', 'Cricket’s Head'],
  },
  { nick: 'Grzesiek', typ: 'TEKST', tresc: 'Nowy PB na Mamie: 2:47. Kto pobije?' },
  {
    nick: 'Zapomniana',
    typ: 'RUN',
    tresc: 'Hush bez jednego trafienia',
    postac: 'The Forgotten',
    itemy: ['Sacred Heart', 'Number One'],
  },
  { nick: 'Bracia', typ: 'BOSS', tresc: 'The Beast', postac: 'Jacob & Esau' },
  { nick: 'Wisp', typ: 'TEKST', tresc: 'Bethany + Book of Virtues to najlepszy duet w grze.' },
  { nick: 'Skazany', typ: 'BOSS', tresc: 'Mother', postac: 'Tainted Judas' },
  { nick: 'Klucznik', typ: 'TEKST', tresc: 'Greed mode to najlepszy tryb. Nie zmieniam zdania.' },
]

/** Kto kogo obserwuje wśród graczy demo — żeby liczniki obserwujących nie były zerami. */
const OBSERWACJE_DEMO: [string, string][] = [
  ['Lilith', 'VoidKing'],
  ['Jorge', 'VoidKing'],
  ['Chomik', 'Lilith'],
  ['Mama', 'Lilith'],
  ['Kostka', 'Chomik'],
  ['Sadza', 'Brimstone'],
  ['Brimstone', 'Sadza'],
  ['Grzesiek', 'Mama'],
  ['Wisp', 'Lilith'],
  ['Skazany', 'Sadza'],
  ['Bracia', 'Grzesiek'],
  ['Zapomniana', 'Sadza'],
]

/** Kogo obserwujesz na start (odwzajemnieni z OBSERWUJA_MNIE stają się Znajomymi). */
const OBSERWUJE = ['VoidKing', 'Lilith', 'Chomik']

/** Kto obserwuje Ciebie. Część odwzajemnia (→ Znajomi), część nie (→ „Obserwują Cię"). */
const OBSERWUJA_MNIE = ['VoidKing', 'Chomik', 'Jorge', 'Mama', 'Sadza']

async function main() {
  const profil = await prisma.profil.findFirst()
  const mojNick = profil?.nick || 'Ty'

  // 1) Ja
  const ja = await prisma.gracz.upsert({
    where: { nick: mojNick },
    update: { ja: true },
    create: {
      nick: mojNick,
      ja: true,
      kolor: '#e0b64c',
      avatar: profil?.ulubionaPostac || 'Isaac',
      opis: profil?.opis || null,
    },
  })

  // 2) Gracze demo — nadpisujemy avatar/kolor/opis, żeby ponowny zasiew poprawiał dane,
  //    a nie tylko dodawał brakujących graczy.
  for (const g of DEMO) {
    await prisma.gracz.upsert({
      where: { nick: g.nick },
      update: { kolor: g.kolor, avatar: g.avatar, opis: g.opis },
      create: g,
    })
  }
  const gracze = await prisma.gracz.findMany()
  const wgNicku = new Map(gracze.map((g) => [g.nick, g]))

  // 3) Moje wpisy = prawdziwe odblokowania ze Steama (nazwa, ikona, data)
  if (profil) {
    const odblokowane = await prisma.steamAchievement.findMany({
      where: { profilId: profil.id, odblokowany: true, NOT: { dataOdblokowania: null } },
      orderBy: { dataOdblokowania: 'desc' },
      take: 12,
    })
    for (const a of odblokowane) {
      const juz = await prisma.wpis.findFirst({
        where: { autorId: ja.id, tresc: a.nazwa, typ: 'UNLOCK' },
      })
      if (juz) continue
      await prisma.wpis.create({
        data: {
          autorId: ja.id,
          typ: 'UNLOCK',
          tresc: a.nazwa,
          ikonaUrl: a.ikonaUrl,
          postac: profil.ulubionaPostac,
          createdAt: a.dataOdblokowania!,
        },
      })
    }
  }

  // 4) Wpisy graczy demo (rozrzucone w czasie, żeby feed miał sens)
  const teraz = Date.now()
  for (const [i, w] of WPISY_DEMO.entries()) {
    const autor = wgNicku.get(w.nick)
    if (!autor) continue
    const juz = await prisma.wpis.findFirst({ where: { autorId: autor.id, tresc: w.tresc } })
    if (juz) continue
    await prisma.wpis.create({
      data: {
        autorId: autor.id,
        typ: w.typ,
        tresc: w.tresc,
        postac: w.postac,
        itemy: w.itemy ?? [],
        createdAt: new Date(teraz - (i + 1) * 3.5 * 3600 * 1000),
      },
    })
  }

  // 5) Obserwacje: moje, zwrotne (→ Znajomi) i między graczami demo
  const obserwuj = async (odId: number, doId: number) => {
    if (odId === doId) return
    await prisma.obserwacja.upsert({
      where: { obserwujacyId_obserwowanyId: { obserwujacyId: odId, obserwowanyId: doId } },
      update: {},
      create: { obserwujacyId: odId, obserwowanyId: doId },
    })
  }

  for (const nick of OBSERWUJE) {
    const g = wgNicku.get(nick)
    if (g) await obserwuj(ja.id, g.id)
  }
  for (const nick of OBSERWUJA_MNIE) {
    const g = wgNicku.get(nick)
    if (g) await obserwuj(g.id, ja.id)
  }
  for (const [od, doKogo] of OBSERWACJE_DEMO) {
    const a = wgNicku.get(od)
    const b = wgNicku.get(doKogo)
    if (a && b) await obserwuj(a.id, b.id)
  }

  console.log(
    'graczy:',
    await prisma.gracz.count(),
    '| wpisów:',
    await prisma.wpis.count(),
    '| obserwacji:',
    await prisma.obserwacja.count(),
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
