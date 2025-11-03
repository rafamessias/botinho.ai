-- DropForeignKey
ALTER TABLE "public"."company_whatsapp_numbers" DROP CONSTRAINT "company_whatsapp_numbers_companyId_fkey";

-- AlterTable
ALTER TABLE "company_whatsapp_numbers" ADD COLUMN     "remoteAuthKey" TEXT,
ADD COLUMN     "remoteAuthNamespace" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "workerId" TEXT;

-- CreateTable
CREATE TABLE "KvBackup" (
    "key" TEXT NOT NULL,
    "value" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KvBackup_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "company_whatsapp_numbers" ADD CONSTRAINT "company_whatsapp_numbers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
