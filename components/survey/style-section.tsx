"use client"

import { useTranslations } from "next-intl"
import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react"
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
    styleMode: 'none' | 'basic' | 'advanced'
    basicCSS?: string
    advancedCSS?: string
}

export interface StyleSectionProps {
    style: Style
    onChange: (style: Style) => void
    surveyData: CreateSurveyData
    readonly?: boolean
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

    let formatted = '';
    let indentLevel = 0;
    let i = 0;
    let currentLine = '';

    while (i < css.length) {
        const char = css[i];

        if (char === '{') {
            // Opening brace - add newline and increase indent
            formatted += currentLine.trim() + ' {\n';
            currentLine = '';
            indentLevel++;
        } else if (char === '}') {
            // Closing brace - decrease indent and add on new line
            if (currentLine.trim()) {
                formatted += '    '.repeat(indentLevel) + currentLine.trim() + '\n';
                currentLine = '';
            }
            indentLevel--;
            formatted += '    '.repeat(indentLevel) + '}\n';
        } else if (char === ';') {
            // Semicolon - end of property, add newline
            currentLine += char;
            formatted += '    '.repeat(indentLevel) + currentLine.trim() + '\n';
            currentLine = '';
        } else if (char === '\n' || char === '\r') {
            // Skip existing newlines
            continue;
        } else {
            currentLine += char;
        }

        i++;
    }

    // Add any remaining content
    if (currentLine.trim()) {
        formatted += '    '.repeat(indentLevel) + currentLine.trim() + '\n';
    }

    // Clean up extra blank lines
    return formatted
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 newlines in a row
        .trim();
};

