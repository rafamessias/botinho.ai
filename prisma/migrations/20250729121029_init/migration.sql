/*
  Warnings:

  - Changed the type of `documentType` on the `companies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('cpf', 'cnpj');

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "documentType",
ADD COLUMN     "documentType" "DocumentType" NOT NULL;
