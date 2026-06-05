/*
  Warnings:

  - You are about to drop the column `sentenceInTargetLanguage` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "sentenceInTargetLanguage",
ADD COLUMN     "sentenceInLearningLanguage" TEXT;
