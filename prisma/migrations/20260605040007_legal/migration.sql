-- CreateTable
CREATE TABLE "Legal" (
    "id" TEXT NOT NULL,
    "privacyPolicy" TEXT NOT NULL,
    "termsCondition" TEXT NOT NULL,
    "aboutUs" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Legal_pkey" PRIMARY KEY ("id")
);
