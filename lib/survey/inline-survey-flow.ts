import type { SurveyAnswer, SurveyQuestion } from "@/lib/types/survey"

export type ParseAnswerResult =
  | { ok: true; value: string | number }
  | { ok: false; error: string }

export const parseSurveyAnswer = (
  question: SurveyQuestion,
  reply: string,
): ParseAnswerResult => {
  const trimmed = reply.trim()
  if (!trimmed) {
    return { ok: false, error: "empty" }
  }

  switch (question.type) {
    case "rating":
    case "scale": {
      const num = Number(trimmed)
      const min = question.scaleMin ?? 1
      const max = question.scaleMax ?? 5
      if (Number.isNaN(num) || num < min || num > max) {
        return { ok: false, error: "invalid_range" }
      }
      return { ok: true, value: num }
    }

    case "nps": {
      const num = Number(trimmed)
      if (Number.isNaN(num) || num < 0 || num > 10 || !Number.isInteger(num)) {
        return { ok: false, error: "invalid_nps" }
      }
      return { ok: true, value: num }
    }

    case "single_choice": {
      const options = question.options ?? []
      const index = Number(trimmed)
      if (!Number.isNaN(index) && index >= 1 && index <= options.length) {
        const option = options[index - 1]!
        return { ok: true, value: option.value || option.label }
      }
      const match = options.find(
        (opt) => opt.label.toLowerCase() === trimmed.toLowerCase() || opt.value.toLowerCase() === trimmed.toLowerCase(),
      )
      if (match) return { ok: true, value: match.value || match.label }
      return { ok: false, error: "invalid_choice" }
    }

    case "text": {
      if (trimmed.length > 2000) {
        return { ok: false, error: "too_long" }
      }
      return { ok: true, value: trimmed }
    }

    case "multi_choice":
      return { ok: true, value: trimmed }

    default:
      return { ok: false, error: "unsupported" }
  }
}

export const getInvalidAnswerMessage = (question: SurveyQuestion, error: string, locale: "en" | "pt-BR"): string => {
  const isPt = locale === "pt-BR"

  if (error === "invalid_range") {
    const min = question.scaleMin ?? 1
    const max = question.scaleMax ?? 5
    return isPt
      ? `Por favor, responda com um número de ${min} a ${max}.`
      : `Please reply with a number from ${min} to ${max}.`
  }

  if (error === "invalid_nps") {
    return isPt
      ? "Por favor, responda com um número de 0 a 10."
      : "Please reply with a number from 0 to 10."
  }

  if (error === "invalid_choice") {
    return isPt
      ? "Por favor, escolha uma das opções listadas."
      : "Please choose one of the listed options."
  }

  return isPt ? "Resposta inválida. Tente novamente." : "Invalid answer. Please try again."
}

export const mergeAnswer = (answers: SurveyAnswer[], newAnswer: SurveyAnswer): SurveyAnswer[] => {
  const filtered = answers.filter((a) => a.questionId !== newAnswer.questionId)
  return [...filtered, newAnswer]
}

export const validateHostedAnswers = (
  questions: SurveyQuestion[],
  answers: SurveyAnswer[],
): { ok: true } | { ok: false; error: string } => {
  for (const question of questions) {
    if (!question.required) continue
    const answer = answers.find((a) => a.questionId === question.id)
    if (!answer || String(answer.value).trim() === "") {
      return { ok: false, error: `missing:${question.id}` }
    }
  }
  return { ok: true }
}
