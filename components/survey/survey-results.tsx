"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Download, Table, BarChart3, ChevronDown } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RawDataTable } from "./raw-data-table"
import { SurveyData, Question } from "./types"
import { getSurveyResponseSummary, getQuestionResponses } from "@/components/server-actions/survey"
import { SurveyResponseSummary } from "@/lib/generated/prisma"

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
    surveys: SurveyData[]
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({ surveys }) => {
    const [selectedSurveyId, setSelectedSurveyId] = React.useState<string>("")
    const [viewMode, setViewMode] = React.useState<"charts" | "table">("charts")
    const [isExporting, setIsExporting] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [surveyData, setSurveyData] = React.useState<SurveyResponseSummaryWithRelations[] | null>(null)
    const [processedQuestions, setProcessedQuestions] = React.useState<Question[]>([])
    const [rawData, setRawData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    const selectedSurvey = surveys.find(survey => survey.id === selectedSurveyId)

    // Fetch survey data when a survey is selected
    React.useEffect(() => {
        const fetchSurveyData = async () => {
            if (!selectedSurveyId) {
                setSurveyData(null)
                setRawData([])
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
                    response.question?.title || "",
                    response.question?.format || "",
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
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <BarChart
                                accessibilityLayer
                                data={data}
                                layout="vertical"
                                margin={{
                                    right: 32,
                                }}
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
                                    fill="var(--primary)"
                                    radius={4}
                                    height={24}
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


    if (surveys.length === 0) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-muted-foreground">No surveys available</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
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
                                    <Switch
                                        id="view-mode"
                                        checked={viewMode === "table"}
                                        onCheckedChange={(checked) => setViewMode(checked ? "table" : "charts")}
                                        disabled={loading}
                                    />
                                    <Label htmlFor="view-mode" className="flex items-center gap-2">
                                        {viewMode === "charts" ? <BarChart3 className="h-4 w-4" /> : <Table className="h-4 w-4" />}
                                        {viewMode === "charts" ? "Charts" : "Table"}
                                    </Label>
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
                <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-muted-foreground text-lg mb-2">No survey selected</p>
                            <p className="text-muted-foreground">Please select a survey from the dropdown above to view results</p>
                        </div>
                    </CardContent>
                </Card>
            ) : loading ? (
                <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-muted-foreground text-lg mb-2">Loading survey data...</p>
                            <p className="text-muted-foreground">Please wait while we fetch the results</p>
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
                <div className="space-y-6">
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
                        processedQuestions.map((question) => renderQuestionChart(question))
                    ) : (
                        <RawDataTable survey={selectedSurvey} rawData={rawData} />
                    )}
                </div>
            )}
        </div>
    )
}
