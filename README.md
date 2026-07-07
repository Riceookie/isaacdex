# 🍕 PizzaFlow

System zamówień i zarządzania kuchnią dla pizzerii / food trucka.
Aplikacja biznesowa budowana w **monorepo** (Turborepo) — krok po kroku przez tor stażowy.

📄 Pełna specyfikacja: [`docs/specyfikacja.md`](docs/specyfikacja.md)

## Struktura (monorepo)

```
pizzaflow/
├─ apps/
│  └─ api/          # aplikacja Node (backend) — używa @pizzaflow/core
├─ packages/
│  ├─ core/         # logika biznesowa (wycena, później: statusy, magazyn)
│  └─ db/           # warstwa danych — Prisma dojdzie w zadaniu 3
├─ turbo.json       # orkiestracja zadań (build / dev / typecheck)
├─ tsconfig.base.json
└─ pnpm-workspace.yaml
```

## Stack (fundament — zadanie 2)

- **TypeScript** + **Node.js** (runtime), **tsx** (uruchamianie TS bez kompilacji)
- **Turborepo** — orkiestracja i cache buildów
- **pnpm workspaces** — wiele paczek w jednym repo

Kolejne warstwy dochodzą w następnych zadaniach: PostgreSQL + Prisma (3), logika
biznesowa (4), ESLint + Prettier (5), Husky (6), jscpd + secretlint (7).

## Uruchomienie

```bash
pnpm install       # instalacja zależności całego workspace
pnpm build         # Turbo buduje core → db → api (z cache)
pnpm start:api     # uruchamia serwer API (domyślnie http://localhost:3000)
```

Szybki test:

```bash
curl http://localhost:3000/health   # {"status":"ok"}
curl http://localhost:3000/demo     # wycena przykładowego koszyka z pakietu core
```

## Przydatne komendy

| Komenda | Opis |
|---|---|
| `pnpm build` | zbuduj wszystkie paczki (Turbo, z cache) |
| `pnpm dev` | tryb watch we wszystkich paczkach |
| `pnpm typecheck` | sprawdzenie typów TypeScript w całym repo |
