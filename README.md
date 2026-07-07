# 🪽 IsaacDex

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

> API czyta `DATABASE_URL` ze środowiska (jak Prisma). Lokalnie:
> `set -a; . packages/db/.env; set +a` przed `pnpm start:api`.

## Logika biznesowa (zadanie 4)

Dwa przepływy „serca aplikacji" — logika w `packages/core` (czysta, testowalna),
dane z Postgresa przez Prisma, walidacja **zanim** cokolwiek trafi/zmieni się w bazie.

### Przepływ 1 — Doradca itemów: „brać czy zostawić?"
`GET /advice?item=<nazwa>&boss=<BOSS>`
- Waliduje istnienie itemu w katalogu (nieznany → 404).
- Reguły (nakładają się, wynik = najostrożniejsza rekomendacja):
  1. bazowa wg **jakości 0–4**,
  2. **pułapki** oznaczone w tagach itemu,
  3. **kontekst** — np. *The Bible* przed walką z **Satanem** = ostrzeżenie (zabija Isaaca).
```bash
curl -G http://localhost:3000/advice --data-urlencode "item=Sacred Heart"
#  → { rekomendacja: "BIERZ", ... }
curl -G http://localhost:3000/advice --data-urlencode "item=The Bible" --data-urlencode "boss=SATAN"
#  → { rekomendacja: "UWAGA", powody: [jakość, pułapka, "…zabija na Satanie"] }
```

### Przepływ 2 — Completion mark (z regułą kolejności)
`POST /completion` `{ "postac", "boss", "tryb", "zaliczone" }` · `GET /completion/<postac>`
- **Walidacja**: postać istnieje, `boss`/`tryb` z dozwolonych wartości.
- **Reguła biznesowa**: `HARD` można zaznaczyć dopiero po zaliczonym `NORMAL` (inaczej 409).
- Po zapisie zwraca **% ukończenia** postaci (zaliczone / bossy×tryby).
```bash
curl -X POST http://localhost:3000/completion -H 'content-type: application/json' \
  -d '{"postac":"Isaac","boss":"MOMS_HEART","tryb":"NORMAL"}'
#  → { zapisano: {...}, postepPostaci: { zaliczone: 1, wszystkie: 22, procent: 5 } }
```
