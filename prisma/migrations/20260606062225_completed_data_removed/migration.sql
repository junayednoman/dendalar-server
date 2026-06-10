/*
  Warnings:

  - You are about to drop the `CompletedChapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompletedLesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompletedLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompletedQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompletedChapter" DROP CONSTRAINT "CompletedChapter_authId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedChapter" DROP CONSTRAINT "CompletedChapter_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedLesson" DROP CONSTRAINT "CompletedLesson_authId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedLesson" DROP CONSTRAINT "CompletedLesson_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedLevel" DROP CONSTRAINT "CompletedLevel_authId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedLevel" DROP CONSTRAINT "CompletedLevel_levelId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedQuestion" DROP CONSTRAINT "CompletedQuestion_authId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedQuestion" DROP CONSTRAINT "CompletedQuestion_questionId_fkey";

-- DropTable
DROP TABLE "CompletedChapter";

-- DropTable
DROP TABLE "CompletedLesson";

-- DropTable
DROP TABLE "CompletedLevel";

-- DropTable
DROP TABLE "CompletedQuestion";
