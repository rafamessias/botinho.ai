/*
  Warnings:

  - Added the required column `extraInfo` to the `survey_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `survey_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userIp` to the `survey_responses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."survey_responses" ADD COLUMN     "extraInfo" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "userIp" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."survey_styles" ADD COLUMN     "basicCSS" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "backgroundColor" SET DEFAULT '',
ALTER COLUMN "textColor" SET DEFAULT '',
ALTER COLUMN "buttonBackgroundColor" SET DEFAULT '',
ALTER COLUMN "buttonTextColor" SET DEFAULT '';
