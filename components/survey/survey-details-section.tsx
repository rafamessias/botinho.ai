"use client"

import { useState, useCallback, useRef, useEffect, memo } from "react"
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
    readonly?: boolean
}

// Debounced Input Component
const DebouncedInput = memo(({
    value,
    onChange,
    delay = 300,
    readonly = false,
    ...props
}: {
    value: string
    onChange: (value: string) => void
    delay?: number
    readonly?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
    const [localValue, setLocalValue] = useState(value)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (readonly) return

        const newValue = e.target.value
        setLocalValue(newValue)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            onChange(newValue)
        }, delay)
    }, [onChange, delay, readonly])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return <Input {...props} value={localValue} onChange={handleChange} readOnly={readonly} />
})

export const SurveyDetailsSection = memo(({ data, onChange, surveyTypesData, readonly = false }: SurveyDetailsSectionProps) => {
    const t = useTranslations("CreateSurvey.details")
    const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
    const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>(surveyTypesData)
    const [isLoading, setIsLoading] = useState(false)

    const handleTypeSelect = useCallback((typeId: string) => {
        onChange({ typeId })
    }, [onChange])

    const handleSurveyTypesChange = useCallback((types: SurveyType[]) => {
        setSurveyTypes(types)
    }, [])

    const handleNameChange = useCallback((name: string) => {
        onChange({ name })
    }, [onChange])

    const handleDescriptionChange = useCallback((description: string) => {
        onChange({ description })
    }, [onChange])

    return (
        <>
            <Card className="border-none p-0 shadow-none bg-transparent">
                <CardHeader className="p-0">
                    <CardTitle>{t("title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                    {/* Survey Name */}
                    <div className="space-y-2">
                        <Label htmlFor="survey-name">{t("name.label")}</Label>
                        <DebouncedInput
                            autoFocus={!readonly}
                            id="survey-name"
                            placeholder={t("name.placeholder")}
                            value={data.name}
                            onChange={handleNameChange}
                            readonly={readonly}
                        />
                    </div>

                    {/* Survey Description */}
                    <div className="space-y-2">
                        <Label htmlFor="survey-description">{t("description.label")}</Label>
                        <DebouncedInput
                            id="survey-description"
                            placeholder={t("description.placeholder")}
                            value={data.description || ""}
                            onChange={handleDescriptionChange}
                            readonly={readonly}
                        />
                    </div>

                    {/* Survey Type */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="survey-type">{t("type.label")}</Label>
                            {!readonly && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsTypesModalOpen(true)}
                                    className="h-8 px-2 text-xs"
                                >
                                    <Settings className="h-3 w-3 mr-1" />
                                    {t("type.manageTypes")}
                                </Button>
                            )}
                        </div>
                        <Select
                            value={data.typeId || ""}
                            onValueChange={handleTypeSelect}
                            disabled={isLoading || readonly}
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
                            disabled={readonly}
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
                    {/*
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
                            disabled={readonly}
                        />
                    </div>
                    */}
                </CardContent>
            </Card>

            {/* Survey Types Management Modal */}
            {!readonly && (
                <SurveyTypesModal
                    isOpen={isTypesModalOpen}
                    onClose={() => setIsTypesModalOpen(false)}
                    surveyTypes={surveyTypes}
                    onSurveyTypesChange={handleSurveyTypesChange}
                    selectedTypeId={data.typeId}
                    onTypeSelect={handleTypeSelect}
                />
            )}
        </>
    )
})

SurveyDetailsSection.displayName = "SurveyDetailsSection"
