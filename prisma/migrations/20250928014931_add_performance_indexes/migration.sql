-- CreateIndex
CREATE INDEX "question_options_questionId_idx" ON "public"."question_options"("questionId");

-- CreateIndex
CREATE INDEX "question_options_teamId_idx" ON "public"."question_options"("teamId");

-- CreateIndex
CREATE INDEX "question_options_questionId_order_idx" ON "public"."question_options"("questionId", "order");

-- CreateIndex
CREATE INDEX "question_options_isOther_idx" ON "public"."question_options"("isOther");

-- CreateIndex
CREATE INDEX "question_responses_questionId_idx" ON "public"."question_responses"("questionId");

-- CreateIndex
CREATE INDEX "question_responses_responseId_idx" ON "public"."question_responses"("responseId");

-- CreateIndex
CREATE INDEX "question_responses_teamId_idx" ON "public"."question_responses"("teamId");

-- CreateIndex
CREATE INDEX "question_responses_optionId_idx" ON "public"."question_responses"("optionId");

-- CreateIndex
CREATE INDEX "question_responses_questionFormat_idx" ON "public"."question_responses"("questionFormat");

-- CreateIndex
CREATE INDEX "question_responses_questionId_optionId_idx" ON "public"."question_responses"("questionId", "optionId");

-- CreateIndex
CREATE INDEX "questions_surveyId_idx" ON "public"."questions"("surveyId");

-- CreateIndex
CREATE INDEX "questions_teamId_idx" ON "public"."questions"("teamId");

-- CreateIndex
CREATE INDEX "questions_surveyId_order_idx" ON "public"."questions"("surveyId", "order");

-- CreateIndex
CREATE INDEX "questions_format_idx" ON "public"."questions"("format");

-- CreateIndex
CREATE INDEX "survey_response_summaries_surveyId_idx" ON "public"."survey_response_summaries"("surveyId");

-- CreateIndex
CREATE INDEX "survey_response_summaries_questionId_idx" ON "public"."survey_response_summaries"("questionId");

-- CreateIndex
CREATE INDEX "survey_response_summaries_teamId_idx" ON "public"."survey_response_summaries"("teamId");

-- CreateIndex
CREATE INDEX "survey_response_summaries_responseId_idx" ON "public"."survey_response_summaries"("responseId");

-- CreateIndex
CREATE INDEX "survey_response_summaries_optionId_idx" ON "public"."survey_response_summaries"("optionId");

-- CreateIndex
CREATE INDEX "survey_response_summaries_questionFormat_idx" ON "public"."survey_response_summaries"("questionFormat");

-- CreateIndex
CREATE INDEX "survey_response_summaries_lastUpdated_idx" ON "public"."survey_response_summaries"("lastUpdated");

-- CreateIndex
CREATE INDEX "survey_responses_surveyId_idx" ON "public"."survey_responses"("surveyId");

-- CreateIndex
CREATE INDEX "survey_responses_teamId_idx" ON "public"."survey_responses"("teamId");

-- CreateIndex
CREATE INDEX "survey_responses_status_idx" ON "public"."survey_responses"("status");

-- CreateIndex
CREATE INDEX "survey_responses_userId_idx" ON "public"."survey_responses"("userId");

-- CreateIndex
CREATE INDEX "survey_responses_submittedAt_idx" ON "public"."survey_responses"("submittedAt");

-- CreateIndex
CREATE INDEX "survey_responses_surveyId_status_idx" ON "public"."survey_responses"("surveyId", "status");

-- CreateIndex
CREATE INDEX "survey_responses_teamId_status_idx" ON "public"."survey_responses"("teamId", "status");

-- CreateIndex
CREATE INDEX "survey_types_teamId_idx" ON "public"."survey_types"("teamId");

-- CreateIndex
CREATE INDEX "survey_types_isDefault_idx" ON "public"."survey_types"("isDefault");

-- CreateIndex
CREATE INDEX "survey_types_name_idx" ON "public"."survey_types"("name");

-- CreateIndex
CREATE INDEX "surveys_teamId_idx" ON "public"."surveys"("teamId");

-- CreateIndex
CREATE INDEX "surveys_typeId_idx" ON "public"."surveys"("typeId");

-- CreateIndex
CREATE INDEX "surveys_status_idx" ON "public"."surveys"("status");

-- CreateIndex
CREATE INDEX "surveys_createdAt_idx" ON "public"."surveys"("createdAt");

-- CreateIndex
CREATE INDEX "surveys_teamId_status_idx" ON "public"."surveys"("teamId", "status");

-- CreateIndex
CREATE INDEX "team_members_userId_idx" ON "public"."team_members"("userId");

-- CreateIndex
CREATE INDEX "team_members_teamId_idx" ON "public"."team_members"("teamId");

-- CreateIndex
CREATE INDEX "team_members_teamMemberStatus_idx" ON "public"."team_members"("teamMemberStatus");

-- CreateIndex
CREATE INDEX "team_members_isAdmin_idx" ON "public"."team_members"("isAdmin");

-- CreateIndex
CREATE INDEX "team_members_isOwner_idx" ON "public"."team_members"("isOwner");

-- CreateIndex
CREATE INDEX "teams_token_idx" ON "public"."teams"("token");

-- CreateIndex
CREATE INDEX "teams_createdAt_idx" ON "public"."teams"("createdAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "public"."users"("phone");

-- CreateIndex
CREATE INDEX "users_resetPasswordToken_idx" ON "public"."users"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "users_confirmationToken_idx" ON "public"."users"("confirmationToken");

-- CreateIndex
CREATE INDEX "users_defaultTeamId_idx" ON "public"."users"("defaultTeamId");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");
