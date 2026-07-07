// apps/api — backend IsaacDex (zadanie 4: logika biznesowa na danych z bazy).
//
// Dwa przepływy „serca aplikacji", oba czytają/piszą do Postgresa przez Prisma
// (@isaacdex/db) i egzekwują reguły z @isaacdex/core:
//   1) Doradca itemów        GET  /advice?item=<nazwa>&boss=<BOSS>
//   2) Completion mark        POST /completion  {postac, boss, tryb, zaliczone}
//                             GET  /completion/<postac>

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { ocenItem, procentUkonczenia, sprawdzReguleHard, type Jakosc } from '@isaacdex/core'
import { prisma, BossKoncowy, TrybGry } from '@isaacdex/db'

const PORT = Number(process.env.PORT ?? 3000)

// ── pomocnicze ──────────────────────────────────────────────────────────────
function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data))
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>)
      } catch {
        reject(new Error('Nieprawidłowy JSON w treści żądania.'))
      }
    })
    req.on('error', reject)
  })
}

const BOSSY = new Set<string>(Object.values(BossKoncowy))
const TRYBY = new Set<string>(Object.values(TrybGry))

// Postęp completion marks. Wszystkie = postacie × bossy × 2 tryby.
async function policzPostep(profilId: number, postacId?: number) {
  const gdzie = postacId ? { profilId, postacId } : { profilId }
  const zaliczone = await prisma.completionMark.count({ where: { ...gdzie, zaliczone: true } })
  const wszystkie = postacId
    ? BOSSY.size * TRYBY.size
    : (await prisma.postac.count()) * BOSSY.size * TRYBY.size
  return { zaliczone, wszystkie, procent: procentUkonczenia(zaliczone, wszystkie) }
}

// ── serwer ──────────────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
    const seg = url.pathname.split('/').filter(Boolean)

    if (url.pathname === '/health') return json(res, 200, { status: 'ok' })

    // Lista itemów z katalogu.
    if (req.method === 'GET' && url.pathname === '/items') {
      const items = await prisma.item.findMany({
        orderBy: [{ jakosc: 'desc' }, { nazwa: 'asc' }],
        select: { nazwa: true, jakosc: true, typ: true, tagi: true },
      })
      return json(res, 200, items)
    }

    // PRZEPŁYW 1 — Doradca itemów. Waliduje istnienie itemu, stosuje reguły.
    if (req.method === 'GET' && url.pathname === '/advice') {
      const nazwa = (url.searchParams.get('item') ?? '').trim()
      if (!nazwa) return json(res, 400, { error: 'Podaj nazwę itemu: ?item=<nazwa>' })

      const item = await prisma.item.findUnique({ where: { nazwa } })
      if (!item) return json(res, 404, { error: `Nie znam itemu „${nazwa}".` })

      const boss = url.searchParams.get('boss') ?? undefined
      const ocena = ocenItem(
        { nazwa: item.nazwa, jakosc: item.jakosc as Jakosc, tagi: item.tagi },
        { przeciwBossowi: boss },
      )
      return json(res, 200, { item: item.nazwa, jakosc: item.jakosc, ...ocena })
    }

    // Postęp completion marks danej postaci.
    if (req.method === 'GET' && seg[0] === 'completion' && seg[1]) {
      const postac = await prisma.postac.findUnique({ where: { nazwa: decodeURIComponent(seg[1]) } })
      if (!postac) return json(res, 404, { error: 'Nie ma takiej postaci.' })
      const profil = await prisma.profil.findFirst()
      if (!profil) return json(res, 400, { error: 'Brak profilu — najpierw seed.' })
      const marks = await prisma.completionMark.findMany({
        where: { profilId: profil.id, postacId: postac.id, zaliczone: true },
        select: { boss: true, tryb: true, data: true },
      })
      const postep = await policzPostep(profil.id, postac.id)
      return json(res, 200, { postac: postac.nazwa, marki: marks, ...postep })
    }

    // PRZEPŁYW 2 — Zaznacz/odznacz completion mark (walidacja + reguła kolejności).
    if (req.method === 'POST' && url.pathname === '/completion') {
      const body = await readBody(req)
      const nazwaPostaci = String(body.postac ?? '').trim()
      const boss = String(body.boss ?? '')
      const tryb = String(body.tryb ?? '')
      const zaliczone = body.zaliczone !== false // domyślnie true

      // Walidacja WEJŚCIA zanim cokolwiek trafi do bazy.
      if (!nazwaPostaci) return json(res, 400, { error: 'Pole „postac" jest wymagane.' })
      if (!BOSSY.has(boss)) {
        return json(res, 400, { error: `Nieznany boss. Dozwolone: ${[...BOSSY].join(', ')}` })
      }
      if (!TRYBY.has(tryb)) {
        return json(res, 400, { error: `Nieznany tryb. Dozwolone: ${[...TRYBY].join(', ')}` })
      }

      const postac = await prisma.postac.findUnique({ where: { nazwa: nazwaPostaci } })
      if (!postac) return json(res, 404, { error: `Nie ma postaci „${nazwaPostaci}".` })
      const profil = await prisma.profil.findFirst()
      if (!profil) return json(res, 400, { error: 'Brak profilu — najpierw seed.' })

      // REGUŁA BIZNESOWA: HARD wymaga wcześniej zaliczonego NORMAL.
      if (zaliczone && tryb === TrybGry.HARD) {
        const normal = await prisma.completionMark.findUnique({
          where: {
            profilId_postacId_boss_tryb: {
              profilId: profil.id,
              postacId: postac.id,
              boss: boss as BossKoncowy,
              tryb: TrybGry.NORMAL,
            },
          },
        })
        const regula = sprawdzReguleHard('HARD', Boolean(normal?.zaliczone))
        if (!regula.ok) return json(res, 409, { error: regula.powod })
      }

      const mark = await prisma.completionMark.upsert({
        where: {
          profilId_postacId_boss_tryb: {
            profilId: profil.id,
            postacId: postac.id,
            boss: boss as BossKoncowy,
            tryb: tryb as TrybGry,
          },
        },
        update: { zaliczone, data: zaliczone ? new Date() : null },
        create: {
          profilId: profil.id,
          postacId: postac.id,
          boss: boss as BossKoncowy,
          tryb: tryb as TrybGry,
          zaliczone,
          data: zaliczone ? new Date() : null,
        },
      })

      const postep = await policzPostep(profil.id, postac.id)
      return json(res, 200, {
        zapisano: { postac: postac.nazwa, boss: mark.boss, tryb: mark.tryb, zaliczone: mark.zaliczone },
        postepPostaci: postep,
      })
    }

    return json(res, 404, { error: 'Nie znaleziono.' })
  } catch (e) {
    return json(res, 400, { error: e instanceof Error ? e.message : 'Błąd serwera.' })
  }
})

server.listen(PORT, () => {
  console.log(`🪽 IsaacDex API działa na http://localhost:${PORT}`)
})
