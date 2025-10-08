-- DropIndex
DROP INDEX "public"."customer_subscriptions_stripeCustomerId_key";

-- DropIndex
DROP INDEX "public"."customer_subscriptions_teamId_key";

-- AlterTable
ALTER TABLE "public"."customer_subscriptions" ADD COLUMN     "cancellationDetails" TEXT;

-- CreateIndex
CREATE INDEX "customer_subscriptions_teamId_status_idx" ON "public"."customer_subscriptions"("teamId", "status");