// Default CSS template with all available survey widget classes (minified)
const getDefaultCSSTemplate = () => {
    return `.sv{position:relative;display:flex;flex-direction:column;justify-content:space-between;background:#18181b;color:#fafafa;min-width:300px;min-height:300px;font:inherit;overflow:hidden;padding:16px;border-radius:12px}.sv-anchored{position:fixed!important;z-index:9999!important;box-shadow:0 10px 25px rgba(0,0,0,.3),0 6px 12px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.05)!important;max-width:380px;overflow-y:auto}.sv-top-right{top:20px!important;right:20px!important;bottom:auto!important;left:auto!important}.sv-top-left{top:20px!important;left:20px!important;bottom:auto!important;right:auto!important}.sv-bottom-right{bottom:20px!important;right:20px!important;top:auto!important;left:auto!important}.sv-bottom-left{bottom:20px!important;left:20px!important;top:auto!important;right:auto!important}.sv-feedback-btn{position:fixed;z-index:9998;padding:8px 16px;background:#18181b;color:#fafafa;border:1px solid rgba(255,255,255,.15);border-radius:8px;cursor:pointer;font:inherit;font-size:13px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,.3);transition:all .2s ease;backdrop-filter:blur(10px)}.sv-feedback-btn:hover{box-shadow:0 4px 12px rgba(0,0,0,.4);border-color:rgba(255,255,255,.25);transform:translateY(-1px)}.sv-feedback-btn.btn-top-right,.sv-feedback-btn.btn-bottom-right{right:20px}.sv-feedback-btn.btn-top-left,.sv-feedback-btn.btn-bottom-left{left:20px}.sv-feedback-btn.btn-top-right,.sv-feedback-btn.btn-top-left{top:20px}.sv-feedback-btn.btn-bottom-right,.sv-feedback-btn.btn-bottom-left{bottom:20px}.x{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;opacity:.7;cursor:pointer;font-size:24px;color:inherit;z-index:999}.x:hover{opacity:1}.body{margin-bottom:1rem;overflow:hidden;transition:opacity .3s ease}.qc{width:100%;height:100%;}.qt{font-weight:600;margin-bottom:.5rem;font-size:18px;text-align:start}.qd{opacity:.8;margin-bottom:1rem;font-size:16px;text-align:start;max-width:265px}.qs{margin-bottom:1rem;font-size:20px;max-width:265px}.opts{margin-top:1.8rem;display:flex;flex-direction:column;align-items:flex-start}.req{color:#ef4444;font-size:1.2rem}.ft{display:flex;flex-direction:column}.nav{display:flex}.btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:6px;cursor:pointer;font:inherit;transition:all .2s ease}.btno{margin-right:.5rem;background:#262626;border:1px solid var(--sv-secondary-border);color:#fff}.btno:hover{background:rgba(0,0,0,.15);border-color:rgba(0,0,0,.3)}.btnp{border:1px solid rgba(0,0,0,.3);background:#8881DF;color:#fff}.btnp:hover{opacity:.7}.btn:disabled{opacity:.5;cursor:not-allowed}.spinner{animation:spin 1s linear infinite}.qtc{position:relative;overflow:hidden;min-height:200px;width:100%;height:auto}.qtc .qc{position:relative;width:100%;height:auto}.q-exit-right{animation:oR .3s ease-out forwards}.q-enter-right{animation:iR .4s ease-out forwards}.q-exit-left{animation:oL .3s ease-out forwards}.q-enter-left{animation:iL .4s ease-out forwards}.brand{margin-top:1rem;font-size:.75rem;opacity:.7;text-align:start}.brand a{color:inherit}.rad,.chk{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;cursor:pointer}.txt{width:100%;padding:.5rem;border:1px solid currentColor;border-radius:6px;font-size:16px;background:transparent;box-sizing:border-box;color:inherit;font-family:inherit}.txt:focus{outline:none}.stars{display:flex;justify-content:center;gap:.5rem}.star-btn{padding:.25rem;background:none;border:none;cursor:pointer;border-radius:50%;transition:all .2s ease;display:flex;align-items:center;justify-content:center;outline:0}.star-btn:hover{transform:scale(1.1)}.star-btn.star-sel{background-color:transparent}.star-svg{width:30px;height:30px;transition:all .2s ease}.star-btn:hover .star-svg{transform:scale(1.1)}.star-btn:not(.star-sel) .star-svg{opacity:.3}.ltxt{width:100%}.ta{width:100%;min-height:6rem;resize:none;border:1px solid currentColor;border-radius:6px;padding:.5rem;font-size:16px;background:#131417;box-sizing:border-box;color:inherit;font-family:inherit}.ta:focus{outline:none;}.cc{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;min-height:250px;position:relative}.ca{margin-bottom:2rem;position:relative}.sc-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;position:relative;animation:scaleIn .6s cubic-bezier(.68,-.55,.265,1.55);box-shadow:0 8px 25px rgba(16,185,129,.3)}.sc-circle::before{content:'';position:absolute;width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);opacity:.3;animation:pulse 2s infinite}.sc-check{position:relative;width:24px;height:24px;transform:rotate(45deg);z-index:2}.cs{position:absolute;width:5px;height:25px;background-color:#fff;left:15px;top:-3px;border-radius:2px;animation:checkmarkStem .4s ease-in-out .3s both}.ck{position:absolute;width:15px;height:5px;background-color:#fff;left:4px;top:17px;border-radius:2px;animation:checkmarkKick .4s ease-in-out .5s both}@keyframes spin{to{transform:rotate(360deg)}}@keyframes oR{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-100%);opacity:0}}@keyframes iR{0%{transform:translateX(100%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes oL{0%{transform:translateX(0);opacity:1}100%{transform:translateX(100%);opacity:0}}@keyframes iL{0%{transform:translateX(-100%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes p{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(6px)}}@keyframes a{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}@keyframes scaleIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.1);opacity:.1}}@keyframes checkmarkStem{0%{height:0}100%{height:25px}}@keyframes checkmarkKick{0%{width:0}100%{width:15px}}@media(max-width:380px){.sv{max-width:100%;}.qt{font-size:16px}.star{font-size:20px}}`;
};

