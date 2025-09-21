"use client"

import { useTranslations } from "next-intl"
import React, { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CodeMirror from '@uiw/react-codemirror'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'
import { OpineeoSurvey } from "@/components/survey-render"

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
    styleMode: 'basic' | 'advanced'
    basicCSS?: string
    advancedCSS?: string
}

interface StyleSectionProps {
    style: Style
    onChange: (style: Style) => void
    surveyData: CreateSurveyData
}

// Minify CSS by removing comments, extra whitespace, and unnecessary characters
const minifyCSS = (css: string) => {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
        .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
        .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
        .replace(/\s*,\s*/g, ',') // Remove spaces around commas
        .replace(/\s*:\s*/g, ':') // Remove spaces around colons
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*>\s*/g, '>') // Remove spaces around child selectors
        .replace(/\s*\+\s*/g, '+') // Remove spaces around adjacent selectors
        .replace(/\s*~\s*/g, '~') // Remove spaces around general sibling selectors
        .trim(); // Remove leading/trailing whitespace
};

// Format CSS for display (unminify)
const formatCSS = (css: string) => {
    if (!css) return '';

    return css
        .replace(/\{/g, ' {\n    ')
        .replace(/;/g, ';\n    ')
        .replace(/\}/g, '\n}\n')
        .replace(/,\s*/g, ',\n    ')
        .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
        .replace(/^\s+|\s+$/g, '') // Trim start/end
        .split('\n')
        .map(line => {
            // Add proper indentation
            const trimmed = line.trim();
            if (trimmed.endsWith('{')) {
                return '    ' + trimmed;
            } else if (trimmed.endsWith('}')) {
                return trimmed;
            } else if (trimmed.endsWith(';')) {
                return '        ' + trimmed;
            } else if (trimmed.includes(':')) {
                return '        ' + trimmed;
            }
            return '    ' + trimmed;
        })
        .join('\n');
};

