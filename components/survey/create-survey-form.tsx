"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SurveyDetailsSection } from "@/components/survey/survey-details-section"
import { QuestionsSection } from "@/components/survey/questions-section"
import { StyleSection } from "@/components/survey/style-section"

export const CreateSurveyForm = () => {
    const t = useTranslations("CreateSurvey")
    const [surveyData, setSurveyData] = useState({
        name: "",
        type: "",
        enabled: true,
        allowMultipleResponses: true,
        questions: [
            {
                id: 1,
                title: "",
                description: "",
                format: "Yes/No",
                required: false,
                options: [] as string[]
            }
        ],
        targets: [],
        style: {
            backgroundColor: "transparent",
            textColor: "#222222",
            buttonBackgroundColor: "#222222",
            buttonTextColor: "#ffffff",
            margin: "16px 0px",
            padding: "16px",
            borderRadius: "6px",
            titleFontSize: "18px",
            bodyFontSize: "16px",
            fontFamily: "Inter"
        }
    })

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log("Saving survey:", surveyData)
    }

    const handlePublish = () => {
        // TODO: Implement publish functionality
        console.log("Publishing survey:", surveyData)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="space-y-2">
                <p className="text-muted-foreground">{t("description")}</p>
            </div>

            {/* Survey Details Section */}
            <SurveyDetailsSection
                data={surveyData}
                onChange={(data) => setSurveyData({ ...surveyData, ...data })}
            />

            {/* Questions Section */}
            <QuestionsSection
                questions={surveyData.questions}
                onChange={(questions) => setSurveyData({ ...surveyData, questions })}
            />

            {/* Style Section */}
            <StyleSection
                style={surveyData.style}
                onChange={(style) => setSurveyData({ ...surveyData, style })}
            />

            {/* Action Buttons */}
            <Card className="border-none px-0 pt-4">
                <CardContent className="pt-6 p-0">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button variant="outline" onClick={handleSave}>
                            {t("actions.saveDraft")}
                        </Button>
                        <Button onClick={handlePublish}>
                            {t("actions.publish")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
