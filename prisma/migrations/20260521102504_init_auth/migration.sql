-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "LoginProvider" AS ENUM ('EMAIL');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "OTPPurpose" AS ENUM ('VERIFY_ACCOUNT', 'RESET_PASSWORD');

-- CreateTable
CREATE TABLE "auth" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "loginProvider" "LoginProvider" NOT NULL,
    "fcmToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purpose" "OTPPurpose" NOT NULL,
    "resetTokenExpires" TIMESTAMP(3),
    "resetTokenHash" TEXT,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "otp_authId_key" ON "otp"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "otp_authId_purpose_key" ON "otp"("authId", "purpose");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_authId_key" ON "profiles"("authId");

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
