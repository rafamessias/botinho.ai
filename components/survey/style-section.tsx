"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Style {
    primaryColor: string
    fontFamily: string
    borderRadius: string
}

interface StyleSectionProps {
    style: Style
    onChange: (style: Style) => void
}

const fontFamilies = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Source Sans Pro"
]

const borderRadiusOptions = [
    { value: "0px", label: "None" },
    { value: "4px", label: "Small" },
    { value: "8px", label: "Medium" },
    { value: "12px", label: "Large" },
    { value: "16px", label: "Extra Large" }
]

export const StyleSection = ({ style, onChange }: StyleSectionProps) => {
    const t = useTranslations("CreateSurvey.style")

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Primary Color */}
                <div className="space-y-2">
                    <Label htmlFor="primary-color">{t("primaryColor.label")}</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="primary-color"
                            type="color"
                            value={style.primaryColor}
                            onChange={(e) => onChange({ ...style, primaryColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            value={style.primaryColor}
                            onChange={(e) => onChange({ ...style, primaryColor: e.target.value })}
                            placeholder="#3b82f6"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Font Family */}
                <div className="space-y-2">
                    <Label htmlFor="font-family">{t("fontFamily.label")}</Label>
                    <Select
                        value={style.fontFamily}
                        onValueChange={(value) => onChange({ ...style, fontFamily: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("fontFamily.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {fontFamilies.map((font) => (
                                <SelectItem key={font} value={font}>
                                    <span style={{ fontFamily: font }}>{font}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                    <Label htmlFor="border-radius">{t("borderRadius.label")}</Label>
                    <Select
                        value={style.borderRadius}
                        onValueChange={(value) => onChange({ ...style, borderRadius: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("borderRadius.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {borderRadiusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                    <Label>{t("preview.label")}</Label>
                    <div
                        className="p-4 border-2 border-dashed rounded-lg"
                        style={{
                            backgroundColor: style.primaryColor + "10",
                            borderColor: style.primaryColor + "30",
                            borderRadius: style.borderRadius,
                            fontFamily: style.fontFamily
                        }}
                    >
                        <div
                            className="text-sm font-medium mb-2"
                            style={{ color: style.primaryColor }}
                        >
                            {t("preview.title")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {t("preview.description")}
                        </div>
                        <div
                            className="mt-3 px-3 py-2 rounded text-sm font-medium text-white"
                            style={{
                                backgroundColor: style.primaryColor,
                                borderRadius: style.borderRadius
                            }}
                        >
                            {t("preview.button")}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
