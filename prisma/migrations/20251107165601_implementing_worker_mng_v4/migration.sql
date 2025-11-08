/*
  Warnings:

  - You are about to drop the column `tenantId` on the `session_assignments` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `session_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."session_assignments_tenantId_idx";

-- AlterTable
ALTER TABLE "session_assignments" DROP COLUMN "tenantId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "session_assignments_companyId_idx" ON "session_assignments"("companyId");

-- AddForeignKey
ALTER TABLE "session_assignments" ADD CONSTRAINT "session_assignments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
