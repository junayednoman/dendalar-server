/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[index,lessonType,chapterId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[index,type,chapterId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chapterId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonType` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('SENTENCE', 'DIALOGUE');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_lessonId_fkey";

-- DropIndex
DROP INDEX "Lesson_index_key";

-- DropIndex
DROP INDEX "Lesson_name_key";

-- DropIndex
DROP INDEX "Question_index_type_chapterId_lessonId_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "createdAt",
DROP COLUMN "icon",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD COLUMN     "lessonType" "LessonType" NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "lessonId";

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_index_lessonType_chapterId_key" ON "Lesson"("index", "lessonType", "chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_index_type_chapterId_key" ON "Question"("index", "type", "chapterId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
