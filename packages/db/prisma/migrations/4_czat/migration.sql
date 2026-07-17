-- CreateTable
CREATE TABLE "Wiadomosc" (
    "id" SERIAL NOT NULL,
    "kanal" TEXT NOT NULL,
    "autorId" INTEGER NOT NULL,
    "tresc" TEXT NOT NULL,
    "obrazekUrl" TEXT,
    "utworzono" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wiadomosc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Wiadomosc_kanal_utworzono_idx" ON "Wiadomosc"("kanal", "utworzono");

-- CreateIndex
CREATE INDEX "Wiadomosc_autorId_idx" ON "Wiadomosc"("autorId");

-- AddForeignKey
ALTER TABLE "Wiadomosc" ADD CONSTRAINT "Wiadomosc_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Gracz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Realtime ─────────────────────────────────────────────────────────────────
-- Wiadomości dolatują do przeglądarki przez Supabase Realtime (postgres_changes),
-- a ten słucha WYŁĄCZNIE tabel z publikacji `supabase_realtime`. Bez dopisania tabeli
-- do publikacji INSERT-y są dla klienta niewidoczne i czat wygląda na zepsuty.

-- Przeglądarka czyta tę tabelę kluczem anon, więc rola anon potrzebuje dostępu do schematu.
GRANT USAGE ON SCHEMA "isaacdex" TO anon, authenticated;
GRANT SELECT ON "Wiadomosc" TO anon, authenticated;

-- RLS: czytać może każdy (czat globalny jest publiczny, jak feed), ale PISAĆ kluczem anon
-- się nie da — zapis idzie wyłącznie server action przez Prismę (rola postgres, właściciel
-- tabeli, omija RLS). Brak polityki INSERT/UPDATE/DELETE = brak zapisu z przeglądarki.
ALTER TABLE "Wiadomosc" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wiadomosci sa publiczne do czytania"
    ON "Wiadomosc" FOR SELECT TO anon, authenticated USING (true);

-- Publikacja istnieje na każdym projekcie Supabase, ale gdyby ta migracja poszła na goły
-- Postgres, jej brak nie może wywalić całej migracji.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "Wiadomosc";
    END IF;
END $$;
