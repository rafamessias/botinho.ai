/*
  Warnings:

  - The values [TOTAL_RESPONSES] on the enum `UsageMetricType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UsageMetricType_new" AS ENUM ('ACTIVE_SURVEYS', 'TOTAL_COMPLETED_RESPONSES');
ALTER TABLE "public"."usage_tracking" ALTER COLUMN "metricType" TYPE "public"."UsageMetricType_new" USING ("metricType"::text::"public"."UsageMetricType_new");
ALTER TYPE "public"."UsageMetricType" RENAME TO "UsageMetricType_old";
ALTER TYPE "public"."UsageMetricType_new" RENAME TO "UsageMetricType";
DROP TYPE "public"."UsageMetricType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."subscription_plans" ADD COLUMN     "allowPublicPages" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxCompletedResponses" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "maxActiveSurveys" SET DEFAULT 0,
ALTER COLUMN "maxResponses" SET DEFAULT 0;
