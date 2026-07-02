export type SurveyDeliveryMode = "inline" | "hosted" | "both"
export type SurveyStatus = "draft" | "active" | "archived"
export type SurveyQuestionType =
  | "rating"
  | "nps"
  | "single_choice"
  | "multi_choice"
  | "text"
  | "scale"

export type SurveySentByType = "agent" | "bot" | "system"
export type SurveyResponseStatus = "sent" | "in_progress" | "completed" | "expired"
export type SurveyResponseDeliveryMode = "inline" | "hosted"

export type SurveyQuestionOption = {
  label: string
  value: string
}

export type SurveyQuestion = {
  id: string
  type: SurveyQuestionType
  prompt: string
  required: boolean
  options?: SurveyQuestionOption[]
  scaleMin?: number
  scaleMax?: number
}

export type SurveyMetricsConfig = {
  showAverage: boolean
  showNps: boolean
  showDistribution: boolean
}

export type SurveyTriggers = {
  onConversationClose: boolean
  onEscalation: boolean
  proactiveOffer: boolean
  closeKeywords: string[]
}

export const DEFAULT_SURVEY_TRIGGERS: SurveyTriggers = {
  onConversationClose: false,
  onEscalation: false,
  proactiveOffer: false,
  closeKeywords: ["resolved", "thank you", "obrigado"],
}

export type SurveyAnswer = {
  questionId: string
  value: string | number
}
