/*
  Warnings:

  - You are about to drop the column `remoteAuthKey` on the `session_assignments` table. All the data in the column will be lost.
  - You are about to drop the `company_whatsapp_numbers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."company_whatsapp_numbers" DROP CONSTRAINT "company_whatsapp_numbers_companyId_fkey";

-- DropIndex
DROP INDEX "public"."session_assignments_remoteAuthKey_idx";

-- AlterTable
ALTER TABLE "session_assignments" DROP COLUMN "remoteAuthKey",
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "remoteAuthData" JSONB,
ADD COLUMN     "status" TEXT;

-- DropTable
DROP TABLE "public"."company_whatsapp_numbers";
