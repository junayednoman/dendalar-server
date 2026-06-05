-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_authId_fkey";

-- DropForeignKey
ALTER TABLE "otp" DROP CONSTRAINT "otp_authId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_authId_fkey";

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
