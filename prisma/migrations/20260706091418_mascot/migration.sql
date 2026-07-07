-- CreateTable
CREATE TABLE "mascots" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "splash1" TEXT,
    "splash2" TEXT,
    "splash3" TEXT,
    "courseBuilding" TEXT,
    "referralSource" TEXT,
    "createProfile" TEXT,
    "avatar" TEXT,
    "signupSuccess" TEXT,
    "login" TEXT,
    "forgetPassword" TEXT,
    "verificationSuccess" TEXT,
    "setNewPassword" TEXT,
    "passwordSaved" TEXT,
    "levelLocked" TEXT,
    "questionAvatar" TEXT,
    "hint" TEXT,
    "congrats" TEXT,
    "vocabularyComingSoon" TEXT,
    "booksComingSoon" TEXT,
    "editProfile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mascots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mascots_key_key" ON "mascots"("key");
