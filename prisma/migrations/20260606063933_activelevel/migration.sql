-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "activeLevelId" TEXT;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_activeLevelId_fkey" FOREIGN KEY ("activeLevelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;
