"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Script from "next/script"

// Extend window interface for the survey widget
declare global {
    interface Window {
        initSurveyWidget: (config: {
            surveyData: any
            customCSS?: string
            onComplete?: (responses: any) => void
            onClose?: () => void
            autoClose?: number
        }) => {
            mount: (containerId: string) => void
        }
    }
}

interface CreateSurveyData {
    id?: string
    name: string
    description: string
    typeId?: string
    status: 'draft' | 'published' | 'archived'
    allowMultipleResponses: boolean
    questions: any[]
    style: Style
}

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
    surveyData: CreateSurveyData
}

export const StyleSection = ({ style, onChange, surveyData }: StyleSectionProps) => {
    const t = useTranslations("CreateSurvey.style")
    const previewRef = useRef<HTMLDivElement>(null)
    const widgetRef = useRef<any>(null)

    // Sample survey data for preview
    const sampleSurvey = {
        id: 'preview-' + Date.now(),
        questions: [
            {
                id: 'q1',
                title: surveyData.name || 'Sample Survey',
                description: surveyData.description || 'This is a preview of how your survey will look with the current styling.',
                format: 'SINGLE_CHOICE' as const,
                required: true,
                options: [
                    { id: 'opt1', text: 'Option 1', isOther: false },
                    { id: 'opt2', text: 'Option 2', isOther: false },
                    { id: 'opt3', text: 'Other', isOther: true }
                ]
            },
            {
                id: 'q2',
                title: 'Rate your experience',
                description: 'How would you rate this preview?',
                format: 'STAR_RATING' as const,
                required: false
            }
        ]
    }

    // Generate custom CSS based on current style
    const generateCustomCSS = () => {
        return `
            .sv {
                background: ${style.backgroundColor === 'transparent' ? 'transparent' : style.backgroundColor} !important;
                color: ${style.textColor} !important;
                margin: ${style.margin} !important;
                padding: ${style.padding} !important;
                border: ${style.border} !important;
                border-radius: ${style.borderRadius} !important;
                font-family: ${style.fontFamily} !important;
                width: 300px !important;
            }
            .qt {
                font-size: ${style.titleFontSize} !important;
                color: ${style.textColor} !important;
                font-family: ${style.fontFamily} !important;
            }
            .qd, .qs {
                font-size: ${style.bodyFontSize} !important;
                color: ${style.textColor} !important;
                font-family: ${style.fontFamily} !important;
            }
            .btn, .btnp {
                background: ${style.buttonBackgroundColor === 'transparent' ? 'transparent' : style.buttonBackgroundColor} !important;
                color: ${style.buttonTextColor} !important;
                border: 1px solid ${style.buttonBackgroundColor === 'transparent' ? style.textColor : style.buttonBackgroundColor} !important;
                font-family: ${style.fontFamily} !important;
            }
            .btn:hover, .btnp:hover {
                opacity: 0.8 !important;
            }
            .txt, .ta {
                color: ${style.textColor} !important;
                border-color: ${style.textColor} !important;
                font-family: ${style.fontFamily} !important;
                background: transparent !important;
            }
            .rad, .chk {
                color: ${style.textColor} !important;
                font-family: ${style.fontFamily} !important;
            }
        `
    }

    // Initialize/update preview widget
    const initializePreview = () => {
        if (typeof window === 'undefined' || !previewRef.current) return

        if (!window.initSurveyWidget) {
            previewRef.current.innerHTML = `
                <div class="text-gray-500 dark:text-gray-400 text-center">
                    <p>Widget not loaded yet...</p>
                    <p class="text-sm mt-2">Please wait for the script to load.</p>
                </div>
            `
            return
        }

        // Clean up existing widget
        if (widgetRef.current) {
            previewRef.current.innerHTML = ''
        }

        // Create container with unique ID
        const containerId = 'survey-preview-' + Date.now()
        previewRef.current.innerHTML = `<div id="${containerId}"></div>`

        // Initialize new widget
        try {
            widgetRef.current = window.initSurveyWidget({
                surveyData: sampleSurvey,
                customCSS: generateCustomCSS(),
                onComplete: (responses: any) => {
                    console.log('Preview completed:', responses)
                    // Optionally reset the preview after a delay
                    setTimeout(() => initializePreview(), 2000)
                },
                onClose: () => {
                    console.log('Preview closed')
                    // Reset the preview when closed
                    setTimeout(() => initializePreview(), 500)
                }
            })

            widgetRef.current.mount(containerId)
        } catch (error) {
            console.error('Error initializing preview widget:', error)
            previewRef.current.innerHTML = `
                <div class="text-red-500 dark:text-red-400 text-center">
                    <p>Error loading preview</p>
                    <p class="text-sm mt-2">Please check the console for details.</p>
                </div>
            `
        }
    }

    // Update preview when style changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            initializePreview()
        }, 300) // Debounce updates

        return () => clearTimeout(timeoutId)
    }, [style, surveyData.name, surveyData.description])

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
                    <div className="flex items-center justify-between">
                        <CardTitle>Live Preview</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="w-full min-h-[400px] rounded-lg p-4 overflow-hidden">
                        <div ref={previewRef} className="w-full h-full flex items-center justify-center">
                            <div className="text-gray-500 dark:text-gray-400">
                                Loading preview...
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Load the survey widget script */}
            <Script
                src="/opineeo-sv-w.min.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // Initialize preview once script is loaded
                    setTimeout(() => initializePreview(), 100)
                }}
            />
        </div>
    )
}