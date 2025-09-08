"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Style {
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
}

interface StyleSectionProps {
    style: Style
    onChange: (style: Style) => void
}

export const StyleSection = ({ style, onChange }: StyleSectionProps) => {
    const t = useTranslations("CreateSurvey.style")

    return (
        <Card className="border-none px-0 pt-4 shadow-none">
            <CardHeader className="p-0">
                <div className="flex items-center justify-between">
                    <CardTitle>{t("title")}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
                {/* Background Colour */}
                <div className="space-y-2">
                    <Label htmlFor="background-color">{t("backgroundColor.label")}</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="background-color"
                            type="color"
                            value={style.backgroundColor === "transparent" ? "#ffffff" : style.backgroundColor}
                            onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            value={style.backgroundColor}
                            onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                            placeholder="transparent"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Text Colour */}
                <div className="space-y-2">
                    <Label htmlFor="text-color">{t("textColor.label")}</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="text-color"
                            type="color"
                            value={style.textColor}
                            onChange={(e) => onChange({ ...style, textColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            value={style.textColor}
                            onChange={(e) => onChange({ ...style, textColor: e.target.value })}
                            placeholder="#222222"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Button Background Colour */}
                <div className="space-y-2">
                    <Label htmlFor="button-background-color">{t("buttonBackgroundColor.label")}</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="button-background-color"
                            type="color"
                            value={style.buttonBackgroundColor === "transparent" ? "#ffffff" : style.buttonBackgroundColor}
                            onChange={(e) => onChange({ ...style, buttonBackgroundColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            value={style.buttonBackgroundColor}
                            onChange={(e) => onChange({ ...style, buttonBackgroundColor: e.target.value })}
                            placeholder="#222222"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Button Text Colour */}
                <div className="space-y-2">
                    <Label htmlFor="button-text-color">{t("buttonTextColor.label")}</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="button-text-color"
                            type="color"
                            value={style.buttonTextColor === "transparent" ? "#ffffff" : style.buttonTextColor}
                            onChange={(e) => onChange({ ...style, buttonTextColor: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            value={style.buttonTextColor}
                            onChange={(e) => onChange({ ...style, buttonTextColor: e.target.value })}
                            placeholder="#ffffff"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Margin */}
                <div className="space-y-2">
                    <Label htmlFor="margin">{t("margin.label")}</Label>
                    <Input
                        id="margin"
                        value={style.margin}
                        onChange={(e) => onChange({ ...style, margin: e.target.value })}
                        placeholder="16px 0px"
                        className="w-full"
                    />
                </div>

                {/* Padding */}
                <div className="space-y-2">
                    <Label htmlFor="padding">{t("padding.label")}</Label>
                    <Input
                        id="padding"
                        value={style.padding}
                        onChange={(e) => onChange({ ...style, padding: e.target.value })}
                        placeholder="16px"
                        className="w-full"
                    />
                </div>

                {/* Border */}

                <div className="space-y-2">
                    <Label htmlFor="border">{t("border.label")}</Label>
                    <Input
                        id="border"
                        value={style.border}
                        onChange={(e) => onChange({ ...style, border: e.target.value })}
                        placeholder="1px solid #222222"
                        className="w-full"
                    />
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                    <Label htmlFor="border-radius">{t("borderRadius.label")}</Label>
                    <Input
                        id="border-radius"
                        value={style.borderRadius}
                        onChange={(e) => onChange({ ...style, borderRadius: e.target.value })}
                        placeholder="6px"
                        className="w-full"
                    />
                </div>

                {/* Title Font Size */}
                <div className="space-y-2">
                    <Label htmlFor="title-font-size">{t("titleFontSize.label")}</Label>
                    <Input
                        id="title-font-size"
                        value={style.titleFontSize}
                        onChange={(e) => onChange({ ...style, titleFontSize: e.target.value })}
                        placeholder="18px"
                        className="w-full"
                    />
                </div>

                {/* Body Font Size */}
                <div className="space-y-2">
                    <Label htmlFor="body-font-size">{t("bodyFontSize.label")}</Label>
                    <Input
                        id="body-font-size"
                        value={style.bodyFontSize}
                        onChange={(e) => onChange({ ...style, bodyFontSize: e.target.value })}
                        placeholder="16px"
                        className="w-full"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
