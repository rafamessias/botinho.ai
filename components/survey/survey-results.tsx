"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Download, Table, BarChart3 } from "lucide-react"

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Table as TableComponent,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RawDataTable } from "./raw-data-table"
import { SurveyData, Question, Option, SurveyResponse, ResponseAnswer } from "./types"

interface SurveyResultsProps {
    surveys: SurveyData[]
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({ surveys }) => {
    const [selectedSurveyId, setSelectedSurveyId] = React.useState<string>("")
    const [viewMode, setViewMode] = React.useState<"charts" | "table">("charts")
    const [isExporting, setIsExporting] = React.useState(false)

    const selectedSurvey = surveys.find(survey => survey.id === selectedSurveyId)

    const handleExport = async (format: "csv" | "excel") => {
        if (!selectedSurvey) return

        setIsExporting(true)

        try {
            if (format === "csv") {
                await exportToCSV(selectedSurvey)
            } else {
                await exportToExcel(selectedSurvey)
            }
        } catch (error) {
            console.error("Export failed:", error)
        } finally {
            setIsExporting(false)
        }
    }

    const exportToCSV = async (survey: SurveyData) => {
        const csvContent = generateCSVContent(survey)
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${survey.title.replace(/\s+/g, "_")}_results.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportToExcel = async (survey: SurveyData) => {
        // For Excel export, we'll create a CSV that can be opened in Excel
        // In a real implementation, you'd use a library like xlsx
        const csvContent = generateCSVContent(survey)
        const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${survey.title.replace(/\s+/g, "_")}_results.xls`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const generateCSVContent = (survey: SurveyData): string => {
        let csvContent = `Survey: ${survey.title}\n`
        csvContent += `Total Responses: ${survey.totalResponses}\n`
        csvContent += `Date: ${survey.createdAt}\n\n`

        if (survey.responses && survey.responses.length > 0) {
            // Raw data format
            const headers = ["Response #", "Submitted At", ...survey.questions.map(q => `"${q.text}"`)]
            csvContent += headers.join(",") + "\n"

            survey.responses.forEach((response, index) => {
                const row = [
                    index + 1,
                    new Date(response.submittedAt).toLocaleDateString(),
                    ...survey.questions.map(question => {
                        const answer = response.answers.find(a => a.questionId === question.id)
                        return `"${(answer?.answer || "No response").replace(/"/g, '""')}"`
                    })
                ]
                csvContent += row.join(",") + "\n"
            })
        } else {
            // Fallback to aggregated format if no raw data
            survey.questions.forEach((question, index) => {
                csvContent += `Question ${index + 1}: ${question.text}\n`

                if (question.type === "text") {
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
        if (question.type === "text" || !question.options) return null

        const data = question.options.map(option => ({
            answer: option.label,
            count: option.count,
            percentage: question.options ?
                ((option.count / question.options.reduce((sum, opt) => sum + opt.count, 0)) * 100).toFixed(1) : 0
        }))

        const chartConfig = {
            count: {
                label: "Responses",
            },
            label: {
                color: "hsl(var(--foreground-muted))",
            },
        } satisfies ChartConfig

        const totalResponses = question.options.reduce((sum, option) => sum + option.count, 0)
        const topAnswer = data.reduce((prev, current) => (prev.count > current.count) ? prev : current)

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
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{totalResponses}</div>
                                <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{topAnswer.count}</div>
                                <div className="text-xs text-muted-foreground">Top Answer</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{topAnswer.percentage}%</div>
                                <div className="text-xs text-muted-foreground">Top %</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{data.length}</div>
                                <div className="text-xs text-muted-foreground">Options</div>
                            </div>
                        </div>

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
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle>Survey Results</CardTitle>
                    <CardDescription>
                        Select a survey to view its results and analytics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <Select value={selectedSurveyId} onValueChange={setSelectedSurveyId}>
                                <SelectTrigger className="w-full sm:max-w-md">
                                    <SelectValue placeholder="Select a survey to view results" />
                                </SelectTrigger>
                                <SelectContent>
                                    {surveys.map((survey) => (
                                        <SelectItem key={survey.id} value={survey.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{survey.title}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {survey.totalResponses} responses • {survey.createdAt}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedSurvey && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="view-mode"
                                        checked={viewMode === "table"}
                                        onCheckedChange={(checked) => setViewMode(checked ? "table" : "charts")}
                                    />
                                    <Label htmlFor="view-mode" className="flex items-center gap-2">
                                        {viewMode === "charts" ? <BarChart3 className="h-4 w-4" /> : <Table className="h-4 w-4" />}
                                        {viewMode === "charts" ? "Charts" : "Table"}
                                    </Label>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" disabled={isExporting}>
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
                <Card className="border-none shadow-none">
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-muted-foreground text-lg mb-2">No survey selected</p>
                            <p className="text-muted-foreground">Please select a survey from the dropdown above to view results</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Survey Info */}
                    <Card className="border-none shadow-none">
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
                                    <span className="ml-2 text-muted-foreground">{selectedSurvey.questions.length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions Results */}
                    {viewMode === "charts" ? (
                        selectedSurvey.questions.map((question) => renderQuestionChart(question))
                    ) : (
                        <RawDataTable survey={selectedSurvey} />
                    )}
                </div>
            )}
        </div>
    )
}
