"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SurveyDetailsSection } from "@/components/survey/survey-details-section"
import { QuestionsSection } from "@/components/survey/questions-section"
import { StyleSection } from "@/components/survey/style-section"
import { updateSurvey } from "@/components/server-actions/survey"
import { toast } from "sonner"
import { QuestionFormat, SurveyType } from "@/lib/generated/prisma"
import { ArrowLeft, Clipboard } from "lucide-react"

interface Question {
    id: string
    title: string
    description: string
    format: QuestionFormat
    required: boolean
    order: number
    yesLabel?: string
    noLabel?: string
    buttonLabel?: string
    options: Array<{
        id?: string
        text: string
        order: number
        isOther?: boolean
    }>
}

export interface SurveyData {
    id: string
    name: string
    description: string
    typeId?: string
    status: 'draft' | 'published' | 'archived'
    allowMultipleResponses: boolean
    questions: Question[]
    style: {
        backgroundColor: string
        textColor: string
        buttonBackgroundColor: string
        buttonTextColor: string
        margin: string
        padding: string
        border: string
        borderRadius: string
        titleFontSize: string
        bodyFontSize: string
        fontFamily: string
        styleMode: 'basic' | 'advanced'
        advancedCSS?: string
    }
}

interface Survey {
    id: string
    name: string
    description: string | null
    typeId: string | null
    status: 'draft' | 'published' | 'archived'
    allowMultipleResponses: boolean
    questions: Array<{
        id: string
        title: string
        description: string | null
        format: QuestionFormat
        required: boolean
        order: number
        yesLabel: string | null
        noLabel: string | null
        buttonLabel: string | null
        options: Array<{
            id: string
            text: string
            order: number
            isOther: boolean
        }>
    }>
    style: {
        backgroundColor: string
        textColor: string
        buttonBackgroundColor: string
        buttonTextColor: string
        margin: string
        padding: string
        border: string
        borderRadius: string
        titleFontSize: string
        bodyFontSize: string
        fontFamily: string
        styleMode?: 'basic' | 'advanced'
        advancedCSS?: string
    } | null
}

interface EditSurveyFormProps {
    survey: Survey
    surveyTypes: SurveyType[]
}

