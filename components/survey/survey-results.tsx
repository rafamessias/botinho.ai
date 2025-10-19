"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Download, Table, BarChart3, ChevronDown, LucideFolderOpen, LucidePlusCircle, LucideSparkles, Share2 } from "lucide-react"
import { Link } from "@/i18n/navigation"
import html2canvas from "html2canvas"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RawDataTable } from "./raw-data-table"
import { SurveyData, Question } from "./types"
import { getSurveyResponseSummary, getQuestionResponses, getPublishedAndArchivedSurveys } from "@/components/server-actions/survey"
import { checkExportPermission } from "@/components/server-actions/subscription"
import { SurveyResponseSummary } from "@/lib/generated/prisma"
import { useUser } from "../user-provider"
import { UpgradeModal } from "@/components/upgrade-modal"

// Extended type for SurveyResponseSummary with relations
type SurveyResponseSummaryWithRelations = SurveyResponseSummary & {
    option?: {
        id: string
        text: string
        order: number
    } | null
    question?: {
        id: string
        title: string
        format: any
        order: number
    } | null
}

interface SurveyResultsProps {
    serverSurveys: SurveyData[] | null
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({ serverSurveys }) => {
    const [selectedSurveyId, setSelectedSurveyId] = React.useState<string>("")
    const [viewMode, setViewMode] = React.useState<"charts" | "table">("charts")
    const [isExporting, setIsExporting] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [surveyData, setSurveyData] = React.useState<SurveyResponseSummaryWithRelations[] | null>(null)
    const [processedQuestions, setProcessedQuestions] = React.useState<Question[]>([])
    const [rawData, setRawData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [selectedSurvey, setSelectedSurvey] = React.useState<SurveyData | null>(serverSurveys?.find(survey => survey.id === selectedSurveyId) || null)
    const [surveys, setSurveys] = React.useState<SurveyData[]>(serverSurveys || [])
    const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false)
    const [sharingQuestionId, setSharingQuestionId] = React.useState<string | null>(null)
    const { user } = useUser()

    React.useEffect(() => {
        const fetchSurveys = async () => {
            const surveysResult = await getPublishedAndArchivedSurveys()

            // Transform the database surveys to match the expected format
            const surveyResults = surveysResult.success && surveysResult.surveys ? surveysResult.surveys.map(survey => ({
                id: survey.id,
                title: survey.name.length > 45 ? survey.name.slice(0, 45) + "..." : survey.name,
                description: survey.description || "",
                createdAt: survey.createdAt.toLocaleDateString(),
                totalResponses: survey.totalResponses,
                status: survey.status,
                type: survey.type?.name || "Default",
                questions: [] // Will be populated when survey is selected
            })) : []

            setSelectedSurvey(surveyResults.find(survey => survey.id === selectedSurveyId) || null)
            setSurveys(surveyResults);

        }

        fetchSurveys()

    }, [user?.defaultTeamId])

    // Fetch survey data when a survey is selected
    React.useEffect(() => {
        const fetchSurveyData = async () => {

            if (!selectedSurveyId) {
                setSurveyData(null)
                setRawData([])
                setProcessedQuestions([])
                return
            }

            setLoading(true)
            try {
                // Fetch summary data for charts
                const summaryResult = await getSurveyResponseSummary(selectedSurveyId)
                if (summaryResult.success && summaryResult.summaryData) {
                    setSurveyData(summaryResult.summaryData)

                    // Process the summary data into questions format
                    const questions = processSummaryDataToQuestions(summaryResult.summaryData)
                    setProcessedQuestions(questions)
                }

                // Fetch raw data for table view
                const rawDataResult = await getQuestionResponses(selectedSurveyId)
                if (rawDataResult.success && rawDataResult.responses) {
                    setRawData(rawDataResult.responses)
                }
            } catch (error) {
                console.error("Error fetching survey data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSurveyData()
    }, [selectedSurveyId, selectedSurvey])

    // Update selectedSurvey when selectedSurveyId changes
    React.useEffect(() => {
        if (selectedSurveyId && surveys.length > 0) {
            const foundSurvey = surveys.find(survey => survey.id === selectedSurveyId)
            setSelectedSurvey(foundSurvey || null)
        } else if (!selectedSurveyId) {
            setSelectedSurvey(null)
        }
    }, [selectedSurveyId, surveys])

    // Process SurveyResponseSummary data into Question format for charts
    const processSummaryDataToQuestions = (summaryData: SurveyResponseSummaryWithRelations[]): Question[] => {
        const questionsMap = new Map<string, Question>()

        summaryData.forEach(item => {
            const questionId = item.questionId
            const questionTitle = item.questionTitle || ''
            const questionFormat = item.questionFormat || ''

            if (!questionsMap.has(questionId)) {
                questionsMap.set(questionId, {
                    id: questionId,
                    text: questionTitle,
                    type: questionFormat,
                    options: []
                })
            }

            const question = questionsMap.get(questionId)!

            // Process different types of responses
            if (questionFormat === 'SINGLE_CHOICE' || questionFormat === 'MULTIPLE_CHOICE') {
                // Choice-based question (SINGLE_CHOICE, MULTIPLE_CHOICE)
                question.options?.push({
                    value: item.optionId || '',
                    label: item.isOther ? "Other" : (item.textValue || ''),
                    count: item.responseCount
                })
            } else if (questionFormat === 'LONG_TEXT' || questionFormat === 'STATEMENT') {
                //not being used
            } else if (questionFormat === 'STAR_RATING') {
                // Numeric question (STAR_RATING)
                question.options?.push({
                    value: item.numberValue?.toString() || '0',
                    label: `${item.numberValue} star${item.numberValue !== 1 ? 's' : ''}`,
                    count: item.responseCount
                })

            } else if (questionFormat === 'YES_NO') {
                // Boolean question (YES_NO)
                question.options?.push({
                    value: item.booleanValue?.toString() || '0',
                    label: item.textValue || '',
                    count: item.responseCount
                })

            }
        })

        const result = Array.from(questionsMap.values())
        return result
    }

    const handleExport = async (format: "csv" | "excel") => {
        if (!surveyData || !selectedSurvey) return

        // Check export permission
        const permissionResult = await checkExportPermission()

        if (!permissionResult.success || !permissionResult.canExport) {
            setUpgradeModalOpen(true)
            return
        }

        setIsExporting(true)

        try {
            if (format === "csv") {
                await exportToCSV()
            } else {
                await exportToExcel()
            }
        } catch (error) {
            console.error("Export failed:", error)
        } finally {
            setIsExporting(false)
        }
    }

    const exportToCSV = async () => {
        const csvContent = generateCSVContent()
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${selectedSurvey!.title.replace(/\s+/g, "_")}_results.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportToExcel = async () => {
        // For Excel export, we'll create a CSV that can be opened in Excel
        // In a real implementation, you'd use a library like xlsx
        const csvContent = generateCSVContent()
        const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${selectedSurvey!.title.replace(/\s+/g, "_")}_results.xls`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const generateCSVContent = (): string => {
        let csvContent = `Survey: ${selectedSurvey!.title}\n`
        csvContent += `Total Responses: ${selectedSurvey!.totalResponses}\n`
        csvContent += `Date: ${selectedSurvey!.createdAt}\n\n`

        if (rawData && rawData.length > 0) {
            // Raw data format using QuestionResponse data with specified fields
            const headers = [
                "userIP",
                "userId",
                "extraInfo",
                "questionId",
                "questionTitle",
                "questionFormat",
                "optionId",
                "isOther",
                "textValue",
                "numberValue",
                "booleanValue",
                "createdAt"
            ]
            csvContent += headers.join(",") + "\n"

            rawData.forEach(response => {
                const row = [
                    response.response?.userIp || "",
                    response.response?.userId || "",
                    response.response?.extraInfo || "",
                    response.questionId || "",
                    response.questionTitle || "",
                    response.questionFormat || "",
                    response.optionId || "",
                    response.isOther || false,
                    response.textValue || "",
                    response.numberValue || "",
                    response.booleanValue || "",
                    response.response?.createdAt ? new Date(response.response.createdAt).toISOString() : ""
                ]
                csvContent += row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",") + "\n"
            })
        } else {
            // Use processed questions from summary data
            processedQuestions.forEach((question, index) => {
                csvContent += `Question ${index + 1}: ${question.text}\n`

                if (question.type === "text" || question.type === "long-text") {
                    csvContent += "Text Responses:\n"
                    question.responses?.forEach(response => {
                        csvContent += `"${response.replace(/"/g, '""')}"\n`
                    })
                } else if (question.options) {
                    csvContent += "Answer,Count,Percentage\n"
                    const total = question.options.reduce((sum, option) => sum + option.count, 0)
                    question.options.forEach(option => {
                        const percentage = total > 0 ? ((option.count / total) * 100).toFixed(1) : "0"
                        csvContent += `"${option.label}",${option.count},${percentage}%\n`
                    })
                }
                csvContent += "\n"
            })
        }

        return csvContent
    }

    // Helper function to download the image
    const downloadImage = (url: string, questionText: string) => {
        const link = document.createElement('a')
        link.href = url
        link.download = `${questionText.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-results.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    // Function to generate and share/download question result as image
    const handleShareQuestion = async (question: Question) => {
        // Prevent multiple simultaneous shares
        if (sharingQuestionId) return

        setSharingQuestionId(question.id)

        try {
            // Calculate total responses for this question
            const totalResponses = question.options?.reduce((sum, option) => sum + option.count, 0) || 0
            const topAnswer = question.options && question.options.length > 0
                ? question.options.reduce((prev, current) => (prev.count > current.count) ? prev : current)
                : null

            // Helper function to convert any color format to rgb/rgba
            const toRgbColor = (color: string): string => {
                try {
                    const canvas = document.createElement('canvas')
                    canvas.width = canvas.height = 1
                    const ctx = canvas.getContext('2d')
                    if (!ctx) return 'rgb(0, 0, 0)'

                    ctx.fillStyle = color
                    ctx.fillRect(0, 0, 1, 1)
                    const imageData = ctx.getImageData(0, 0, 1, 1).data

                    if (imageData[3] === 255) {
                        return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`
                    }
                    return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${imageData[3] / 255})`
                } catch {
                    return 'rgb(0, 0, 0)'
                }
            }

            // Detect current theme
            const isDarkMode = document.documentElement.classList.contains('dark')

            // Get actual computed colors from the current theme
            const getComputedThemeColor = (property: string): string => {
                // Create a temporary element with the property set
                const temp = document.createElement('div')
                temp.style.cssText = `${property}; position: absolute; opacity: 0; pointer-events: none;`
                document.body.appendChild(temp)
                const computed = window.getComputedStyle(temp)

                // Get the actual color value based on property type
                let colorValue = ''
                if (property.includes('background')) {
                    colorValue = computed.backgroundColor
                } else if (property.includes('border')) {
                    colorValue = computed.borderColor
                } else {
                    colorValue = computed.color
                }

                document.body.removeChild(temp)
                return toRgbColor(colorValue)
            }
            const bgColor = getComputedThemeColor('background-color: var(--background)')
            const fgColor = getComputedThemeColor('color: var(--foreground)')
            const mutedFgColor = getComputedThemeColor('color: var(--muted-foreground)')
            const borderColor = getComputedThemeColor('border-color: var(--border)')
            const primaryColor = getComputedThemeColor('color: var(--primary)')
            const cardBgColor = getComputedThemeColor('background-color: var(--card)')
            const chartColor = getComputedThemeColor('color: var(--primary)')

            // Create an iframe for complete CSS isolation
            const iframe = document.createElement('iframe')
            iframe.style.position = 'fixed'
            iframe.style.top = '-99999px'
            iframe.style.left = '-99999px'
            iframe.style.width = '1200px'
            iframe.style.height = '2000px'
            iframe.style.border = 'none'
            iframe.style.visibility = 'hidden'
            document.body.appendChild(iframe)

            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                if (!iframeDoc) {
                    throw new Error('Could not access iframe document')
                }

                // Write basic HTML structure to iframe
                iframeDoc.open()
                iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                            background: transparent;
                            padding: 0;
                            margin: 0;
                            display: inline-block;
                        }
                        rect {
                            fill: ${chartColor} !important;
                            stroke: ${chartColor} !important;
                        }
                        path {
                            fill: ${chartColor} !important;
                            stroke: ${chartColor} !important;
                        }
                        text {
                            font-weight: bold !important;
                        }
                        text[fill*="white"], text[fill*="255"] {
                            fill: rgb(255, 255, 255) !important; /* White for inside bars */
                        }
                        text:not([fill*="white"]):not([fill*="255"]) {
                            fill: ${fgColor} !important; /* Theme color for outside bars */
                        }
                    </style>
                </head>
                <body>
                    <div id="share-content"></div>
                </body>
                </html>
            `)
                iframeDoc.close()

                const shareContainer = iframeDoc.getElementById('share-content')!
                const containerId = 'share-content'

                // Build the HTML content as a single card with background wrapper
                const contentDiv = document.createElement('div')
                contentDiv.innerHTML = `
                <div style="background: ${bgColor}; padding: 48px;">
                    <div style="background: ${cardBgColor}; border: 1px solid ${borderColor}; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <!-- Header -->
                        <div style="margin-bottom: 24px;">
                            <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.3; color: ${fgColor};">
                                ${question.text}
                            </h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 14px; color: ${mutedFgColor};">
                                <span>${totalResponses} total responses</span>
                                ${topAnswer ? `
                                    <span>•</span>
                                    <span>
                                        Most popular: <span style="font-weight: 600; color: ${primaryColor};">${topAnswer.label}</span> (${((topAnswer.count / totalResponses) * 100).toFixed(1)}%)
                                    </span>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Chart Container -->
                        <div id="chart-container-share" style="margin-bottom: 20px;">
                            <!-- Chart will be inserted here -->
                        </div>

                        <!-- Branding -->
                        <div style="text-align: center; font-size: 12px; color: ${mutedFgColor}; padding-top: 16px; border-top: 1px solid ${borderColor};">
                            Powered by <span style="font-weight: 700; color: ${fgColor};">Opineeo</span>
                        </div>
                    </div>
                </div>
            `

                shareContainer.appendChild(contentDiv)

                // Clone the actual chart and insert it
                const chartElement = document.getElementById(`chart-${question.id}`)
                if (chartElement) {
                    const chartClone = chartElement.cloneNode(true) as HTMLElement
                    const chartContainer = shareContainer.querySelector('#chart-container-share')
                    if (chartContainer) {
                        chartContainer.appendChild(chartClone)

                        // Force all elements to use standard colors and remove classes
                        const allElements = chartClone.querySelectorAll('*')
                        allElements.forEach((el) => {
                            const element = el as HTMLElement | SVGElement

                            // Get computed styles before removing classes
                            const computed = window.getComputedStyle(element)

                            // Store important computed styles
                            const styles: any = {}

                            // Always apply primary color to rect elements (chart bars)
                            if (element.tagName === 'rect') {
                                styles.fill = chartColor
                                console.log('Applied primary color to rect element:', chartColor)
                            } else if (computed.fill && computed.fill !== 'none') {
                                styles.fill = toRgbColor(computed.fill)
                            }

                            if (computed.stroke && computed.stroke !== 'none') {
                                styles.stroke = toRgbColor(computed.stroke)
                            }

                            if (computed.color) {
                                // Handle chart labels based on position
                                if (element.tagName === 'text') {
                                    // Labels inside bars should be white/transparent for contrast
                                    // Labels outside bars should follow theme
                                    const isInsideBar = element.getAttribute('data-inside') ||
                                        element.style.fill?.includes('white') ||
                                        computed.fill?.includes('white')

                                    if (isInsideBar) {
                                        styles.color = 'rgb(255, 255, 255)' // White for inside bars
                                    } else {
                                        styles.color = fgColor // Theme color for outside bars
                                    }
                                    styles.fontWeight = 'bold'
                                } else {
                                    styles.color = toRgbColor(computed.color)
                                }
                            }

                            if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                                styles.backgroundColor = toRgbColor(computed.backgroundColor)
                            }

                            if (computed.fontSize) {
                                styles.fontSize = computed.fontSize
                            }

                            if (computed.fontWeight) {
                                styles.fontWeight = computed.fontWeight
                            }

                            if (computed.fontFamily) {
                                styles.fontFamily = computed.fontFamily
                            }

                            if (computed.textAnchor) {
                                styles.textAnchor = computed.textAnchor
                            }

                            // Remove all classes to prevent CSS variable inheritance
                            element.removeAttribute('class')
                            element.removeAttribute('className')

                            // Force primary color on all chart elements
                            if (element.tagName === 'rect' || element.tagName === 'path') {
                                element.style.setProperty('fill', chartColor, 'important')
                                element.style.setProperty('stroke', chartColor, 'important')
                            }

                            // Apply the stored styles as inline styles
                            Object.keys(styles).forEach(key => {
                                (element.style as any)[key] = styles[key]
                            })
                        })
                    }
                }

                // Final override - force primary color on all rect elements and black bold text
                const allRects = shareContainer.querySelectorAll('rect')
                allRects.forEach(rect => {
                    rect.style.setProperty('fill', chartColor, 'important')
                    rect.style.setProperty('stroke', chartColor, 'important')
                })

                const allTexts = shareContainer.querySelectorAll('text')
                allTexts.forEach(text => {
                    // Check if text is inside bar (white fill) or outside bar (theme color)
                    const currentFill = text.style.fill || text.getAttribute('fill')
                    const isInsideBar = currentFill?.includes('white') || currentFill?.includes('255')

                    if (isInsideBar) {
                        text.style.setProperty('fill', 'rgb(255, 255, 255)', 'important') // White for inside bars
                    } else {
                        text.style.setProperty('fill', fgColor, 'important') // Theme color for outside bars
                    }
                    text.style.setProperty('font-weight', 'bold', 'important')
                })

                // Wait a bit for rendering
                await new Promise(resolve => setTimeout(resolve, 500))

                // Convert to canvas - capture the wrapper with background
                const wrapperToCapture = iframeDoc.querySelector('#share-content > div') as HTMLElement
                if (!wrapperToCapture) throw new Error('Content not found')

                const canvas = await html2canvas(wrapperToCapture, {
                    backgroundColor: bgColor, // Use theme background color
                    scale: 2, // Higher quality
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    foreignObjectRendering: false,
                    imageTimeout: 0
                })

                // Convert canvas to blob
                canvas.toBlob((blob) => {
                    if (!blob) return

                    const url = URL.createObjectURL(blob)

                    // Try to use Web Share API if available (mobile devices)
                    if (navigator.share && navigator.canShare) {
                        const file = new File([blob], `${question.text.slice(0, 50).replace(/[^a-z0-9]/gi, '_')}-results.png`, { type: 'image/png' })

                        if (navigator.canShare({ files: [file] })) {
                            navigator.share({
                                title: question.text,
                                text: `Check out these survey results from ${selectedSurvey?.title}`,
                                files: [file]
                            }).catch(err => {
                                console.log('Share cancelled or failed:', err)
                                // Fallback to download
                                downloadImage(url, question.text)
                            })
                            return
                        }
                    }

                    // Fallback: direct download
                    downloadImage(url, question.text)
                }, 'image/png')
            } finally {
                // Always clean up the iframe
                if (iframe.parentNode) {
                    document.body.removeChild(iframe)
                }
            }

        } catch (error) {
            console.error('Error generating share image:', error)
        } finally {
            setSharingQuestionId(null)
        }
    }

    const renderQuestionChart = (question: Question) => {
        if (question.type === "text" || question.type === "long-text" || !question.options || question.options.length === 0) {
            return null
        }

        const data = question.options
            .map(option => ({
                answer: option.label,
                count: option.count,
                percentage: question.options && question.options.length > 0 ?
                    ((option.count / question.options.reduce((sum, opt) => sum + opt.count, 0)) * 100).toFixed(1) : 0
            }))
            .sort((a, b) => b.count - a.count) // Sort by count in descending order

        // Don't render chart if no data
        if (data.length === 0) return null

        const chartConfig = {
            count: {
                label: "Responses",
            },
            label: {
                color: "hsl(var(--foreground-muted))",
            },
        } satisfies ChartConfig

        const totalResponses = question.options?.reduce((sum, option) => sum + option.count, 0) || 0
        const topAnswer = data.length > 0 ? data.reduce((prev, current) => (prev.count > current.count) ? prev : current) : { answer: 'No responses', count: 0, percentage: '0' }

        // Calculate dynamic height based on number of bars (60px per bar, max 300px)
        const dynamicHeight = Math.min(data.length * 60, 300)

        return (
            <Card key={question.id} className="shadow-none">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg">{question.text}</CardTitle>
                            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span>{totalResponses} total responses</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="text-sm">
                                    Most popular: <span className="font-medium text-primary">{topAnswer.answer}</span> ({topAnswer.percentage}%)
                                </span>
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareQuestion(question)}
                            disabled={sharingQuestionId === question.id}
                            className="shrink-0"
                        >
                            {sharingQuestionId === question.id ? (
                                <>
                                    <span className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                                    <span className="hidden sm:inline">Sharing...</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Share</span>
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">

                        {/* Chart - Add ID for sharing functionality */}
                        <div id={`chart-${question.id}`}>
                            <ChartContainer
                                config={chartConfig}
                                className="w-full"
                                style={{ height: `${dynamicHeight}px` }}
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={data}
                                    layout="vertical"
                                    margin={{
                                        right: 32,
                                    }}
                                    maxBarSize={60}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                        dataKey="answer"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value}
                                        hide
                                    />
                                    <XAxis dataKey="count" type="number" hide />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Bar
                                        dataKey="count"
                                        layout="vertical"
                                        fill="var(--color-chart-1)"
                                        radius={4}
                                    >
                                        <LabelList
                                            dataKey="answer"
                                            position="insideLeft"
                                            offset={8}
                                            className="fill-primary-foreground"
                                            fontSize={12}
                                        />
                                        <LabelList
                                            dataKey="count"
                                            position="right"
                                            offset={8}
                                            className="fill-foreground"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }


    // Mock data for empty state visualization
    const mockChartData1 = [
        { answer: "Very Satisfied", count: 45, percentage: "35" },
        { answer: "Satisfied", count: 38, percentage: "30" },
        { answer: "Neutral", count: 25, percentage: "20" },
        { answer: "Dissatisfied", count: 12, percentage: "10" },
        { answer: "Very Dissatisfied", count: 6, percentage: "5" }
    ]

    const mockChartData2 = [
        { answer: "Excellent", count: 52, percentage: "42" },
        { answer: "Good", count: 35, percentage: "28" },
        { answer: "Average", count: 23, percentage: "18" },
        { answer: "Poor", count: 15, percentage: "12" }
    ]

    const mockChartData3 = [
        { answer: "Yes", count: 85, percentage: "68" },
        { answer: "No", count: 25, percentage: "20" },
        { answer: "Maybe", count: 15, percentage: "12" }
    ]

    const chartConfig = {
        count: {
            label: "Responses",
        },
        label: {
            color: "hsl(var(--foreground-muted))",
        },
    } satisfies ChartConfig

    if (surveys.length === 0) {
        return (
            <div className="space-y-6">
                <Card className="border-none shadow-none m-0 bg-transparent">
                    <CardHeader>
                        <CardTitle>Survey Results</CardTitle>
                        <CardDescription>
                            Select a survey to view its results and analytics
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="relative">
                    {/* Mock Charts with Opacity */}
                    <div className="opacity-10 blur-xs pointer-events-none space-y-6 px-6">
                        {/* Chart 1 */}
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg">How satisfied are you with our service?</CardTitle>
                                <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span>126 total responses</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="text-sm">
                                        Most popular: <span className="font-medium text-primary">Very Satisfied</span> (35%)
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="w-full"
                                    style={{ height: "300px" }}
                                >
                                    <BarChart
                                        accessibilityLayer
                                        data={mockChartData1}
                                        layout="vertical"
                                        margin={{
                                            right: 32,
                                        }}
                                        maxBarSize={60}
                                    >
                                        <CartesianGrid horizontal={false} />
                                        <YAxis
                                            dataKey="answer"
                                            type="category"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value}
                                            hide
                                        />
                                        <XAxis dataKey="count" type="number" hide />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" />}
                                        />
                                        <Bar
                                            dataKey="count"
                                            layout="vertical"
                                            fill="var(--muted-foreground)"
                                            radius={4}
                                        >
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Chart 2 */}
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg">How would you rate your experience?</CardTitle>
                                <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span>125 total responses</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="text-sm">
                                        Most popular: <span className="font-medium text-primary">Excellent</span> (42%)
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="w-full"
                                    style={{ height: "240px" }}
                                >
                                    <BarChart
                                        accessibilityLayer
                                        data={mockChartData2}
                                        layout="vertical"
                                        margin={{
                                            right: 32,
                                        }}
                                        maxBarSize={60}
                                    >
                                        <CartesianGrid horizontal={false} />
                                        <YAxis
                                            dataKey="answer"
                                            type="category"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value}
                                            hide
                                        />
                                        <XAxis dataKey="count" type="number" hide />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" />}
                                        />
                                        <Bar
                                            dataKey="count"
                                            layout="vertical"
                                            fill="var(--muted-foreground)"
                                            radius={4}
                                        >
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Chart 3 */}
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg">Would you recommend us to others?</CardTitle>
                                <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span>125 total responses</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="text-sm">
                                        Most popular: <span className="font-medium text-primary">Yes</span> (68%)
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="w-full"
                                    style={{ height: "180px" }}
                                >
                                    <BarChart
                                        accessibilityLayer
                                        data={mockChartData3}
                                        layout="vertical"
                                        margin={{
                                            right: 32,
                                        }}
                                        maxBarSize={60}
                                    >
                                        <CartesianGrid horizontal={false} />
                                        <YAxis
                                            dataKey="answer"
                                            type="category"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value}
                                            hide
                                        />
                                        <XAxis dataKey="count" type="number" hide />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" />}
                                        />
                                        <Bar
                                            dataKey="count"
                                            layout="vertical"
                                            fill="var(--muted-foreground)"
                                            radius={4}
                                        >
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Overlay Message */}
                    <div className="absolute inset-0 flex items-start justify-center pt-12 sm:pt-16">
                        <Card className="max-w-md mx-4 shadow-lg border-2">
                            <CardContent className="pt-6">
                                <div className="text-center flex flex-col items-center gap-4">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <LucideSparkles className="text-primary size-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold">
                                            No surveys yet
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Create your first survey and start collecting valuable feedback from your audience.
                                        </p>
                                    </div>
                                    <Button asChild size="lg" className="mt-2">
                                        <Link href="/survey/create">
                                            <span className="flex items-center gap-2">
                                                <LucidePlusCircle className="size-5" />
                                                Create Your First Survey
                                            </span>
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <UpgradeModal
                open={upgradeModalOpen}
                onOpenChange={setUpgradeModalOpen}
                limitType="exports"
            />

            <div className="space-y-6">
                {/* Survey Selection */}
                <Card className="border-none shadow-none m-0 bg-transparent">
                    <CardHeader>
                        <CardTitle>Survey Results</CardTitle>
                        <CardDescription>
                            Select a survey to view its results and analytics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full sm:max-w-md justify-between h-14"
                                        >
                                            <div className="flex flex-col items-start min-w-0 flex-1 hover:text-foreground">
                                                {selectedSurvey ? (
                                                    <>
                                                        <span className="font-medium truncate">{selectedSurvey.title}</span>
                                                        <span className="text-foreground">
                                                            {selectedSurvey.totalResponses} responses • {selectedSurvey.createdAt}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-foreground">Select a survey to view results</span>
                                                )}
                                            </div>
                                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search surveys..." />
                                            <CommandList>
                                                <CommandEmpty>No surveys found.</CommandEmpty>
                                                <CommandGroup>
                                                    {surveys.map((survey) => (
                                                        <CommandItem
                                                            key={survey.id}
                                                            value={survey.title}
                                                            onSelect={() => {
                                                                setSelectedSurveyId(survey.id)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <div className="flex flex-col w-full">
                                                                <span className="font-medium">{survey.title}</span>
                                                                <span className="text-sm text-foreground">
                                                                    {survey.totalResponses} responses • {survey.createdAt}
                                                                </span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {selectedSurvey && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                <div className="flex flex-row border rounded-md bg-muted divide-x overflow-hidden">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewMode("charts")}
                                                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${viewMode === "charts" ? "bg-primary text-primary-foreground" : "hover:bg-muted-foreground/10 text-muted-foreground"}`}
                                                        disabled={loading}
                                                        aria-pressed={viewMode === "charts"}
                                                    >
                                                        <BarChart3 className="h-4 w-4" />
                                                        Charts
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewMode("table")}
                                                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${viewMode === "table" ? "bg-primary text-primary-foreground" : "hover:bg-muted-foreground/10 text-muted-foreground"}`}
                                                        disabled={loading}
                                                        aria-pressed={viewMode === "table"}
                                                    >
                                                        <Table className="h-4 w-4" />
                                                        Table
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" disabled={isExporting || loading}>
                                                <Download className="h-4 w-4 mr-2" />
                                                Export
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleExport("csv")}>
                                                Export as CSV
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport("excel")}>
                                                Export as Excel
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Results Display */}
                {!selectedSurvey ? (
                    <div className="relative min-h-[500px]">
                        {/* Mock Charts with Opacity */}
                        <div className="opacity-10 blur-xs pointer-events-none space-y-6 px-6 pt-12 sm:pt-16">
                            {/* Chart 1 */}
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-lg">How satisfied are you with our service?</CardTitle>
                                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span>126 total responses</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-sm">
                                            Most popular: <span className="font-medium text-primary">Very Satisfied</span> (35%)
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="w-full"
                                        style={{ height: "300px" }}
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={mockChartData1}
                                            layout="vertical"
                                            margin={{
                                                right: 32,
                                            }}
                                            maxBarSize={60}
                                        >
                                            <CartesianGrid horizontal={false} />
                                            <YAxis
                                                dataKey="answer"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) => value}
                                                hide
                                            />
                                            <XAxis dataKey="count" type="number" hide />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="line" />}
                                            />
                                            <Bar
                                                dataKey="count"
                                                layout="vertical"
                                                fill="var(--muted-foreground"
                                                radius={4}
                                            >
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Chart 2 */}
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-lg">How would you rate your experience?</CardTitle>
                                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span>125 total responses</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-sm">
                                            Most popular: <span className="font-medium text-primary">Excellent</span> (42%)
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="w-full"
                                        style={{ height: "240px" }}
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={mockChartData2}
                                            layout="vertical"
                                            margin={{
                                                right: 32,
                                            }}
                                            maxBarSize={60}
                                        >
                                            <CartesianGrid horizontal={false} />
                                            <YAxis
                                                dataKey="answer"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) => value}
                                                hide
                                            />
                                            <XAxis dataKey="count" type="number" hide />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="line" />}
                                            />
                                            <Bar
                                                dataKey="count"
                                                layout="vertical"
                                                fill="var(--muted-foreground)"
                                                radius={4}
                                            >
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Chart 3 */}
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-lg">Would you recommend us to others?</CardTitle>
                                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span>125 total responses</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-sm">
                                            Most popular: <span className="font-medium text-primary">Yes</span> (68%)
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="w-full"
                                        style={{ height: "180px" }}
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={mockChartData3}
                                            layout="vertical"
                                            margin={{
                                                right: 32,
                                            }}
                                            maxBarSize={60}
                                        >
                                            <CartesianGrid horizontal={false} />
                                            <YAxis
                                                dataKey="answer"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) => value}
                                                hide
                                            />
                                            <XAxis dataKey="count" type="number" hide />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="line" />}
                                            />
                                            <Bar
                                                dataKey="count"
                                                layout="vertical"
                                                fill="var(--muted-foreground)"
                                                radius={4}
                                            >
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Overlay Message */}
                        <div className="absolute inset-0 flex items-start justify-center pt-12 sm:pt-16">
                            <Card className="max-w-md mx-4 shadow-lg border-2">
                                <CardContent className="pt-6">
                                    <div className="text-center flex flex-col items-center gap-4">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <LucideFolderOpen className="text-primary size-8" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xl font-semibold">
                                                No survey selected
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                Select a survey from the dropdown above to view detailed results and analytics.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : loading ? (
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center justify-center w-full">
                                <div className="relative flex items-center justify-center w-20 h-20">
                                    <span
                                        className="relative inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
                                        role="status"
                                        aria-label="Loading"
                                        tabIndex={0}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : !surveyData ? (
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-muted-foreground text-lg mb-2">No data available</p>
                                <p className="text-muted-foreground">This survey doesn't have any responses yet</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="">
                        {/* Survey Info */}
                        <Card className="border-none shadow-none bg-transparent">
                            <CardHeader>
                                <CardTitle>{selectedSurvey.title}</CardTitle>
                                <CardDescription>{selectedSurvey.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Total Responses:</span>
                                        <span className="ml-2 text-muted-foreground">{selectedSurvey.totalResponses}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Created:</span>
                                        <span className="ml-2 text-muted-foreground">{selectedSurvey.createdAt}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Questions:</span>
                                        <span className="ml-2 text-muted-foreground">{processedQuestions.length}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Questions Results */}
                        {viewMode === "charts" ? (
                            <div className="px-6 space-y-6">
                                {processedQuestions.map((question) => renderQuestionChart(question))}
                            </div>
                        ) : (
                            <RawDataTable survey={selectedSurvey} rawData={rawData} />
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
