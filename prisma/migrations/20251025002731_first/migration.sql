-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('en', 'pt_BR');

-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('google', 'local');

-- CreateEnum
CREATE TYPE "public"."TeamMemberStatus" AS ENUM ('invited', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('light', 'dark', 'system');

-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."BillingInterval" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('pending', 'active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid');

-- CreateEnum
CREATE TYPE "public"."UsageMetricType" AS ENUM ('ACTIVE_SURVEYS', 'TOTAL_COMPLETED_RESPONSES');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "public"."Provider" NOT NULL DEFAULT 'local',
    "password" TEXT,
    "resetPasswordToken" TEXT,
    "confirmationToken" TEXT,
    "confirmed" BOOLEAN,
    "blocked" BOOLEAN,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "position" TEXT,
    "companyName" TEXT,
    "country" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "websiteUrl" TEXT,
    "githubUrl" TEXT,
    "avatarUrl" TEXT,
    "language" "public"."Language" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatarId" TEXT,
    "idProvider" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "theme" "public"."Theme" NOT NULL DEFAULT 'system',
    "defaultTeamId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "format" TEXT,
    "version" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

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

-- CreateTable
CREATE TABLE "public"."subscription_plans" (
    "id" TEXT NOT NULL,
    "planType" "public"."PlanType" NOT NULL,
    "stripeProductId" TEXT,
    "stripePriceIdMonthly" TEXT,
    "stripePriceIdYearly" TEXT,
    "priceMonthly" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceYearly" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
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
    "billingInterval" "public"."BillingInterval" NOT NULL DEFAULT 'monthly',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "cancellationDetails" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_subscriptions_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "public"."users"("phone");

-- CreateIndex
CREATE INDEX "users_resetPasswordToken_idx" ON "public"."users"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "users_confirmationToken_idx" ON "public"."users"("confirmationToken");

-- CreateIndex
CREATE INDEX "users_defaultTeamId_idx" ON "public"."users"("defaultTeamId");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");

-- CreateIndex
CREATE INDEX "files_userId_idx" ON "public"."files"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "files_id_key" ON "public"."files"("id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "public"."verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "teams_createdAt_idx" ON "public"."teams"("createdAt");

-- CreateIndex
CREATE INDEX "team_members_userId_idx" ON "public"."team_members"("userId");

-- CreateIndex
CREATE INDEX "team_members_teamId_idx" ON "public"."team_members"("teamId");

-- CreateIndex
CREATE INDEX "team_members_teamMemberStatus_idx" ON "public"."team_members"("teamMemberStatus");

-- CreateIndex
CREATE INDEX "team_members_isAdmin_idx" ON "public"."team_members"("isAdmin");

-- CreateIndex
CREATE INDEX "team_members_isOwner_idx" ON "public"."team_members"("isOwner");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON "public"."team_members"("userId", "teamId");

-- CreateIndex
CREATE INDEX "subscription_plans_planType_idx" ON "public"."subscription_plans"("planType");

-- CreateIndex
CREATE INDEX "subscription_plans_isActive_idx" ON "public"."subscription_plans"("isActive");

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

-- CreateIndex
CREATE INDEX "customer_subscriptions_billingInterval_idx" ON "public"."customer_subscriptions"("billingInterval");

-- CreateIndex
CREATE INDEX "customer_subscriptions_teamId_status_idx" ON "public"."customer_subscriptions"("teamId", "status");

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

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_defaultTeamId_fkey" FOREIGN KEY ("defaultTeamId") REFERENCES "public"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."customer_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
