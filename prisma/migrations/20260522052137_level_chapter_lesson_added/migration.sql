-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'OTHER');

-- CreateEnum
CREATE TYPE "UserPurpose" AS ENUM ('JUST_FOR_FUN', 'BOOST_CAREER', 'CONNECT_WITH_PEOPLE', 'HIGHER_EDUCATION', 'OTHER');

-- AlterEnum
ALTER TYPE "LoginProvider" ADD VALUE 'GOOGLE';

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "purpose" "UserPurpose" NOT NULL,
    "referralSource" "ReferralSource" NOT NULL,
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "levelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_authId_key" ON "UserProfile"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Level_index_key" ON "Level"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_levelId_index_key" ON "Chapter"("levelId", "index");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
