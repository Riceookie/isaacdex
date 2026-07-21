-- Edycja i odpowiedzi na czacie.
-- AlterTable
ALTER TABLE "Wiadomosc" ADD COLUMN     "edytowana" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "odpowiedzNaId" INTEGER;

-- AddForeignKey: odpowiedź wskazuje na inną wiadomość; SetNull, żeby kasowanie oryginału
-- nie zabierało odpowiedzi (traci tylko cytat).
ALTER TABLE "Wiadomosc" ADD CONSTRAINT "Wiadomosc_odpowiedzNaId_fkey" FOREIGN KEY ("odpowiedzNaId") REFERENCES "Wiadomosc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
