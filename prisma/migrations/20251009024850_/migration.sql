/*
  Warnings:

  - You are about to drop the column `ResponseRate` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `ResponseRate` on the `teams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."surveys" DROP COLUMN "ResponseRate",
ADD COLUMN     "responseRate" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."teams" DROP COLUMN "ResponseRate",
ADD COLUMN     "responseRate" DECIMAL(10,2) NOT NULL DEFAULT 0;