export const EditSurveyForm = ({ survey, surveyTypes }: EditSurveyFormProps) => {
    const t = useTranslations("CreateSurvey")
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [pendingAction, setPendingAction] = useState<'save' | 'publish' | null>(null)

    const [surveyData, setSurveyData] = useState<SurveyData>({
        id: survey.id,
        name: survey.name,
        description: survey.description || "",
        typeId: survey.typeId || "",
        status: survey.status,
        allowMultipleResponses: survey.allowMultipleResponses,
        questions: survey.questions.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description || "",
            format: q.format,
            required: q.required,
            order: q.order,
            yesLabel: q.yesLabel || undefined,
            noLabel: q.noLabel || undefined,
            buttonLabel: q.buttonLabel || undefined,
            options: q.options.map(o => ({
                id: o.id,
                text: o.text,
                order: o.order,
                isOther: o.isOther
            }))
        })),
        style: survey.style ? {
            ...survey.style,
            styleMode: survey.style.styleMode || 'basic',
            advancedCSS: survey.style.advancedCSS || ''
        } : {
            backgroundColor: "",
            textColor: "",
            buttonBackgroundColor: "",
            buttonTextColor: "",
            margin: "16px 0px",
            padding: "16px",
            border: "1px solid #222222",
            borderRadius: "6px",
            titleFontSize: "18px",
            bodyFontSize: "16px",
            fontFamily: "",
            styleMode: "basic" as const,
            advancedCSS: ""
        }
    })

    const handleSave = () => {
        setPendingAction('save')
        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append("id", surveyData.id)
                formData.append("name", surveyData.name)
                formData.append("description", surveyData.description || "")
                formData.append("typeId", surveyData.typeId || "null")
                formData.append("status", surveyData.status)
                formData.append("allowMultipleResponses", surveyData.allowMultipleResponses.toString())
                formData.append("questions", JSON.stringify(surveyData.questions))
                formData.append("style", JSON.stringify(surveyData.style))

                const result = await updateSurvey(formData)
                if (result.success) {
                    toast.success(t("messages.saveSuccess"))
                    //router.push("/survey")
                } else {
                    console.log(result.error)
                    toast.error(t("messages.saveError"))
                }
            } catch (error) {
                console.log("error save", error)
                toast.error(t("messages.unexpectedError"))
            } finally {
                setPendingAction(null)
            }
        })
    }

    const handlePublish = () => {
        setPendingAction('publish')
        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append("id", surveyData.id)
                formData.append("name", surveyData.name)
                formData.append("description", surveyData.description || "")
                formData.append("typeId", surveyData.typeId || "null")
                formData.append("status", "published") // Always enable when publishing
                formData.append("allowMultipleResponses", surveyData.allowMultipleResponses.toString())
                formData.append("questions", JSON.stringify(surveyData.questions))
                formData.append("style", JSON.stringify(surveyData.style))

                const result = await updateSurvey(formData)

                if (result.success) {
                    toast.success(t("messages.publishSuccess"))
                    router.push("/survey")
                } else {
                    console.log(result.error)
                    toast.error(result.error || t("messages.publishError"))
                }
            } catch (error) {
                console.log(error)
                toast.error(t("messages.unexpectedError"))
            } finally {
                setPendingAction(null)
            }
        })
    }

    const handleCopySurveyId = async () => {
        await navigator.clipboard.writeText(surveyData.id)
        toast.success(t("messages.surveyIdCopied") || "Survey ID copied to clipboard")
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="space-y-2">
                <Button variant="outline" size="icon" onClick={() => router.push("/survey")}><ArrowLeft className="h-4 w-4" /></Button>
                <div className="flex flex-col items-start sm:items-center sm:flex-row">
                    <p className="flex items-center flex-row">Survey ID:</p>
                    <p
                        className="text-muted-foreground cursor-pointer select-all transition-colors hover:text-primary focus:text-primary outline-none sm:ml-2 flex items-center justify-center"
                        tabIndex={0}
                        aria-label={t("actions.copySurveyId") || "Copy Survey ID"}
                        onClick={handleCopySurveyId}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                handleCopySurveyId()
                            }
                        }}
                        role="button"
                    >
                        {surveyData.id} <Button variant="outline" size="icon" className="ml-2 flex items-center justify-center" onClick={handleCopySurveyId}><Clipboard className="h-4 w-4" /></Button>
                    </p>
                </div>
            </div>

            {/* Survey Details Section */}
            <SurveyDetailsSection
                data={surveyData}
                onChange={(data) => setSurveyData({ ...surveyData, ...data })}
                surveyTypesData={surveyTypes}
            />

            {/* Questions and Style Tabs */}
            <Tabs defaultValue="questions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="questions" className="cursor-pointer">{t("questions.title")}</TabsTrigger>
                    <TabsTrigger value="style" className="cursor-pointer">{t("style.title")}</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="mt-6">
                    <QuestionsSection
                        questions={surveyData.questions}
                        onChange={(questions) => setSurveyData({ ...surveyData, questions })}
                        expandAllQuestions={false}
                    />
                </TabsContent>

                <TabsContent value="style" className="mt-6">
                    <StyleSection
                        surveyData={surveyData as SurveyData}
                        style={surveyData.style}
                        onChange={(style) => setSurveyData({ ...surveyData, style: { ...surveyData.style, ...style } })}
                    />
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <Card className="border-none px-0 pt-4 shadow-none">
                <CardContent className="pt-6 p-0">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={isPending || !surveyData.name.trim() || !surveyData.status}
                        >
                            {pendingAction === 'save' ? t("actions.saving") : t("actions.saveDraft")}
                        </Button>
                        <Button
                            onClick={handlePublish}
                            disabled={isPending || !surveyData.name.trim() || surveyData.questions.length === 0 || !surveyData.status}
                        >
                            {pendingAction === 'publish' ? t("actions.publishing") : t("actions.publish")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
