/*
  Warnings:

  - A unique constraint covering the columns `[surveyId,questionId,numberValue,teamId]` on the table `survey_response_summaries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[surveyId,questionId,booleanValue,teamId]` on the table `survey_response_summaries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "survey_response_summaries_surveyId_questionId_numberValue_t_key" ON "public"."survey_response_summaries"("surveyId", "questionId", "numberValue", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "survey_response_summaries_surveyId_questionId_booleanValue__key" ON "public"."survey_response_summaries"("surveyId", "questionId", "booleanValue", "teamId");
