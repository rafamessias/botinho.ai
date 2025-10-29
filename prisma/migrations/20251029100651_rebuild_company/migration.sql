/*
  Warnings:

  - You are about to drop the column `teamId` on the `customer_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `usage_tracking` table. All the data in the column will be lost.
  - You are about to drop the column `defaultTeamId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[companyId,metricType,periodStart]` on the table `usage_tracking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `customer_subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `usage_tracking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CompanyMemberStatus" AS ENUM ('invited', 'accepted', 'rejected');

-- DropForeignKey
ALTER TABLE "public"."customer_subscriptions" DROP CONSTRAINT "customer_subscriptions_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."team_members" DROP CONSTRAINT "team_members_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."team_members" DROP CONSTRAINT "team_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."usage_tracking" DROP CONSTRAINT "usage_tracking_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_defaultTeamId_fkey";

-- DropIndex
DROP INDEX "public"."customer_subscriptions_teamId_idx";

-- DropIndex
DROP INDEX "public"."customer_subscriptions_teamId_status_idx";

-- DropIndex
DROP INDEX "public"."usage_tracking_teamId_idx";

-- DropIndex
DROP INDEX "public"."usage_tracking_teamId_metricType_periodStart_key";

-- DropIndex
DROP INDEX "public"."users_defaultTeamId_idx";

-- AlterTable
ALTER TABLE "public"."customer_subscriptions" DROP COLUMN "teamId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."usage_tracking" DROP COLUMN "teamId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "defaultTeamId",
ADD COLUMN     "defaultCompanyId" INTEGER;

-- DropTable
DROP TABLE "public"."team_members";

-- DropTable
DROP TABLE "public"."teams";

-- DropEnum
DROP TYPE "public"."TeamMemberStatus";

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tokenApi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_members" (
    "id" SERIAL NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "canPost" BOOLEAN NOT NULL,
    "canApprove" BOOLEAN NOT NULL,
    "isOwner" BOOLEAN NOT NULL,
    "companyMemberStatus" "public"."CompanyMemberStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "company_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companies_createdAt_idx" ON "public"."companies"("createdAt");

-- CreateIndex
CREATE INDEX "company_members_userId_idx" ON "public"."company_members"("userId");

-- CreateIndex
CREATE INDEX "company_members_companyId_idx" ON "public"."company_members"("companyId");

-- CreateIndex
CREATE INDEX "company_members_companyMemberStatus_idx" ON "public"."company_members"("companyMemberStatus");

-- CreateIndex
CREATE INDEX "company_members_isAdmin_idx" ON "public"."company_members"("isAdmin");

-- CreateIndex
CREATE INDEX "company_members_isOwner_idx" ON "public"."company_members"("isOwner");

-- CreateIndex
CREATE UNIQUE INDEX "company_members_userId_companyId_key" ON "public"."company_members"("userId", "companyId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_companyId_idx" ON "public"."customer_subscriptions"("companyId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_companyId_status_idx" ON "public"."customer_subscriptions"("companyId", "status");

-- CreateIndex
CREATE INDEX "usage_tracking_companyId_idx" ON "public"."usage_tracking"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "usage_tracking_companyId_metricType_periodStart_key" ON "public"."usage_tracking"("companyId", "metricType", "periodStart");

-- CreateIndex
CREATE INDEX "users_defaultCompanyId_idx" ON "public"."users"("defaultCompanyId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_defaultCompanyId_fkey" FOREIGN KEY ("defaultCompanyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_members" ADD CONSTRAINT "company_members_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_members" ADD CONSTRAINT "company_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
