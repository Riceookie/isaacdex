# 🪽 IsaacDex — specyfikacja aplikacji

**Zadanie stażowe:** „Wymyśl własną aplikację biznesową"
**Autor:** Karol (Riceookie / „Ananas") · **Data:** 2026-07-07

---

## 1. Cel i opis

**IsaacDex** to aplikacja-towarzysz (companion) do gry **The Binding of Isaac** dla
gracza-completionisty. Spina Twoje konto Steam, pokazuje postęp w achievementach, pozwala
prowadzić **completion marks** dla każdej postaci (jak ekran save file w grze) i podpowiada,
**czy podniesiony item warto wziąć** (doradca „brać/zostawić").

> Jedno zdanie: _„Zobacz ile brakuje Ci do 100%, prowadź marki dla każdej postaci
> i podejmuj lepsze decyzje w runie — w jednym miejscu."_

## 2. Problem

Gracz lecący na 100% w Isaacu:

- **nie wie na bieżąco, ile brakuje** — Steam pokazuje surową listę 641 achievementów bez kontekstu,
- **ręcznie pilnuje completion marks** dla ~17 postaci (Steam tego nie zna),
- w runie **waha się, czy podnieść item** — słaby item potrafi rozwodnić pulę i zepsuć build.

IsaacDex zbiera to w produkt: synchronizacja ze Steam + własny postęp + doradca decyzji.

## 3. Użytkownicy (role)

| Rola                          | Kto                       | Potrzeba                                                         |
| ----------------------------- | ------------------------- | ---------------------------------------------------------------- |
| **Gracz**                     | właściciel konta Steam    | podpiąć profil, widzieć postęp, prowadzić marki, sprawdzać itemy |
| **Gość**                      | ktoś z linkiem do profilu | podejrzeć publiczny postęp gracza                                |
| _(później)_ **Admin/kurator** | opiekun katalogu          | uzupełniać bazę itemów (jakość, tagi)                            |

## 4. Funkcje

### 4.1 Achievementy (Steam)

- Podpięcie konta przez **SteamID64**; **synchronizacja** ze Steam Web API.
- **Wykrywanie prywatnego profilu** → baner z instrukcją, jak ustawić publiczny (bez tego sync nie działa).
- Lista achievementów: odblokowane / do zdobycia, **rzadkość** (globalny %), postęp **X / 641** i procent.

### 4.2 Profil = „save file" z completion marks

- Siatka **postać × completion mark** (Mom's Heart, Isaac, Satan, ​Blue Baby, Lamb, Mega Satan,
  Boss Rush, Hush, Delirium, Mother, Beast) w trybie **Normal / Hard**.
- Ręczne zaznaczanie zaliczonych marek; liczenie **% ukończenia** postaci i całości.

### 4.3 Doradca itemów („serce")

- Baza itemów z **jakością 0–4** i tagami.
- Wpisujesz / wybierasz item → rekomendacja **BIERZ / SYTUACYJNIE / UWAGA** + powód.
- (rozwinięcie) proste reguły znanych **pułapek** i anty-synergii.

### 4.4 Rozszerzenia (zadanie 8 „Rozwijaj produkt")

- **Log runów** (postać, boss końcowy, wynik, itemy) + statystyki (win-rate, ulubione itemy).
- **Companion runu na żywo**: serca (+/‑, typy: red/soul/black/rotten) i statystyki (+1/+10, ‑1/‑10).

## 5. Encje (model danych)

```
Profil 1──∞ SteamAchievement       (odblokowany, globalny %, data)
Profil 1──∞ CompletionMark ∞──1 Postac
Item   1──∞ RunItem ∞──1 Run       (log runów — rozszerzenie)
```

| Encja                | Pola (kluczowe)                                                             |
| -------------------- | --------------------------------------------------------------------------- |
| **Profil**           | steamId64, nick, ostatniSync                                                |
| **SteamAchievement** | apiName, nazwa, opis, ikona, globalnyProcent, odblokowany, dataOdblokowania |
| **Postac**           | nazwa, kolejność                                                            |
| **CompletionMark**   | boss (enum), tryb (Normal/Hard), zaliczone, data                            |
| **Item**             | nazwa, jakość 0–4, typ (pasywny/aktywny/trinket), tagi[], ikona             |
| **Run / RunItem**    | postać, boss, wynik, czas, seed ↔ itemy (m:n)                               |

## 6. Logika biznesowa („serce" — zadanie 4)

1. **Doradca itemów** — z jakości (0–4) + reguł zwraca rekomendację „brać/zostawić".
2. **% ukończenia** — achievementy (odblokowane / 641) oraz marki (zaliczone / wszystkie).
3. **Wykrywanie prywatnego profilu** — pusta/odmowna odpowiedź Steam → stan „prywatny" + instrukcja.
4. **Streak** — dni z rzędu z nowym odblokowaniem (z dat ze Steama).
5. **Statystyki** — najrzadszy zdobyty achievement, postacie na 100%, itd.

## 7. Źródła danych (publiczne API)

- **Steam Web API**: `GetPlayerAchievements`, `GetSchemaForGame`, `GetOwnedGames` (wymagają darmowego klucza),
  `GetGlobalAchievementPercentagesForApp` (bez klucza) — TBOI to appid **250900** (641 achievementów).
- Prywatność: sync działa tylko dla **profilu publicznego** (obsłużone banerem).

## 8. Stack technologiczny

Monorepo (tor zadań 2–9): **TypeScript + Node.js** (tsx), **Turborepo**, **pnpm workspaces**,
**PostgreSQL + Prisma** (`packages/db`), logika w `packages/core`, jakość **ESLint + Prettier**,
automatyzacja **Husky**, higiena **jscpd + secretlint**.

```
isaacdex/
├─ apps/api/        # backend Node: sync Steam + endpointy
├─ packages/core/   # logika (doradca itemów, % ukończenia, streak)
├─ packages/db/     # Prisma (schema + klient + seed)
└─ docs/specyfikacja.md
```
