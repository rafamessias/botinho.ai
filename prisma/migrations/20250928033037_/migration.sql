-- AlterTable
ALTER TABLE "public"."survey_responses" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "origin" TEXT;
