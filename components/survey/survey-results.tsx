"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Download, Table, BarChart3, ChevronDown, LucideFolderOpen, LucidePlusCircle, LucideSparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"

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
                    <CardTitle className="text-lg">{question.text}</CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span>{totalResponses} total responses</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-sm">
                            Most popular: <span className="font-medium text-primary">{topAnswer.answer}</span> ({topAnswer.percentage}%)
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">

                        {/* Chart */}
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
