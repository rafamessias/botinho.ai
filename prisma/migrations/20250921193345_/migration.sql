-- CreateTable
CREATE TABLE "public"."survey_response_summaries" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "optionId" TEXT,
    "isOther" BOOLEAN DEFAULT false,
    "numberValue" INTEGER,
    "booleanValue" BOOLEAN,
    "teamId" INTEGER NOT NULL,
    "responseCount" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_response_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "survey_response_summaries_surveyId_questionId_optionId_team_key" ON "public"."survey_response_summaries"("surveyId", "questionId", "optionId", "teamId");

-- AddForeignKey
ALTER TABLE "public"."survey_response_summaries" ADD CONSTRAINT "survey_response_summaries_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_response_summaries" ADD CONSTRAINT "survey_response_summaries_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_response_summaries" ADD CONSTRAINT "survey_response_summaries_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_response_summaries" ADD CONSTRAINT "survey_response_summaries_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."survey_response_summaries" ADD CONSTRAINT "survey_response_summaries_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "public"."survey_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
