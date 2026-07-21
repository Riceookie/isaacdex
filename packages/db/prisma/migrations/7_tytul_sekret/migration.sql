-- Wybór tytułu pod nickiem + odkrycie Sekretnego Pokoju.
-- AlterTable
ALTER TABLE "Gracz" ADD COLUMN     "wybranyTytul" TEXT,
ADD COLUMN     "sekretOdkryty" BOOLEAN NOT NULL DEFAULT false;
