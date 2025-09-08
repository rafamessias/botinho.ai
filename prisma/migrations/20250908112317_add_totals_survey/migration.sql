-- AlterTable
ALTER TABLE "public"."question_options" ADD COLUMN     "isOther" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."questions" ADD COLUMN     "addOther" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."survey_styles" ADD COLUMN     "border" TEXT NOT NULL DEFAULT '1px solid #222222';

-- AlterTable
ALTER TABLE "public"."surveys" ADD COLUMN     "ResponseRate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalOpenSurveys" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalResponses" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."teams" ADD COLUMN     "ResponseRate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalActiveSurveys" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalOpenSurveys" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalResponses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSurveys" INTEGER NOT NULL DEFAULT 0;
