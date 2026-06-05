/*
  Warnings:

  - Added the required column `icon` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_levelId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedChapter" DROP CONSTRAINT "CompletedChapter_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedLesson" DROP CONSTRAINT "CompletedLesson_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedLevel" DROP CONSTRAINT "CompletedLevel_levelId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedQuestion" DROP CONSTRAINT "CompletedQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_lessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "icon" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLevel" ADD CONSTRAINT "CompletedLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedChapter" ADD CONSTRAINT "CompletedChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLesson" ADD CONSTRAINT "CompletedLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedQuestion" ADD CONSTRAINT "CompletedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
