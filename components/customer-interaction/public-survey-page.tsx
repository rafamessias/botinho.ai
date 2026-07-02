"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import {
  getPublicSurveyAction,
  submitPublicSurveyAction,
} from "@/components/server-actions/surveys"
import type { SurveyAnswer, SurveyQuestion } from "@/lib/types/survey"

type PublicSurveyPageProps = {
  accessToken: string
}

export default function PublicSurveyPage({ accessToken }: PublicSurveyPageProps) {
  const t = useTranslations("PublicSurvey")
  const [surveyName, setSurveyName] = useState("")
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [thankYouMessage, setThankYouMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("sent")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const result = await getPublicSurveyAction({ accessToken })
      if (!result.success || !result.data) {
        setError(result.error || t("errors.notFound"))
        setIsLoading(false)
        return
      }
      setSurveyName(result.data.surveyName)
      setQuestions(result.data.questions)
      setThankYouMessage(result.data.thankYouMessage ?? null)
      setStatus(result.data.status)
      setIsLoading(false)
    })()
  }, [accessToken, t])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const payload: SurveyAnswer[] = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] ?? "",
      }))

      const result = await submitPublicSurveyAction({ accessToken, answers: payload })
      if (!result.success) {
        setError(result.error || t("errors.submitFailed"))
        return
      }
      setStatus("completed")
      if (result.data?.thankYouMessage) {
        setThankYouMessage(result.data.thankYouMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && status !== "completed") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-center text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (status === "completed") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold">{t("completed.title")}</h1>
          <p className="text-muted-foreground">{thankYouMessage || t("completed.defaultMessage")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">{surveyName}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3 rounded-lg border p-4">
              <Label className="text-base">
                {index + 1}. {question.prompt}
                {question.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {(question.type === "rating" || question.type === "scale" || question.type === "nps") && (
                <Input
                  type="number"
                  min={question.type === "nps" ? 0 : (question.scaleMin ?? 1)}
                  max={question.type === "nps" ? 10 : (question.scaleMax ?? 5)}
                  value={answers[question.id] ?? ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [question.id]: Number(e.target.value) })
                  }
                />
              )}

              {question.type === "text" && (
                <Textarea
                  value={String(answers[question.id] ?? "")}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  rows={3}
                />
              )}

              {question.type === "single_choice" && question.options && (
                <RadioGroup
                  value={String(answers[question.id] ?? "")}
                  onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value || option.label} id={`${question.id}-${option.value}`} />
                      <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <Button className="w-full" onClick={() => void handleSubmit()} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t("submit")}
        </Button>
      </div>
    </div>
  )
}
