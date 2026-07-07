# 👶 IsaacDex

Aplikacja-towarzysz do **The Binding of Isaac**: postęp achievementów ze Steama,
completion marks dla każdej postaci (jak ekran save file) i **doradca itemów**
(„brać czy zostawić"). Budowana w **monorepo** (Turborepo) przez tor stażowy.

📄 Pełna specyfikacja: [`docs/specyfikacja.md`](docs/specyfikacja.md)

## Struktura (monorepo)

```
isaacdex/
├─ apps/
│  └─ api/          # backend Node — sync ze Steam Web API + endpointy
├─ packages/
│  ├─ core/         # logika: doradca itemów, % ukończenia, streak
│  └─ db/           # PostgreSQL + Prisma (schema + klient + seed)
├─ turbo.json
├─ tsconfig.base.json
└─ pnpm-workspace.yaml
```

## Stack

- **TypeScript + Node.js** (runtime), **tsx** (uruchamianie TS)
- **Turborepo** + **pnpm workspaces** (monorepo, cache buildów)
- **PostgreSQL + Prisma** — dane (achievementy, marki, itemy)
- Źródło danych: **Steam Web API** (TBOI = appid `250900`, 641 achievementów)

## Uruchomienie

```bash
pnpm install
pnpm build
pnpm start:api            # http://localhost:3000
```

Baza (Prisma):

```bash
cp packages/db/.env.example packages/db/.env   # wpisz connection string do Postgresa
pnpm --filter @isaacdex/db db:migrate          # utwórz tabele
pnpm --filter @isaacdex/db db:seed             # postacie + starter itemów + profil
```

Szybki test API:

```bash
curl http://localhost:3000/health              # {"status":"ok"}
curl http://localhost:3000/demo/postep         # postęp achievementów (X/641)
curl "http://localhost:3000/demo/item?jakosc=0"  # doradca: brać czy zostawić
```
