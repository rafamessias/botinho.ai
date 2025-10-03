-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."BillingInterval" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid');

-- CreateTable
CREATE TABLE "public"."subscription_plans" (
    "id" TEXT NOT NULL,
    "planType" "public"."PlanType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingInterval" "public"."BillingInterval" NOT NULL DEFAULT 'monthly',
    "maxActiveSurveys" INTEGER NOT NULL,
    "maxResponses" INTEGER NOT NULL,
    "removeBranding" BOOLEAN NOT NULL DEFAULT false,
    "allowApiAccess" BOOLEAN NOT NULL DEFAULT false,
    "allowExport" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer_subscriptions" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'active',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscription_plans_planType_idx" ON "public"."subscription_plans"("planType");

-- CreateIndex
CREATE INDEX "subscription_plans_isActive_idx" ON "public"."subscription_plans"("isActive");

-- CreateIndex
CREATE INDEX "subscription_plans_billingInterval_idx" ON "public"."subscription_plans"("billingInterval");

-- CreateIndex
CREATE UNIQUE INDEX "customer_subscriptions_teamId_key" ON "public"."customer_subscriptions"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_subscriptions_stripeCustomerId_key" ON "public"."customer_subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_subscriptions_stripeSubscriptionId_key" ON "public"."customer_subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_teamId_idx" ON "public"."customer_subscriptions"("teamId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_planId_idx" ON "public"."customer_subscriptions"("planId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_status_idx" ON "public"."customer_subscriptions"("status");

-- CreateIndex
CREATE INDEX "customer_subscriptions_stripeCustomerId_idx" ON "public"."customer_subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_stripeSubscriptionId_idx" ON "public"."customer_subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "customer_subscriptions_currentPeriodEnd_idx" ON "public"."customer_subscriptions"("currentPeriodEnd");

-- AddForeignKey
ALTER TABLE "public"."customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
