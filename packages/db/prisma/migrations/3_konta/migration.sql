-- AlterTable
ALTER TABLE "Gracz" ADD COLUMN     "profilId" INTEGER,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Gracz_userId_key" ON "Gracz"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Gracz_profilId_key" ON "Gracz"("profilId");

-- AddForeignKey
ALTER TABLE "Gracz" ADD CONSTRAINT "Gracz_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Dane: właściciel apki („ja") ma już zsynchronizowany Steam sprzed logowania —
-- spinamy go z jego profilem, żeby achievementy nie zostały bez gracza.
UPDATE "Gracz" g
SET "profilId" = (SELECT p."id" FROM "Profil" p ORDER BY p."id" LIMIT 1)
WHERE g."ja" = true
  AND g."profilId" IS NULL
  AND EXISTS (SELECT 1 FROM "Profil");
