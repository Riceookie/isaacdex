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
  3. **kontekst** — np. _The Bible_ przed walką z **Satanem** = ostrzeżenie (zabija Isaaca).

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

### Testy jednostkowe reguł (Vitest)

Reguły „serca" mają testy w [`packages/core/src/index.test.ts`](packages/core/src/index.test.ts):
doradca (jakość 4→BIERZ, 0→UWAGA, pułapka, **Bible+Satan→UWAGA**), reguła **HARD≥NORMAL**,
`procentUkonczenia`. Uruchomienie: `pnpm test`.

```text
$ pnpm test
@isaacdex/core:test:  ✓ src/index.test.ts (10 tests) 5ms
   Test Files  1 passed (1)
        Tests  10 passed (10)
```

## Jakość kodu — ESLint + Prettier (zadanie 5)

- **ESLint 9 flat config** ([`eslint.config.mjs`](eslint.config.mjs)): `@eslint/js` recommended +
  `typescript-eslint` recommended + `eslint-config-prettier` (wyłącza reguły formatujące, by nie
  kłóciły się z Prettierem). Reguła własna: `@typescript-eslint/no-unused-vars` = `warn`
  (z `argsIgnorePattern: '^_'`). Ignorowane: `dist`, `.next`, `node_modules`, `.turbo`, migracje.
- **Prettier** ([`.prettierrc`](.prettierrc)): bez średników, pojedyncze cudzysłowy, `printWidth: 100`,
  `trailingComma: all`.
- Zestaw jest „rozsądny, nie za luźny": bazuje na oficjalnych presetach recommended (nie tylko
  formatowanie), a duplikaty reguł łapanych przez kompilator TS (np. `no-const-assign`) są celowo
  wyłączane przez typescript-eslint, żeby się nie powielać.

**Dowód — `pnpm lint` przechodzi (exit 0):**

```text
$ pnpm lint
$ eslint .
EXIT: 0
```

Skrypty: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:check`.

## Automatyzacja — Husky (zadanie 6)

Pre-commit hook ([`.husky/pre-commit`](.husky/pre-commit)) uruchamia `lint-staged` przy każdym
commicie — ESLint + Prettier + secretlint tylko na **zmienionych** plikach.

`.husky/pre-commit`:

```sh
pnpm exec lint-staged
```

Fragment `package.json` (`prepare` inicjuje Husky, `lint-staged` mówi co odpalić):

```json
"scripts": { "prepare": "husky" },
"lint-staged": {
  "*.{ts,mjs,cjs,js}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"],
  "*": ["secretlint"]
}
```

**Dowód — commit z błędem `no-debugger` jest zablokowany:**

```text
✖ eslint --fix:
  2:3  error  Unexpected 'debugger' statement  no-debugger
✖ 1 problem (1 error, 0 warnings)
husky - pre-commit script failed (code 1)
```

## Higiena i bezpieczeństwo — jscpd + secretlint (zadanie 7)

Pliki w repo: [`.secretlintrc.json`](.secretlintrc.json), [`.secretlintignore`](.secretlintignore),
[`.jscpd.json`](.jscpd.json), konfiguracja w `package.json` (`lint-staged`, skrypty) i `.husky/`.

- **secretlint** — reguła `@secretlint/secretlint-rule-preset-recommend` (gotowy zestaw: klucze AWS/GCP,
  klucze prywatne, tokeny, basic-auth itd.). Wpięty w **pre-commit** (`"*": ["secretlint"]`), więc
  skanuje każdy plik przed commitem. `.secretlintignore` pomija `node_modules`, `dist`, `.turbo`,
  `pnpm-lock.yaml`. **Dowód:** commit pliku z kluczem prywatnym → `[PrivateKey] found private key` →
  commit zablokowany.
- **jscpd** — próg `threshold: 5` (%): build „pada", gdy duplikacja przekroczy 5% — świadomie niskie,
  ale nie zerowe, żeby drobne, nieuniknione powtórzenia (np. boilerplate configów) nie blokowały,
  a realny copy-paste tak. Ignoruje `dist`, `node_modules`, migracje, lockfile. Wynik obecnie:
  **0 klonów**. Skrypty: `pnpm secretlint`, `pnpm dupcheck`.

**Refleksja — po co to.** Te narzędzia przenoszą „higienę" z dobrych chęci na automat: secretlint
to siatka bezpieczeństwa, która nie pozwala wrzucić sekretu do repo (najczęstszy realny wyciek to
przypadkowy commit klucza), a jscpd pilnuje DRY — duplikaty to koszt utrzymania (poprawka w jednym
miejscu, zapomniana w drugim). Wpięte w Husky działają „same", więc jakość nie zależy od tego, czy
ktoś pamiętał odpalić lint.
