/*
  Warnings:

  - A unique constraint covering the columns `[index,chapterId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[index,type,chapterId,lessonId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Lesson_index_lessonType_chapterId_key";

-- DropIndex
DROP INDEX "Question_index_type_chapterId_key";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "lessonId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_index_chapterId_key" ON "Lesson"("index", "chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_index_type_chapterId_lessonId_key" ON "Question"("index", "type", "chapterId", "lessonId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
