-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('light', 'dark', 'system');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "theme" "public"."Theme" NOT NULL DEFAULT 'system';
