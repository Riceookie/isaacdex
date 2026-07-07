-- CreateEnum
CREATE TYPE "TrybGry" AS ENUM ('NORMAL', 'HARD');

-- CreateEnum
CREATE TYPE "WynikRunu" AS ENUM ('WIN', 'LOSS');

-- CreateEnum
CREATE TYPE "TypItemu" AS ENUM ('PASYWNY', 'AKTYWNY', 'TRINKET');

-- CreateEnum
CREATE TYPE "BossKoncowy" AS ENUM ('MOMS_HEART', 'ISAAC', 'SATAN', 'BLUE_BABY', 'LAMB', 'MEGA_SATAN', 'BOSS_RUSH', 'HUSH', 'DELIRIUM', 'MOTHER', 'BEAST');

-- CreateTable
CREATE TABLE "Profil" (
    "id" SERIAL NOT NULL,
    "steamId64" TEXT NOT NULL,
    "nick" TEXT,
    "ostatniSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamAchievement" (
    "id" SERIAL NOT NULL,
    "apiName" TEXT NOT NULL,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT,
    "ikonaUrl" TEXT,
    "globalnyProcent" DECIMAL(5,2),
    "odblokowany" BOOLEAN NOT NULL DEFAULT false,
    "dataOdblokowania" TIMESTAMP(3),
    "profilId" INTEGER NOT NULL,

    CONSTRAINT "SteamAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postac" (
    "id" SERIAL NOT NULL,
    "nazwa" TEXT NOT NULL,
    "kolejnosc" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Postac_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionMark" (
    "id" SERIAL NOT NULL,
    "boss" "BossKoncowy" NOT NULL,
    "tryb" "TrybGry" NOT NULL,
    "zaliczone" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3),
    "postacId" INTEGER NOT NULL,
    "profilId" INTEGER NOT NULL,

    CONSTRAINT "CompletionMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "idW" INTEGER,
    "nazwa" TEXT NOT NULL,
    "jakosc" INTEGER NOT NULL,
    "typ" "TypItemu" NOT NULL DEFAULT 'PASYWNY',
    "opis" TEXT,
    "ikonaUrl" TEXT,
    "tagi" TEXT[],

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" SERIAL NOT NULL,
    "postac" TEXT NOT NULL,
    "boss" "BossKoncowy",
    "wynik" "WynikRunu" NOT NULL DEFAULT 'LOSS',
    "czasMin" INTEGER,
    "seed" TEXT,
    "notatka" TEXT,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunItem" (
    "runId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "RunItem_pkey" PRIMARY KEY ("runId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profil_steamId64_key" ON "Profil"("steamId64");

-- CreateIndex
CREATE INDEX "SteamAchievement_odblokowany_idx" ON "SteamAchievement"("odblokowany");

-- CreateIndex
CREATE UNIQUE INDEX "SteamAchievement_profilId_apiName_key" ON "SteamAchievement"("profilId", "apiName");

-- CreateIndex
CREATE UNIQUE INDEX "Postac_nazwa_key" ON "Postac"("nazwa");

-- CreateIndex
CREATE INDEX "CompletionMark_postacId_idx" ON "CompletionMark"("postacId");

-- CreateIndex
CREATE UNIQUE INDEX "CompletionMark_profilId_postacId_boss_tryb_key" ON "CompletionMark"("profilId", "postacId", "boss", "tryb");

-- CreateIndex
CREATE UNIQUE INDEX "Item_nazwa_key" ON "Item"("nazwa");

-- CreateIndex
CREATE INDEX "Item_jakosc_idx" ON "Item"("jakosc");

-- CreateIndex
CREATE INDEX "RunItem_itemId_idx" ON "RunItem"("itemId");

-- AddForeignKey
ALTER TABLE "SteamAchievement" ADD CONSTRAINT "SteamAchievement_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "Profil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionMark" ADD CONSTRAINT "CompletionMark_postacId_fkey" FOREIGN KEY ("postacId") REFERENCES "Postac"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionMark" ADD CONSTRAINT "CompletionMark_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "Profil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunItem" ADD CONSTRAINT "RunItem_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunItem" ADD CONSTRAINT "RunItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

