-- Miękkie kasowanie wiadomości: nagrobek „X usunął wiadomość" zamiast twardego DELETE.
-- AlterTable
ALTER TABLE "Wiadomosc" ADD COLUMN     "usunieta" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usunietaPrzezId" INTEGER;

-- AddForeignKey: kto skasował (autor albo właściciel apki); SetNull, żeby zniknięcie konta
-- nie zabrało nagrobka.
ALTER TABLE "Wiadomosc" ADD CONSTRAINT "Wiadomosc_usunietaPrzezId_fkey" FOREIGN KEY ("usunietaPrzezId") REFERENCES "Gracz"("id") ON DELETE SET NULL ON UPDATE CASCADE;
