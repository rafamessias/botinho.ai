/*
  Warnings:

  - You are about to drop the column `token` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenSurvery]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenApi]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."UsageMetricType" AS ENUM ('ACTIVE_SURVEYS', 'TOTAL_RESPONSES');

-- DropIndex
DROP INDEX "public"."teams_token_idx";

-- DropIndex
DROP INDEX "public"."teams_token_key";

-- AlterTable
ALTER TABLE "public"."teams" DROP COLUMN "token",
ADD COLUMN     "tokenApi" TEXT,
ADD COLUMN     "tokenSurvery" TEXT;

-- CreateTable
CREATE TABLE "public"."usage_tracking" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "metricType" "public"."UsageMetricType" NOT NULL,
    "currentUsage" INTEGER NOT NULL DEFAULT 0,
    "limitValue" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "lastResetDate" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usage_tracking_teamId_idx" ON "public"."usage_tracking"("teamId");

-- CreateIndex
CREATE INDEX "usage_tracking_subscriptionId_idx" ON "public"."usage_tracking"("subscriptionId");

-- CreateIndex
CREATE INDEX "usage_tracking_metricType_idx" ON "public"."usage_tracking"("metricType");

-- CreateIndex
CREATE INDEX "usage_tracking_periodStart_idx" ON "public"."usage_tracking"("periodStart");

-- CreateIndex
CREATE INDEX "usage_tracking_periodEnd_idx" ON "public"."usage_tracking"("periodEnd");

-- CreateIndex
CREATE INDEX "usage_tracking_lastUpdated_idx" ON "public"."usage_tracking"("lastUpdated");

-- CreateIndex
CREATE UNIQUE INDEX "usage_tracking_teamId_metricType_periodStart_key" ON "public"."usage_tracking"("teamId", "metricType", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "teams_tokenSurvery_key" ON "public"."teams"("tokenSurvery");

-- CreateIndex
CREATE UNIQUE INDEX "teams_tokenApi_key" ON "public"."teams"("tokenApi");

-- CreateIndex
CREATE INDEX "teams_tokenSurvery_idx" ON "public"."teams"("tokenSurvery");

-- CreateIndex
CREATE INDEX "teams_tokenApi_idx" ON "public"."teams"("tokenApi");

-- AddForeignKey
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."customer_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
