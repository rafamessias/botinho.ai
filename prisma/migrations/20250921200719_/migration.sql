-- AlterTable
ALTER TABLE "public"."survey_responses" ALTER COLUMN "extraInfo" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userIp" DROP NOT NULL;
