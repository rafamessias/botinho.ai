"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                    {/* Font Family */}
                    <div className="space-y-2">
                        <Label htmlFor="font-family">{t("fontFamily.label")}</Label>
                        <Input
                            id="font-family"
                            value={style.fontFamily}
                            onChange={(e) => onChange({ ...style, fontFamily: e.target.value })}
                            placeholder="Arial, sans-serif"
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Live Preview */}
            <Card className="border-none px-0 pt-4 shadow-none">
                <CardHeader className="p-0">
                    <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div
                        className="p-4 rounded-lg border-2 border-dashed border-gray-300"
                        style={{
                            backgroundColor: style.backgroundColor === "transparent" ? "transparent" : style.backgroundColor,
                            color: style.textColor,
                            margin: style.margin || "16px 0px",
                            padding: style.padding || "16px",
                            border: style.border || "1px solid #222222",
                            borderRadius: style.borderRadius || "6px",
                            fontFamily: style.fontFamily || "Arial, sans-serif"
                        }}
                    >
                        <h3
                            className="font-semibold mb-3"
                            style={{
                                fontSize: style.titleFontSize || "18px",
                                fontFamily: style.fontFamily || "Arial, sans-serif"
                            }}
                        >
                            How satisfied are you with our service?
                        </h3>
                        <p
                            className="mb-4"
                            style={{
                                fontSize: style.bodyFontSize || "16px",
                                fontFamily: style.fontFamily || "Arial, sans-serif"
                            }}
                        >
                            This is a preview of how your survey will look with the current styling applied.
                        </p>

                        {/* Single Selection Question Preview */}
                        <div className="mb-6">
                            <RadioGroup defaultValue="satisfied" >
                                {[
                                    { id: "very-satisfied", text: "Very satisfied" },
                                    { id: "satisfied", text: "Satisfied" },
                                    { id: "neutral", text: "Neutral" },
                                    { id: "dissatisfied", text: "Dissatisfied" }
                                ].map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={option.id}
                                            id={option.id}
                                            style={{
                                                accentColor: style.buttonBackgroundColor === "transparent" ? "#222222" : style.buttonBackgroundColor
                                            }}
                                        />
                                        <Label
                                            htmlFor={option.id}
                                            className="text-base cursor-pointer"
                                            style={{
                                                fontFamily: style.fontFamily || "Arial, sans-serif",
                                                fontSize: style.bodyFontSize || "16px"
                                            }}
                                        >
                                            {option.text}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <button
                            className="px-4 py-2 rounded font-medium"
                            style={{
                                backgroundColor: style.buttonBackgroundColor === "transparent" ? "transparent" : style.buttonBackgroundColor,
                                color: style.buttonTextColor,
                                border: style.buttonBackgroundColor === "transparent" ? "1px solid #222222" : "none",
                                borderRadius: style.borderRadius || "6px",
                                fontFamily: style.fontFamily || "Arial, sans-serif"
                            }}
                        >
                            Submit Survey
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
