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
import { TargetsSection } from "@/components/survey/targets-section"
import { StyleSection } from "@/components/survey/style-section"

export const CreateSurveyForm = () => {
    const t = useTranslations("CreateSurvey")
    const [surveyData, setSurveyData] = useState({
        name: "",
        enabled: true,
        allowMultipleResponses: true,
        questions: [
            {
                id: 1,
                title: "",
                description: "",
                format: "Multiple Choice",
                required: false,
                options: []
            }
        ],
        targets: [],
        style: {
            primaryColor: "#3b82f6",
            fontFamily: "Inter",
            borderRadius: "8px"
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
        <div className="px-4 lg:px-6 max-w-4xl space-y-6">
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

            {/* Targets Section */}
            <TargetsSection
                targets={surveyData.targets}
                onChange={(targets) => setSurveyData({ ...surveyData, targets })}
            />

            {/* Style Section */}
            <StyleSection
                style={surveyData.style}
                onChange={(style) => setSurveyData({ ...surveyData, style })}
            />

            {/* Action Buttons */}
            <Card>
                <CardContent className="pt-6">
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
