/*
  Warnings:

  - You are about to drop the column `activeProjectCount` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `projectCount` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "activeProjectCount",
DROP COLUMN "projectCount",
ALTER COLUMN "documentType" DROP NOT NULL,
ALTER COLUMN "document" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;
