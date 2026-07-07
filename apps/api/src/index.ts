// apps/api — aplikacja Node (backend IsaacDex).
//
// Zadanie 2/3 (fundament): minimalny serwer HTTP, który UŻYWA pakietu @isaacdex/core
// z tego samego monorepo. W kolejnych zadaniach dojdą: Prisma (@isaacdex/db), sync ze
// Steam Web API i realne endpointy (achievementy, completion marks, doradca itemów).

import { createServer } from 'node:http'
import { ocenItem, procentUkonczenia, type Jakosc } from '@isaacdex/core'

const PORT = Number(process.env.PORT ?? 3000)

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)

  if (url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  // Demo: postęp odblokowań achievementów TBOI (przykładowe liczby).
  if (url.pathname === '/demo/postep') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ odblokowane: 420, wszystkie: 641, procent: procentUkonczenia(420, 641) }))
    return
  }

  // Demo: doradca itemów — GET /demo/item?jakosc=4
  if (url.pathname === '/demo/item') {
    const jakosc = Number(url.searchParams.get('jakosc') ?? 4) as Jakosc
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ jakosc, ...ocenItem(jakosc) }))
    return
  }

  res.writeHead(404, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ error: 'Nie znaleziono' }))
})

server.listen(PORT, () => {
  console.log(`🪽 IsaacDex API działa na http://localhost:${PORT}`)
  console.log(`   Postęp: ${procentUkonczenia(420, 641)}%  ·  Item Q4: ${ocenItem(4).rekomendacja}`)
})