// Default CSS template with all available survey widget classes (minified)
const getDefaultCSSTemplate = () => {
    return `.sv{position:relative;display:flex;flex-direction:column;justify-content:space-between;background:transparent;color:inherit;margin:16px 0;padding:16px;min-width:300px;min-height:300px;font:inherit;overflow:hidden}.x{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;opacity:.7;cursor:pointer;font-size:24px;color:inherit;z-index:999}.x:hover{opacity:1}.body{padding:.5rem;margin-bottom:1rem;overflow:hidden;transition:opacity .3s ease}.qc{width:100%;height:100%;padding:0 4px}.qt{font-weight:600;margin-bottom:.5rem;font-size:18px}.qd{opacity:.8;margin-bottom:1rem;font-size:16px}.qs{margin-bottom:1rem;font-size:20px}.opts{margin-top:1.8rem;display:flex;flex-direction:column;align-items:flex-start}.req{color:#ef4444;font-size:1.2rem}.ft{padding:.5rem;display:flex;flex-direction:column}.nav{display:flex}.btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:6px;cursor:pointer;font:inherit}.btno{margin-right:.5rem;background:var(--sv-secondary-bg);border:1px solid var(--sv-secondary-border);color:var(--sv-text-color)}.btno:hover{opacity:.5}.btnp{border:0;background:var(--primary,var(--sv-primary-color));color:#fff}.btnp:hover{opacity:.9}.btn:disabled{opacity:.5;cursor:not-allowed}.spinner{animation:spin 1s linear infinite}.qtc{position:relative;overflow:hidden;min-height:200px;width:100%;height:auto}.qtc .qc{position:relative;width:100%;height:auto}.q-exit-right{animation:oR .3s ease-out forwards}.q-enter-right{animation:iR .4s ease-out forwards}.q-exit-left{animation:oL .3s ease-out forwards}.q-enter-left{animation:iL .4s ease-out forwards}.brand{margin-top:1rem;font-size:.75rem;opacity:.7}.brand a{color:inherit}.rad,.chk{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;cursor:pointer}.txt{width:100%;padding:.5rem;border:1px solid currentColor;border-radius:6px;font-size:16px;background:transparent;box-sizing:border-box;color:inherit;font-family:inherit}.stars{display:flex;justify-content:center;gap:.5rem}.star-btn{padding:.25rem;background:none;border:none;cursor:pointer;border-radius:50%;transition:all .2s ease;display:flex;align-items:center;justify-content:center;outline:0}.star-btn:hover{transform:scale(1.1)}.star-btn.star-sel{background-color:transparent}.star-svg{width:30px;height:30px;transition:all .2s ease}.star-btn:hover .star-svg{transform:scale(1.1)}.star-btn:not(.star-sel) .star-svg{opacity:.3}.ltxt{width:100%}.ta{width:100%;min-height:6rem;resize:none;border:1px solid currentColor;border-radius:6px;padding:.5rem;font-size:16px;background:transparent;box-sizing:border-box;color:inherit;font-family:inherit}.cc{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;min-height:250px;position:relative}.ca{margin-bottom:2rem;position:relative}.sc-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;position:relative;animation:scaleIn .6s cubic-bezier(.68,-.55,.265,1.55);box-shadow:0 8px 25px rgba(16,185,129,.3)}.sc-circle::before{content:'';position:absolute;width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);opacity:.3;animation:pulse 2s infinite}.sc-check{position:relative;width:24px;height:24px;transform:rotate(45deg);z-index:2}.cs{position:absolute;width:5px;height:25px;background-color:#fff;left:15px;top:-3px;border-radius:2px;animation:checkmarkStem .4s ease-in-out .3s both}.ck{position:absolute;width:15px;height:5px;background-color:#fff;left:4px;top:17px;border-radius:2px;animation:checkmarkKick .4s ease-in-out .5s both}@keyframes spin{to{transform:rotate(360deg)}}@keyframes oR{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-100%);opacity:0}}@keyframes iR{0%{transform:translateX(100%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes oL{0%{transform:translateX(0);opacity:1}100%{transform:translateX(100%);opacity:0}}@keyframes iL{0%{transform:translateX(-100%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes p{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(6px)}}@keyframes a{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}@keyframes scaleIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.1);opacity:.1}}@keyframes checkmarkStem{0%{height:0}100%{height:25px}}@keyframes checkmarkKick{0%{width:0}100%{width:15px}}@media(max-width:400px){.sv{max-width:100%;margin:8px;padding:16px}.qt{font-size:16px}.star{font-size:20px}}`;
};

