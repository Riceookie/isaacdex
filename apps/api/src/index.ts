// apps/api — aplikacja Node (backend PizzaFlow).
//
// Zadanie 2 (fundament): minimalny serwer HTTP, który UŻYWA pakietu @pizzaflow/core
// z tego samego monorepo. To dowód, że warstwy są poprawnie połączone (workspace +
// TypeScript + Turbo). W kolejnych zadaniach dojdzie Prisma (@pizzaflow/db) i realne
// endpointy zamówień.

import { createServer } from 'node:http'
import { wyliczSume, formatPLN, type PozycjaKoszyka } from '@pizzaflow/core'

const PORT = Number(process.env.PORT ?? 3000)

// Przykładowy koszyk — pokazuje wycenę liczoną przez pakiet core.
const koszyk: PozycjaKoszyka[] = [
  { nazwa: 'Margherita', cena: 28, ilosc: 2 },
  { nazwa: 'Cola 0.5l', cena: 8, ilosc: 3 },
]

const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (req.url === '/demo') {
    const suma = wyliczSume(koszyk)
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ koszyk, suma, sumaFormatowana: formatPLN(suma) }))
    return
  }

  res.writeHead(404, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ error: 'Nie znaleziono' }))
})

server.listen(PORT, () => {
  console.log(`🍕 PizzaFlow API działa na http://localhost:${PORT}`)
  console.log(`   Demo wyceny koszyka: ${formatPLN(wyliczSume(koszyk))}  (GET /demo)`)
})
