-- AlterTable
ALTER TABLE "Gracz" ADD COLUMN     "dekoracja" TEXT,
ADD COLUMN     "gablota" TEXT[];

-- CreateTable
CREATE TABLE "ReakcjaWiadomosci" (
    "wiadomoscId" INTEGER NOT NULL,
    "graczId" INTEGER NOT NULL,
    "ikona" TEXT NOT NULL,

    CONSTRAINT "ReakcjaWiadomosci_pkey" PRIMARY KEY ("wiadomoscId","graczId","ikona")
);

-- CreateIndex
CREATE INDEX "ReakcjaWiadomosci_wiadomoscId_idx" ON "ReakcjaWiadomosci"("wiadomoscId");

-- AddForeignKey
ALTER TABLE "ReakcjaWiadomosci" ADD CONSTRAINT "ReakcjaWiadomosci_wiadomoscId_fkey" FOREIGN KEY ("wiadomoscId") REFERENCES "Wiadomosc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReakcjaWiadomosci" ADD CONSTRAINT "ReakcjaWiadomosci_graczId_fkey" FOREIGN KEY ("graczId") REFERENCES "Gracz"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ── Realtime dla reakcji ─────────────────────────────────────────────────────
-- Reakcja ma się pojawiać u wszystkich od razu, tak jak wiadomość — czyli ta sama
-- ścieżka co przy `Wiadomosc`: publikacja + odczyt dla anon, zapis wyłącznie server action.
GRANT SELECT ON "ReakcjaWiadomosci" TO anon, authenticated;

ALTER TABLE "ReakcjaWiadomosci" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reakcje sa publiczne do czytania"
    ON "ReakcjaWiadomosci" FOR SELECT TO anon, authenticated USING (true);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "ReakcjaWiadomosci";
    END IF;
END $$;
