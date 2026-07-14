-- CreateEnum
CREATE TYPE "TypWpisu" AS ENUM ('UNLOCK', 'BOSS', 'RUN', 'TEKST');

-- CreateTable
CREATE TABLE "Gracz" (
    "id" SERIAL NOT NULL,
    "nick" TEXT NOT NULL,
    "kolor" TEXT,
    "opis" TEXT,
    "avatar" TEXT,
    "ja" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Gracz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obserwacja" (
    "obserwujacyId" INTEGER NOT NULL,
    "obserwowanyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Obserwacja_pkey" PRIMARY KEY ("obserwujacyId","obserwowanyId")
);

-- CreateTable
CREATE TABLE "Wpis" (
    "id" SERIAL NOT NULL,
    "autorId" INTEGER NOT NULL,
    "typ" "TypWpisu" NOT NULL,
    "tresc" TEXT NOT NULL,
    "postac" TEXT,
    "ikonaUrl" TEXT,
    "itemy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lajk" (
    "wpisId" INTEGER NOT NULL,
    "graczId" INTEGER NOT NULL,

    CONSTRAINT "Lajk_pkey" PRIMARY KEY ("wpisId","graczId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gracz_nick_key" ON "Gracz"("nick");

-- CreateIndex
CREATE INDEX "Obserwacja_obserwowanyId_idx" ON "Obserwacja"("obserwowanyId");

-- CreateIndex
CREATE INDEX "Wpis_createdAt_idx" ON "Wpis"("createdAt");

-- CreateIndex
CREATE INDEX "Wpis_autorId_idx" ON "Wpis"("autorId");

-- AddForeignKey
ALTER TABLE "Obserwacja" ADD CONSTRAINT "Obserwacja_obserwujacyId_fkey" FOREIGN KEY ("obserwujacyId") REFERENCES "Gracz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obserwacja" ADD CONSTRAINT "Obserwacja_obserwowanyId_fkey" FOREIGN KEY ("obserwowanyId") REFERENCES "Gracz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wpis" ADD CONSTRAINT "Wpis_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Gracz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lajk" ADD CONSTRAINT "Lajk_wpisId_fkey" FOREIGN KEY ("wpisId") REFERENCES "Wpis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lajk" ADD CONSTRAINT "Lajk_graczId_fkey" FOREIGN KEY ("graczId") REFERENCES "Gracz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

