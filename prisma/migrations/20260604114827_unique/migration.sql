/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,index]` on the table `Level` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SENTENCE', 'DIALOGUE');

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "sentenceInEnglish" TEXT,
    "sentenceInTargetLanguage" TEXT,
    "hint" TEXT,
    "fullSentence" TEXT,
    "missingWord" TEXT,
    "index" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedLevel" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedChapter" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedLesson" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedQuestion" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_index_type_chapterId_lessonId_key" ON "Question"("index", "type", "chapterId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Level_name_key" ON "Level"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Level_name_index_key" ON "Level"("name", "index");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLevel" ADD CONSTRAINT "CompletedLevel_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLevel" ADD CONSTRAINT "CompletedLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedChapter" ADD CONSTRAINT "CompletedChapter_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedChapter" ADD CONSTRAINT "CompletedChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLesson" ADD CONSTRAINT "CompletedLesson_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedLesson" ADD CONSTRAINT "CompletedLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedQuestion" ADD CONSTRAINT "CompletedQuestion_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedQuestion" ADD CONSTRAINT "CompletedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
