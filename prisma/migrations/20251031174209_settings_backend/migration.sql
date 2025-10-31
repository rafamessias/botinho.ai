-- CreateTable
CREATE TABLE "public"."company_settings" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "newMessageAlerts" BOOLEAN NOT NULL DEFAULT true,
    "dailyReports" BOOLEAN NOT NULL DEFAULT false,
    "autoReply" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_whatsapp_numbers" (
    "id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "messagesThisMonth" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_whatsapp_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_settings_companyId_key" ON "public"."company_settings"("companyId");

-- CreateIndex
CREATE INDEX "company_whatsapp_numbers_companyId_idx" ON "public"."company_whatsapp_numbers"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "company_whatsapp_numbers_companyId_phoneNumber_key" ON "public"."company_whatsapp_numbers"("companyId", "phoneNumber");

-- AddForeignKey
ALTER TABLE "public"."company_settings" ADD CONSTRAINT "company_settings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_whatsapp_numbers" ADD CONSTRAINT "company_whatsapp_numbers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
