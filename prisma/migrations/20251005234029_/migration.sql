/*
  Warnings:

  - You are about to drop the column `billingInterval` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `subscription_plans` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."subscription_plans_billingInterval_idx";

-- AlterTable
ALTER TABLE "public"."customer_subscriptions" ADD COLUMN     "billingInterval" "public"."BillingInterval" NOT NULL DEFAULT 'monthly';

-- AlterTable
ALTER TABLE "public"."subscription_plans" DROP COLUMN "billingInterval",
DROP COLUMN "price",
ADD COLUMN     "priceMonthly" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "priceYearly" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "stripePriceIdMonthly" TEXT,
ADD COLUMN     "stripePriceIdYearly" TEXT,
ADD COLUMN     "stripeProductId" TEXT;

-- AlterTable
ALTER TABLE "public"."surveys" ADD COLUMN     "context" TEXT;

-- CreateIndex
CREATE INDEX "customer_subscriptions_billingInterval_idx" ON "public"."customer_subscriptions"("billingInterval");