export const StyleSection = ({ style, onChange, surveyData }: StyleSectionProps) => {
    const t = useTranslations("CreateSurvey.style")
    const [isDark, setIsDark] = useState(false)
    const [displayCSS, setDisplayCSS] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)
    const isEditingRef = useRef(false)
    const hasProcessedInitialLoadRef = useRef(false)
    // Detect theme
    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode = document.documentElement.classList.contains('dark') ||
                window.matchMedia('(prefers-color-scheme: dark)').matches
            setIsDark(isDarkMode)
        }

        checkTheme()

        // Listen for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', checkTheme)

        // Listen for class changes on document element
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

        return () => {
            mediaQuery.removeEventListener('change', checkTheme)
            observer.disconnect()
        }
    }, [])

    // Handle CSS formatting for display vs storage
    useEffect(() => {
        if (style.styleMode === 'advanced' && !isEditingRef.current) {
            // Format CSS when switching to advanced mode or when advancedCSS changes (but not during editing)
            if (style.advancedCSS && style.advancedCSS.trim() !== '') {
                const formattedCSS = formatCSS(style.advancedCSS)
                setDisplayCSS(formattedCSS)
            } else {
                setDisplayCSS(formatCSS(getDefaultCSSTemplate()))
            }
            setIsInitialized(true)
            hasProcessedInitialLoadRef.current = true
        } else if (style.styleMode !== 'advanced') {
            setIsInitialized(false)
            isEditingRef.current = false
            hasProcessedInitialLoadRef.current = false
        }
    }, [style.styleMode])

    // Generate and save basicCSS when in basic mode
    useEffect(() => {
        if (style.styleMode === 'basic') {
            const generatedCSS = generateCustomCSS()
            const minifiedCSS = minifyCSS(generatedCSS)
            // Only update if the basicCSS is different to avoid infinite loops
            if (style.basicCSS !== minifiedCSS) {
                onChange({ ...style, basicCSS: minifiedCSS })
            }
        }
    }, [style.styleMode, style.backgroundColor, style.textColor, style.buttonBackgroundColor, style.buttonTextColor, style.margin, style.padding, style.border, style.borderRadius, style.titleFontSize, style.bodyFontSize, style.fontFamily])

    // Generate custom CSS based on current style
    const generateCustomCSS = () => {
        if (style.styleMode === 'advanced' && style.advancedCSS) {
            return style.advancedCSS
        }

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

    // Handle survey completion in preview
    const handlePreviewComplete = (responses: any) => {
        console.log('Preview completed:', responses)
        // Optionally reset the preview after a delay
        setTimeout(() => { setIsInitialized((prev: boolean) => !prev) }, 1000)
    }

    // Handle survey close in preview
    const handlePreviewClose = () => {
        //console.log('Preview closed')
        setTimeout(() => { setIsInitialized((prev: boolean) => !prev) }, 500)
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none px-0 pt-4 shadow-none">
                <CardHeader className="p-0">
                    <div className="flex items-center justify-between">
                        <CardTitle>{t("title")}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                    {/* Style Mode Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="style-mode">{t("styleMode.label")}</Label>
                        <Select
                            value={style.styleMode}
                            onValueChange={(value: 'basic' | 'advanced') =>
                                onChange({ ...style, styleMode: value })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("styleMode.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">{t("styleMode.basic")}</SelectItem>
                                <SelectItem value="advanced">{t("styleMode.advanced")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Advanced CSS Editor - only show when advanced mode is selected */}
                    {style.styleMode === 'advanced' && (
                        <div className="space-y-2">
                            <Label htmlFor="advanced-css">{t("advancedCSS.label")}</Label>
                            <div className="border rounded-md overflow-hidden">
                                <CodeMirror
                                    key={`css-editor-${style.styleMode}-${isInitialized}`}
                                    value={displayCSS}
                                    onChange={(value) => {
                                        // Mark as editing to prevent re-formatting
                                        isEditingRef.current = true
                                        // Update display state immediately for real-time editing
                                        setDisplayCSS(value)
                                        // Save minified version to database
                                        const minifiedCSS = minifyCSS(value)
                                        onChange({ ...style, advancedCSS: minifiedCSS })
                                    }}
                                    placeholder={t("advancedCSS.placeholder")}
                                    height="300px"
                                    extensions={[css()]}
                                    theme={isDark ? oneDark : 'light'}
                                    basicSetup={{
                                        lineNumbers: true,
                                        foldGutter: true,
                                        dropCursor: false,
                                        allowMultipleSelections: false,
                                        indentOnInput: true,
                                        bracketMatching: true,
                                        closeBrackets: true,
                                        autocompletion: true,
                                        highlightSelectionMatches: true,
                                        searchKeymap: true,
                                    }}
                                    className="text-sm"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t("advancedCSS.description")}
                            </p>
                        </div>
                    )}

                    {/* Basic Style Fields - only show when basic mode is selected */}
                    {style.styleMode === 'basic' && (
                        <>
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
                        </>
                    )}
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
                        <OpineeoSurvey surveyData={{ ...surveyData, id: surveyData.id || 'preview-survey' }} customCSS={generateCustomCSS()} onComplete={handlePreviewComplete} onClose={() => handlePreviewClose()} userId={"user001"} extraInfo={"info 01"} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}