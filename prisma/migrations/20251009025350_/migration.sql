/*
  Warnings:

  - You are about to alter the column `responseRate` on the `surveys` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `responseRate` on the `teams` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "public"."surveys" ALTER COLUMN "responseRate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."teams" ALTER COLUMN "responseRate" SET DATA TYPE DOUBLE PRECISION;
