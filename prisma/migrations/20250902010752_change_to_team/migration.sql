/*
  Warnings:

  - You are about to drop the column `companyId` on the `files` table. All the data in the column will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TeamMemberStatus" AS ENUM ('invited', 'accepted', 'rejected');

-- DropForeignKey
ALTER TABLE "public"."company_members" DROP CONSTRAINT "company_members_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."company_members" DROP CONSTRAINT "company_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."files" DROP CONSTRAINT "files_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."files" DROP COLUMN "companyId",
ADD COLUMN     "teamId" INTEGER;

-- DropTable
DROP TABLE "public"."companies";

-- DropTable
DROP TABLE "public"."company_members";

-- DropEnum
DROP TYPE "public"."CompanyMemberStatus";

-- DropEnum
DROP TYPE "public"."DocumentType";

-- CreateTable
CREATE TABLE "public"."teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."team_members" (
    "id" SERIAL NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "canPost" BOOLEAN NOT NULL,
    "canApprove" BOOLEAN NOT NULL,
    "isOwner" BOOLEAN NOT NULL,
    "teamMemberStatus" "public"."TeamMemberStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
