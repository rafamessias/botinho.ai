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
        description?: string
        typeId?: string
        status: 'draft' | 'published' | 'archived'
        allowMultipleResponses: boolean
    }
    onChange: (data: Partial<SurveyDetailsSectionProps['data']>) => void
    surveyTypesData: SurveyType[]
}

export const SurveyDetailsSection = ({ data, onChange, surveyTypesData }: SurveyDetailsSectionProps) => {
    const t = useTranslations("CreateSurvey.details")
    const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
    const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>(surveyTypesData)
    const [isLoading, setIsLoading] = useState(false)

    const handleTypeSelect = (typeId: string) => {
        onChange({ typeId })
    }

    const handleSurveyTypesChange = (types: SurveyType[]) => {
        setSurveyTypes(types)
    }

    return (
        <>
            <Card className="border-none p-0 shadow-none">
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

                    {/* Survey Description */}
                    <div className="space-y-2">
                        <Label htmlFor="survey-description">{t("description.label")}</Label>
                        <Input
                            id="survey-description"
                            placeholder={t("description.placeholder")}
                            value={data.description || ""}
                            onChange={(e) => onChange({ description: e.target.value })}
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
                            value={data.typeId || ""}
                            onValueChange={handleTypeSelect}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="cursor-pointer">
                                <SelectValue placeholder={isLoading ? "Loading..." : t("type.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                {surveyTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id} className="cursor-pointer">
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Survey Status */}
                    <div className="space-y-2">
                        <Label htmlFor="survey-status">{t("status.label")}</Label>
                        <Select
                            value={data.status}
                            onValueChange={(status) => onChange({ status: status as 'draft' | 'published' | 'archived' })}
                        >
                            <SelectTrigger className="cursor-pointer">
                                <SelectValue placeholder={t("status.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft" className="cursor-pointer">
                                    {t("status.draft")}
                                </SelectItem>
                                <SelectItem value="published" className="cursor-pointer">
                                    {t("status.published")}
                                </SelectItem>
                                <SelectItem value="archived" className="cursor-pointer">
                                    {t("status.archived")}
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                selectedTypeId={data.typeId}
                onTypeSelect={handleTypeSelect}
            />
        </>
    )
}
