/*
  Warnings:

  - You are about to drop the column `incidentId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `rdoId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `incidentId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `rdoId` on the `media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_rdoId_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_rdoId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "incidentId",
DROP COLUMN "projectId",
DROP COLUMN "rdoId",
ADD COLUMN     "incident_id" TEXT,
ADD COLUMN     "project_id" TEXT,
ADD COLUMN     "rdo_id" TEXT;

-- AlterTable
ALTER TABLE "media" DROP COLUMN "incidentId",
DROP COLUMN "rdoId",
ADD COLUMN     "incident_id" TEXT,
ADD COLUMN     "rdo_id" TEXT;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_rdo_id_fkey" FOREIGN KEY ("rdo_id") REFERENCES "rdo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_rdo_id_fkey" FOREIGN KEY ("rdo_id") REFERENCES "rdo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
