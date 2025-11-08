/*
  Warnings:

  - You are about to drop the column `remoteAuthKey` on the `company_whatsapp_numbers` table. All the data in the column will be lost.
  - You are about to drop the column `remoteAuthNamespace` on the `company_whatsapp_numbers` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `company_whatsapp_numbers` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `company_whatsapp_numbers` table. All the data in the column will be lost.
  - You are about to drop the column `wsUrl` on the `company_whatsapp_numbers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company_whatsapp_numbers" DROP COLUMN "remoteAuthKey",
DROP COLUMN "remoteAuthNamespace",
DROP COLUMN "tenantId",
DROP COLUMN "workerId",
DROP COLUMN "wsUrl",
ADD COLUMN     "sessionId" TEXT;
