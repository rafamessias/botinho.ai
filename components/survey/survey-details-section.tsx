"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Settings } from "lucide-react"
import { SurveyTypesModal, SurveyType } from "./survey-types-modal"

interface SurveyDetailsSectionProps {
    data: {
        name: string
        type: string
        enabled: boolean
        allowMultipleResponses: boolean
    }
    onChange: (data: Partial<SurveyDetailsSectionProps['data']>) => void
}

export const SurveyDetailsSection = ({ data, onChange }: SurveyDetailsSectionProps) => {
    const t = useTranslations("CreateSurvey.details")
    const tTypes = useTranslations("CreateSurvey.surveyTypes")
    const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)

    // Dummy survey types data
    const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>([
        {
            id: "customer-feedback",
            name: tTypes("defaultTypes.customerFeedback"),
            isDefault: true,
        },
        {
            id: "internal",
            name: tTypes("defaultTypes.internal"),
            isDefault: true,
        },
        {
            id: "market-research",
            name: tTypes("defaultTypes.marketResearch"),
            isDefault: true,
        },
        {
            id: "employee-satisfaction",
            name: tTypes("defaultTypes.employeeSatisfaction"),
            isDefault: true,
        },
        {
            id: "product-feedback",
            name: tTypes("defaultTypes.productFeedback"),
            isDefault: true,
        },
        {
            id: "event-feedback",
            name: tTypes("defaultTypes.eventFeedback"),
            isDefault: true,
        },
    ])

    const handleTypeSelect = (typeId: string) => {
        onChange({ type: typeId })
    }

    const handleSurveyTypesChange = (types: SurveyType[]) => {
        setSurveyTypes(types)
    }

    const selectedType = surveyTypes.find(type => type.id === data.type)

    return (
        <>
            <Card className="border-none p-0">
                <CardHeader className="p-0">
                    <CardTitle>{t("title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                    {/* Survey Name */}
                    <div className="space-y-2">
                        <Label htmlFor="survey-name">{t("name.label")}</Label>
                        <Input
                            autoFocus
                            id="survey-name"
                            placeholder={t("name.placeholder")}
                            value={data.name}
                            onChange={(e) => onChange({ name: e.target.value })}
                        />
                    </div>

                    {/* Survey Type */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="survey-type">{t("type.label")}</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsTypesModalOpen(true)}
                                className="h-8 px-2 text-xs"
                            >
                                <Settings className="h-3 w-3 mr-1" />
                                {t("type.manageTypes")}
                            </Button>
                        </div>
                        <Select
                            value={data.type}
                            onValueChange={handleTypeSelect}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("type.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                {surveyTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Enable Survey Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="enable-survey">{t("enabled.label")}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t("enabled.description")}
                            </p>
                        </div>
                        <Switch
                            id="enable-survey"
                            checked={data.enabled}
                            onCheckedChange={(checked) => onChange({ enabled: checked })}
                        />
                    </div>

                    {/* Allow Multiple Responses Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="multiple-responses">{t("multipleResponses.label")}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t("multipleResponses.description")}
                            </p>
                        </div>
                        <Switch
                            id="multiple-responses"
                            checked={data.allowMultipleResponses}
                            onCheckedChange={(checked) => onChange({ allowMultipleResponses: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Survey Types Management Modal */}
            <SurveyTypesModal
                isOpen={isTypesModalOpen}
                onClose={() => setIsTypesModalOpen(false)}
                surveyTypes={surveyTypes}
                onSurveyTypesChange={handleSurveyTypesChange}
                selectedTypeId={data.type}
                onTypeSelect={handleTypeSelect}
            />
        </>
    )
}