// Debounced Input Component for Style Section
const DebouncedStyleInput = memo(({
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

export const StyleSection = memo(({ style, onChange, surveyData, readonly = false }: StyleSectionProps) => {
    const t = useTranslations("CreateSurvey.style")
    const [isDark, setIsDark] = useState(false)
    const [displayCSS, setDisplayCSS] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)
    const isEditingRef = useRef(false)
    const hasProcessedInitialLoadRef = useRef(false)
    const advancedCSSTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [widgetKey, setWidgetKey] = useState(0)
    const justSwitchedModeRef = useRef(false)

    // Force widget reload when style mode changes
    useEffect(() => {
        setWidgetKey(prev => prev + 1)
    }, [style.styleMode])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (advancedCSSTimeoutRef.current) {
                clearTimeout(advancedCSSTimeoutRef.current)
            }
        }
    }, [])

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

    // Generate custom CSS based on current style - recalculates on every render
    const generateCustomCSS = () => {
        if (style.styleMode === 'none') {
            return ''
        }

        if (style.styleMode === 'advanced' && style.advancedCSS) {
            return style.advancedCSS
        }

        // Build CSS dynamically - only include properties with values
        let css = ''
        const svStyles: string[] = []
        const qtStyles: string[] = []
        const qdQsStyles: string[] = []
        const btnStyles: string[] = []
        const txtTaStyles: string[] = []
        const radChkStyles: string[] = []

        // .sv styles
        if (style.backgroundColor && style.backgroundColor.trim() !== '') {
            svStyles.push(`background: ${style.backgroundColor === 'transparent' ? 'transparent' : style.backgroundColor} !important`)
        }
        if (style.textColor && style.textColor.trim() !== '') {
            svStyles.push(`color: ${style.textColor} !important`)
        }
        if (style.margin && style.margin.trim() !== '') {
            svStyles.push(`margin: ${style.margin} !important`)
        }
        if (style.padding && style.padding.trim() !== '') {
            svStyles.push(`padding: ${style.padding} !important`)
        }
        if (style.border && style.border.trim() !== '') {
            svStyles.push(`border: ${style.border} !important`)
        }
        if (style.borderRadius && style.borderRadius.trim() !== '') {
            svStyles.push(`border-radius: ${style.borderRadius} !important`)
        }
        if (style.fontFamily && style.fontFamily.trim() !== '') {
            svStyles.push(`font-family: ${style.fontFamily} !important`)
        }

        if (svStyles.length > 0) {
            css += `.sv { ${svStyles.join('; ')}; }\n`
        }

        // .qt styles (title)
        if (style.titleFontSize && style.titleFontSize.trim() !== '') {
            qtStyles.push(`font-size: ${style.titleFontSize} !important`)
        }
        if (style.textColor && style.textColor.trim() !== '') {
            qtStyles.push(`color: ${style.textColor} !important`)
        }
        if (style.fontFamily && style.fontFamily.trim() !== '') {
            qtStyles.push(`font-family: ${style.fontFamily} !important`)
        }

        if (qtStyles.length > 0) {
            css += `.qt { ${qtStyles.join('; ')}; }\n`
        }

        // .qd, .qs styles (description/subtitle)
        if (style.bodyFontSize && style.bodyFontSize.trim() !== '') {
            qdQsStyles.push(`font-size: ${style.bodyFontSize} !important`)
        }
        if (style.textColor && style.textColor.trim() !== '') {
            qdQsStyles.push(`color: ${style.textColor} !important`)
        }
        if (style.fontFamily && style.fontFamily.trim() !== '') {
            qdQsStyles.push(`font-family: ${style.fontFamily} !important`)
        }

        if (qdQsStyles.length > 0) {
            css += `.qd, .qs { ${qdQsStyles.join('; ')}; }\n`
        }

        // .btn, .btnp styles (buttons)
        if (style.buttonBackgroundColor && style.buttonBackgroundColor.trim() !== '') {
            btnStyles.push(`background: ${style.buttonBackgroundColor === 'transparent' ? 'transparent' : style.buttonBackgroundColor} !important`)
        }
        if (style.buttonTextColor && style.buttonTextColor.trim() !== '') {
            btnStyles.push(`color: ${style.buttonTextColor} !important`)
        }

        if (style.fontFamily && style.fontFamily.trim() !== '') {
            btnStyles.push(`font-family: ${style.fontFamily} !important`)
        }

        if (btnStyles.length > 0) {
            css += `.btnp { ${btnStyles.join('; ')}; }\n`
            css += `.btnp > svg { stroke: ${style.buttonTextColor} !important; }\n`
            css += `.btnp:hover { opacity: 0.8 !important; }\n`
        }

        // .txt, .ta styles (text inputs/textareas)
        if (style.textColor && style.textColor.trim() !== '') {
            txtTaStyles.push(`color: ${style.textColor} !important`)
            txtTaStyles.push(`border-color: ${style.textColor} !important`)
        }
        if (style.fontFamily && style.fontFamily.trim() !== '') {
            txtTaStyles.push(`font-family: ${style.fontFamily} !important`)
        }
        txtTaStyles.push(`background: transparent !important`)

        if (txtTaStyles.length > 0) {
            css += `.txt, .ta { ${txtTaStyles.join('; ')}; }\n`
        }

        // .rad, .chk styles (radio/checkbox)
        if (style.textColor && style.textColor.trim() !== '') {
            radChkStyles.push(`color: ${style.textColor} !important`)
        }
        if (style.fontFamily && style.fontFamily.trim() !== '') {
            radChkStyles.push(`font-family: ${style.fontFamily} !important`)
        }

        if (radChkStyles.length > 0) {
            css += `.rad, .chk { ${radChkStyles.join('; ')}; }\n`
        }

        return css.trim()
    }

    // Generate and save basicCSS when in basic mode with debouncing
    useEffect(() => {
        if (style.styleMode === 'basic' && !justSwitchedModeRef.current) {
            const timeoutId = setTimeout(() => {
                const generatedCSS = generateCustomCSS()
                const minifiedCSS = minifyCSS(generatedCSS)
                // Only update if the basicCSS is different to avoid infinite loops
                if (style.basicCSS !== minifiedCSS) {
                    onChange({ ...style, basicCSS: minifiedCSS })
                }
            }, 500) // Debounce for 500ms

            return () => clearTimeout(timeoutId)
        }

        // Reset the flag after the first render
        if (justSwitchedModeRef.current) {
            justSwitchedModeRef.current = false
        }
    }, [style.backgroundColor, style.textColor, style.buttonBackgroundColor, style.buttonTextColor, style.margin, style.padding, style.border, style.borderRadius, style.titleFontSize, style.bodyFontSize, style.fontFamily])

    // Optimized change handlers
    const handleStyleModeChange = useCallback((styleMode: 'none' | 'basic' | 'advanced') => {
        if (readonly) return

        if (styleMode === 'none') {
            // Clear all styles - no CSS should be applied
            onChange({
                ...style,
                styleMode: 'none',
                basicCSS: '',
                advancedCSS: ''
            })
        } else if (styleMode === 'basic') {
            // Set flag to prevent immediate auto-generation
            justSwitchedModeRef.current = true
            // Generate CSS from current style values when switching to basic mode
            const tempStyle = { ...style, styleMode: 'basic' }
            let css = ''
            const svStyles: string[] = []
            const qtStyles: string[] = []
            const qdQsStyles: string[] = []
            const btnStyles: string[] = []
            const txtTaStyles: string[] = []
            const radChkStyles: string[] = []

            // Build CSS from current values
            if (style.backgroundColor && style.backgroundColor.trim() !== '') {
                svStyles.push(`background: ${style.backgroundColor === 'transparent' ? 'transparent' : style.backgroundColor} !important`)
            }
            if (style.textColor && style.textColor.trim() !== '') {
                svStyles.push(`color: ${style.textColor} !important`)
            }
            if (style.margin && style.margin.trim() !== '') {
                svStyles.push(`margin: ${style.margin} !important`)
            }
            if (style.padding && style.padding.trim() !== '') {
                svStyles.push(`padding: ${style.padding} !important`)
            }
            if (style.border && style.border.trim() !== '') {
                svStyles.push(`border: ${style.border} !important`)
            }
            if (style.borderRadius && style.borderRadius.trim() !== '') {
                svStyles.push(`border-radius: ${style.borderRadius} !important`)
            }
            if (style.fontFamily && style.fontFamily.trim() !== '') {
                svStyles.push(`font-family: ${style.fontFamily} !important`)
            }
            if (svStyles.length > 0) {
                css += `.sv { ${svStyles.join('; ')}; }\n`
            }

            // Title styles
            if (style.titleFontSize && style.titleFontSize.trim() !== '') {
                qtStyles.push(`font-size: ${style.titleFontSize} !important`)
            }
            if (style.textColor && style.textColor.trim() !== '') {
                qtStyles.push(`color: ${style.textColor} !important`)
            }
            if (style.fontFamily && style.fontFamily.trim() !== '') {
                qtStyles.push(`font-family: ${style.fontFamily} !important`)
            }
            if (qtStyles.length > 0) {
                css += `.qt { ${qtStyles.join('; ')}; }\n`
            }

            // Description styles
            if (style.bodyFontSize && style.bodyFontSize.trim() !== '') {
                qdQsStyles.push(`font-size: ${style.bodyFontSize} !important`)
            }
            if (style.textColor && style.textColor.trim() !== '') {
                qdQsStyles.push(`color: ${style.textColor} !important`)
            }
            if (style.fontFamily && style.fontFamily.trim() !== '') {
                qdQsStyles.push(`font-family: ${style.fontFamily} !important`)
            }
            if (qdQsStyles.length > 0) {
                css += `.qd, .qs { ${qdQsStyles.join('; ')}; }\n`
            }

            // Button styles
            if (style.buttonBackgroundColor && style.buttonBackgroundColor.trim() !== '') {
                btnStyles.push(`background: ${style.buttonBackgroundColor === 'transparent' ? 'transparent' : style.buttonBackgroundColor} !important`)
            }
            if (style.buttonTextColor && style.buttonTextColor.trim() !== '') {
                btnStyles.push(`color: ${style.buttonTextColor} !important`)
            }

            if (btnStyles.length > 0) {
                css += `.btnp { ${btnStyles.join('; ')}; }\n`
                css += `.btnp:hover { opacity: 0.8 !important; }\n`
            }

            // Input styles
            if (style.textColor && style.textColor.trim() !== '') {
                txtTaStyles.push(`color: ${style.textColor} !important`)
                txtTaStyles.push(`border-color: ${style.textColor} !important`)
            }
            if (style.fontFamily && style.fontFamily.trim() !== '') {
                txtTaStyles.push(`font-family: ${style.fontFamily} !important`)
            }
            txtTaStyles.push(`background: transparent !important`)
            if (txtTaStyles.length > 0) {
                css += `.txt, .ta { ${txtTaStyles.join('; ')}; }\n`
            }

            // Radio/checkbox styles
            if (style.textColor && style.textColor.trim() !== '') {
                radChkStyles.push(`color: ${style.textColor} !important`)
            }
            if (style.fontFamily && style.fontFamily.trim() !== '') {
                radChkStyles.push(`font-family: ${style.fontFamily} !important`)
            }
            if (radChkStyles.length > 0) {
                css += `.rad, .chk { ${radChkStyles.join('; ')}; }\n`
            }

            const minifiedBasicCSS = minifyCSS(css.trim())

            onChange({
                ...style,
                styleMode,
                basicCSS: minifiedBasicCSS,
                advancedCSS: ''
            })
        } else if (styleMode === 'advanced') {
            // Set default advanced CSS template or keep existing
            onChange({
                ...style,
                styleMode,
                advancedCSS: style.advancedCSS || getDefaultCSSTemplate(),
                basicCSS: ''
            })
        }
    }, [onChange, style, readonly])

    const handleAdvancedCSSChange = useCallback((advancedCSS: string) => {
        if (readonly) return
        onChange({ ...style, advancedCSS })
    }, [onChange, style, readonly])

    const handleBasicStyleChange = useCallback((field: string, value: string) => {
        if (readonly) return
        onChange({ ...style, [field]: value })
    }, [onChange, style, readonly])

    // Handle survey completion in preview
    const handlePreviewComplete = useCallback((responses: any) => {
        console.log('Preview completed:', responses)
        // Optionally reset the preview after a delay
        setTimeout(() => { setIsInitialized((prev: boolean) => !prev) }, 1000)
    }, [])

    // Handle survey close in preview
    const handlePreviewClose = useCallback(() => {
        //console.log('Preview closed')
        setTimeout(() => { setIsInitialized((prev: boolean) => !prev) }, 500)
    }, [])


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none px-0 pt-4 shadow-none bg-transparent">
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
                            onValueChange={handleStyleModeChange}
                            disabled={readonly}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("styleMode.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
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
                                        if (readonly) return

                                        // Mark as editing to prevent re-formatting
                                        isEditingRef.current = true
                                        // Update display state immediately for real-time editing
                                        setDisplayCSS(value)

                                        // Debounce the save operation
                                        if (advancedCSSTimeoutRef.current) {
                                            clearTimeout(advancedCSSTimeoutRef.current)
                                        }

                                        advancedCSSTimeoutRef.current = setTimeout(() => {
                                            // Save minified version to database
                                            const minifiedCSS = minifyCSS(value)
                                            onChange({ ...style, advancedCSS: minifiedCSS })
                                        }, 500) // Debounce for 500ms
                                    }}
                                    editable={!readonly}
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
                                        value={style.backgroundColor === "transparent" ? "transparent" : style.backgroundColor}
                                        onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                                        className="w-16 h-10 p-1 border rounded"
                                        disabled={readonly}
                                    />
                                    <DebouncedStyleInput
                                        value={style.backgroundColor}
                                        onChange={(value) => handleBasicStyleChange('backgroundColor', value)}
                                        placeholder="transparent"
                                        className="flex-1"
                                        readonly={readonly}
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
                                        disabled={readonly}
                                    />
                                    <DebouncedStyleInput
                                        value={style.textColor}
                                        onChange={(value) => handleBasicStyleChange('textColor', value)}
                                        placeholder="#222222"
                                        className="flex-1"
                                        readonly={readonly}
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
                                        onChange={(e) => handleBasicStyleChange('buttonBackgroundColor', e.target.value)}
                                        className="w-16 h-10 p-1 border rounded"
                                        disabled={readonly}
                                    />
                                    <DebouncedStyleInput
                                        value={style.buttonBackgroundColor}
                                        onChange={(value) => handleBasicStyleChange('buttonBackgroundColor', value)}
                                        placeholder="#222222"
                                        className="flex-1"
                                        readonly={readonly}
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
                                        onChange={(e) => handleBasicStyleChange('buttonTextColor', e.target.value)}
                                        className="w-16 h-10 p-1 border rounded"
                                        disabled={readonly}
                                    />
                                    <DebouncedStyleInput
                                        value={style.buttonTextColor}
                                        onChange={(value) => handleBasicStyleChange('buttonTextColor', value)}
                                        placeholder="#ffffff"
                                        className="flex-1"
                                        readonly={readonly}
                                    />
                                </div>
                            </div>

                            {/* Margin */}
                            <div className="space-y-2">
                                <Label htmlFor="margin">{t("margin.label")}</Label>
                                <DebouncedStyleInput
                                    id="margin"
                                    value={style.margin}
                                    onChange={(value) => handleBasicStyleChange('margin', value)}
                                    placeholder="16px 0px"
                                    className="w-full"
                                    readonly={readonly}
                                />
                            </div>

                            {/* Padding */}
                            <div className="space-y-2">
                                <Label htmlFor="padding">{t("padding.label")}</Label>
                                <DebouncedStyleInput
                                    id="padding"
                                    value={style.padding}
                                    onChange={(value) => handleBasicStyleChange('padding', value)}
                                    placeholder="16px"
                                    className="w-full"
                                    readonly={readonly}
                                />
                            </div>

                            {/* Border */}
                            <div className="space-y-2">
                                <Label htmlFor="border">{t("border.label")}</Label>
                                <DebouncedStyleInput
                                    id="border"
                                    value={style.border}
                                    onChange={(value) => handleBasicStyleChange('border', value)}
                                    placeholder="1px solid #222222"
                                    className="w-full"
                                    readonly={readonly}
                                />
                            </div>

                            {/* Border Radius */}
                            <div className="space-y-2">
                                <Label htmlFor="border-radius">{t("borderRadius.label")}</Label>
                                <DebouncedStyleInput
                                    id="border-radius"
                                    value={style.borderRadius}
                                    onChange={(value) => handleBasicStyleChange('borderRadius', value)}
                                    placeholder="6px"
                                    className="w-full"
                                    readonly={readonly}
                                />
                            </div>

                            {/* Title Font Size */}
                            <div className="space-y-2">
                                <Label htmlFor="title-font-size">{t("titleFontSize.label")}</Label>
                                <DebouncedStyleInput
                                    id="title-font-size"
                                    value={style.titleFontSize}
                                    onChange={(value) => handleBasicStyleChange('titleFontSize', value)}
                                    placeholder="18px"
                                    className="w-full"
                                    readonly={readonly}
                                />
                            </div>

                            {/* Body Font Size */}
                            <div className="space-y-2">
                                <Label htmlFor="body-font-size">{t("bodyFontSize.label")}</Label>
                                <DebouncedStyleInput
                                    id="body-font-size"
                                    value={style.bodyFontSize}
                                    onChange={(value) => handleBasicStyleChange('bodyFontSize', value)}
                                    placeholder="16px"
                                    className="w-full"
                                    readonly={readonly}
                                />
                            </div>

                            {/* Font Family */}
                            <div className="space-y-2">
                                <Label htmlFor="font-family">{t("fontFamily.label")}</Label>
                                <DebouncedStyleInput
                                    id="font-family"
                                    value={style.fontFamily}
                                    onChange={(value) => handleBasicStyleChange('fontFamily', value)}
                                    placeholder="Arial, sans-serif"
                                    className="w-full"
                                    readonly={readonly}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Live Preview */}
            <Card className="border-none px-0 pt-4 shadow-none bg-transparent">
                <CardHeader className="p-0">
                    <div className="flex items-center justify-between">
                        <CardTitle>Live Preview</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="w-full min-h-[400px] max-w-[360px] rounded-lg p-4 overflow-hidden">
                        <OpineeoSurvey
                            key={`preview-widget-${widgetKey}`}
                            surveyData={{ ...surveyData, id: surveyData.id || 'preview-survey' }}
                            customCSS={generateCustomCSS()}
                            onComplete={handlePreviewComplete}
                            onClose={() => handlePreviewClose()}
                            userId={"user001"}
                            extraInfo={"info 01"}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
})

StyleSection.displayName = "StyleSection"