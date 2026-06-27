"use client"

import { useTranslations } from "next-intl"
import { ChevronDown, Loader2, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SurveyView } from "@/components/server-actions/surveys"
import type { SurveyDeliveryMode, SurveyQuestion, SurveyQuestionType } from "@/lib/types/survey"
import { cn } from "@/lib/utils"

const QUESTION_TYPES: SurveyQuestionType[] = ["rating", "nps", "single_choice", "text", "scale"]

export const emptyQuestion = (): SurveyQuestion => ({
  id: crypto.randomUUID(),
  type: "rating",
  prompt: "",
  required: true,
  scaleMin: 1,
  scaleMax: 5,
})

type SurveyEditorFormProps = {
  editor: Partial<SurveyView>
  isSaving: boolean
  onChange: (editor: Partial<SurveyView>) => void
  onSave: () => void
}

export const SurveyEditorForm = ({ editor, isSaving, onChange, onSave }: SurveyEditorFormProps) => {
  const t = useTranslations("Surveys")

  const updateQuestion = (index: number, patch: Partial<SurveyQuestion>) => {
    const questions = [...(editor.questions ?? [])]
    questions[index] = { ...questions[index]!, ...patch }
    onChange({ ...editor, questions })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="survey-name">{t("fields.name")}</Label>
          <Input
            id="survey-name"
            value={editor.name ?? ""}
            onChange={(e) => onChange({ ...editor, name: e.target.value })}
            placeholder={t("fields.namePlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("fields.deliveryMode")}</Label>
          <Select
            value={editor.deliveryMode ?? "both"}
            onValueChange={(value) => onChange({ ...editor, deliveryMode: value as SurveyDeliveryMode })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inline">{t("deliveryMode.inline")}</SelectItem>
              <SelectItem value="hosted">{t("deliveryMode.hosted")}</SelectItem>
              <SelectItem value="both">{t("deliveryMode.both")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 self-end pb-1">
          <Switch
            checked={editor.status === "active"}
            onCheckedChange={(checked) => onChange({ ...editor, status: checked ? "active" : "draft" })}
          />
          <Label>{t("fields.active")}</Label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("fields.questions")}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...editor,
                questions: [...(editor.questions ?? []), emptyQuestion()],
              })
            }
          >
            <Plus className="mr-1 h-3 w-3" />
            {t("actions.addQuestion")}
          </Button>
        </div>

        {(editor.questions ?? []).length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t("editor.noQuestions")}
          </div>
        ) : (
          (editor.questions ?? []).map((question, index) => (
            <div key={question.id} className="rounded-lg border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{t("fields.question", { number: index + 1 })}</span>
                {(editor.questions?.length ?? 0) > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() =>
                      onChange({
                        ...editor,
                        questions: editor.questions?.filter((_, i) => i !== index),
                      })
                    }
                  >
                    {t("actions.remove")}
                  </Button>
                )}
              </div>
              <Select
                value={question.type}
                onValueChange={(value) => updateQuestion(index, { type: value as SurveyQuestionType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`questionTypes.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={question.prompt}
                onChange={(e) => updateQuestion(index, { prompt: e.target.value })}
                placeholder={t("fields.questionPrompt")}
                rows={2}
              />
              {question.type === "single_choice" && (
                <Input
                  value={question.options?.map((o) => o.label).join(", ") ?? ""}
                  onChange={(e) =>
                    updateQuestion(index, {
                      options: e.target.value
                        .split(",")
                        .map((label) => label.trim())
                        .filter(Boolean)
                        .map((label) => ({ label, value: label })),
                    })
                  }
                  placeholder={t("fields.optionsPlaceholder")}
                />
              )}
            </div>
          ))
        )}
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
            <span className="text-sm font-medium">{t("editor.advanced")}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className={cn("space-y-4 pt-2")}>
          <div className="space-y-2">
            <Label htmlFor="survey-description">{t("fields.description")}</Label>
            <Textarea
              id="survey-description"
              value={editor.description ?? ""}
              onChange={(e) => onChange({ ...editor, description: e.target.value })}
              rows={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="intro-message">{t("fields.introMessage")}</Label>
              <Textarea
                id="intro-message"
                value={editor.introMessage ?? ""}
                onChange={(e) => onChange({ ...editor, introMessage: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thank-you">{t("fields.thankYouMessage")}</Label>
              <Textarea
                id="thank-you"
                value={editor.thankYouMessage ?? ""}
                onChange={(e) => onChange({ ...editor, thankYouMessage: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex justify-end border-t pt-4">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {t("actions.save")}
        </Button>
      </div>
    </div>
  )
}
