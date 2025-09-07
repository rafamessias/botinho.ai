"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface SurveyDetailsSectionProps {
    data: {
        name: string
        enabled: boolean
        allowMultipleResponses: boolean
    }
    onChange: (data: Partial<SurveyDetailsSectionProps['data']>) => void
}

export const SurveyDetailsSection = ({ data, onChange }: SurveyDetailsSectionProps) => {
    const t = useTranslations("CreateSurvey.details")

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Survey Name */}
                <div className="space-y-2">
                    <Label htmlFor="survey-name">{t("name.label")}</Label>
                    <Input
                        id="survey-name"
                        placeholder={t("name.placeholder")}
                        value={data.name}
                        onChange={(e) => onChange({ name: e.target.value })}
                    />
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
    )
}
