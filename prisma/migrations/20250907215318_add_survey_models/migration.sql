/*
  Warnings:

  - You are about to drop the column `teamId` on the `files` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."SurveyStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "public"."QuestionFormat" AS ENUM ('YES_NO', 'STAR_RATING', 'LONG_TEXT', 'STATEMENT', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE');

-- CreateEnum
CREATE TYPE "public"."ResponseStatus" AS ENUM ('pending', 'completed', 'abandoned');

-- DropForeignKey
ALTER TABLE "public"."files" DROP CONSTRAINT "files_teamId_fkey";

-- AlterTable
ALTER TABLE "public"."files" DROP COLUMN "teamId";

-- CreateTable
CREATE TABLE "public"."survey_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "survey_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."surveys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."SurveyStatus" NOT NULL DEFAULT 'draft',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "allowMultipleResponses" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,
    "typeId" TEXT,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."survey_styles" (
    "id" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL DEFAULT 'transparent',
    "textColor" TEXT NOT NULL DEFAULT '#222222',
    "buttonBackgroundColor" TEXT NOT NULL DEFAULT '#222222',
    "buttonTextColor" TEXT NOT NULL DEFAULT '#ffffff',
    "margin" TEXT NOT NULL DEFAULT '16px 0px',
    "padding" TEXT NOT NULL DEFAULT '16px',
    "borderRadius" TEXT NOT NULL DEFAULT '6px',
    "titleFontSize" TEXT NOT NULL DEFAULT '18px',
    "bodyFontSize" TEXT NOT NULL DEFAULT '16px',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surveyId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "survey_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "format" "public"."QuestionFormat" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "yesLabel" TEXT,
    "noLabel" TEXT,
    "buttonLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surveyId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questionId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."survey_responses" (
    "id" TEXT NOT NULL,
    "status" "public"."ResponseStatus" NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surveyId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_responses" (
    "id" TEXT NOT NULL,
    "isOther" BOOLEAN DEFAULT false,
    "textValue" TEXT,
    "numberValue" INTEGER,
    "booleanValue" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT,
    "responseId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "question_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "survey_styles_surveyId_key" ON "public"."survey_styles"("surveyId");

-- AddForeignKey
ALTER TABLE "public"."survey_types" ADD CONSTRAINT "survey_types_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."surveys" ADD CONSTRAINT "surveys_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."surveys" ADD CONSTRAINT "surveys_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."survey_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_styles" ADD CONSTRAINT "survey_styles_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_styles" ADD CONSTRAINT "survey_styles_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_options" ADD CONSTRAINT "question_options_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_responses" ADD CONSTRAINT "survey_responses_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_responses" ADD CONSTRAINT "survey_responses_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_responses" ADD CONSTRAINT "question_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_responses" ADD CONSTRAINT "question_responses_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_responses" ADD CONSTRAINT "question_responses_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "public"."survey_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_responses" ADD CONSTRAINT "question_responses_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
