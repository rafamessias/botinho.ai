-- CreateEnum
CREATE TYPE "public"."StyleMode" AS ENUM ('basic', 'advanced');

-- AlterTable
ALTER TABLE "public"."survey_styles" ADD COLUMN     "advancedCSS" TEXT,
ADD COLUMN     "styleMode" "public"."StyleMode" NOT NULL DEFAULT 'basic';
