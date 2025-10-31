-- CreateEnum
CREATE TYPE "public"."InboxMessageSenderType" AS ENUM ('customer', 'agent', 'bot', 'system');

-- CreateEnum
CREATE TYPE "public"."InboxMessageStatus" AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');

-- CreateEnum
CREATE TYPE "public"."InboxConversationPriority" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "public"."inbox_customers" (
    "id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inbox_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inbox_conversations" (
    "id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "subject" TEXT,
    "lastMessagePreview" TEXT,
    "lastMessageSentAt" TIMESTAMP(3),
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "priority" "public"."InboxConversationPriority" NOT NULL DEFAULT 'medium',
    "satisfactionScore" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assignedToId" INTEGER,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inbox_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inbox_messages" (
    "id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderType" "public"."InboxMessageSenderType" NOT NULL,
    "senderUserId" INTEGER,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "status" "public"."InboxMessageStatus" NOT NULL DEFAULT 'sent',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inbox_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inbox_customers_companyId_idx" ON "public"."inbox_customers"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "inbox_customer_company_phone_unique" ON "public"."inbox_customers"("companyId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "inbox_customer_company_email_unique" ON "public"."inbox_customers"("companyId", "email");

-- CreateIndex
CREATE INDEX "inbox_conversations_companyId_idx" ON "public"."inbox_conversations"("companyId");

-- CreateIndex
CREATE INDEX "inbox_conversations_customerId_idx" ON "public"."inbox_conversations"("customerId");

-- CreateIndex
CREATE INDEX "inbox_conversations_assignedToId_idx" ON "public"."inbox_conversations"("assignedToId");

-- CreateIndex
CREATE INDEX "inbox_conversations_isArchived_idx" ON "public"."inbox_conversations"("isArchived");

-- CreateIndex
CREATE INDEX "inbox_conversations_lastMessageSentAt_idx" ON "public"."inbox_conversations"("lastMessageSentAt");

-- CreateIndex
CREATE INDEX "inbox_messages_companyId_idx" ON "public"."inbox_messages"("companyId");

-- CreateIndex
CREATE INDEX "inbox_messages_conversationId_idx" ON "public"."inbox_messages"("conversationId");

-- CreateIndex
CREATE INDEX "inbox_messages_sentAt_idx" ON "public"."inbox_messages"("sentAt");

-- AddForeignKey
ALTER TABLE "public"."inbox_customers" ADD CONSTRAINT "inbox_customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inbox_conversations" ADD CONSTRAINT "inbox_conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inbox_conversations" ADD CONSTRAINT "inbox_conversations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."inbox_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inbox_conversations" ADD CONSTRAINT "inbox_conversations_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inbox_messages" ADD CONSTRAINT "inbox_messages_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inbox_messages" ADD CONSTRAINT "inbox_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."inbox_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inbox_messages" ADD CONSTRAINT "inbox_messages_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
