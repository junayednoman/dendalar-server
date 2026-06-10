-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "activeChapterId" TEXT,
ADD COLUMN     "activeLessonId" TEXT,
ADD COLUMN     "activeQuestionId" TEXT;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_activeChapterId_fkey" FOREIGN KEY ("activeChapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_activeLessonId_fkey" FOREIGN KEY ("activeLessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_activeQuestionId_fkey" FOREIGN KEY ("activeQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
