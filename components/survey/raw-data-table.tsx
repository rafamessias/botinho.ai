"use client"

import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table as TableComponent,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SurveyData } from "./types"

interface RawDataTableProps {
    survey: SurveyData
    rawData?: any[]
}

export const RawDataTable: React.FC<RawDataTableProps> = ({ survey, rawData }) => {
    if (!rawData || rawData.length === 0) {
        return (
            <Card className="shadow-none border-none">
                <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-muted-foreground">No response data available</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Group responses by response ID
    const responseGroups = new Map<string, any[]>()
    rawData.forEach(response => {
        const responseId = response.response.id
        if (!responseGroups.has(responseId)) {
            responseGroups.set(responseId, [])
        }
        responseGroups.get(responseId)!.push(response)
    })

    // Get unique questions for headers
    const questions = Array.from(new Set(rawData.map(r => r.question.id)))
        .map(id => rawData.find(r => r.question.id === id)!.question)
        .sort((a, b) => a.order - b.order)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Raw Response Data</CardTitle>
                <CardDescription>
                    Individual responses from {responseGroups.size} survey participants
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                        <TableComponent>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Response #</TableHead>
                                    <TableHead className="w-[150px]">Submitted At</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    {questions.map((question) => (
                                        <TableHead key={question.id} className="min-w-[200px]">
                                            {question.title}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from(responseGroups.entries()).map(([responseId, responses], index) => {
                                    const firstResponse = responses[0]
                                    const submittedAt = firstResponse.response.submittedAt
                                        ? new Date(firstResponse.response.submittedAt).toLocaleDateString()
                                        : "Not submitted"
                                    const status = firstResponse.response.status

                                    return (
                                        <TableRow key={responseId}>
                                            <TableCell className="font-medium">
                                                #{index + 1}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {submittedAt}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs ${status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {status}
                                                </span>
                                            </TableCell>
                                            {questions.map((question) => {
                                                const answer = responses.find(r => r.question.id === question.id)
                                                let answerText = ""

                                                if (answer) {
                                                    if (answer.textValue) {
                                                        answerText = answer.textValue
                                                    } else if (answer.option) {
                                                        answerText = answer.option.text
                                                    } else if (answer.numberValue !== null) {
                                                        answerText = answer.numberValue.toString()
                                                    } else if (answer.booleanValue !== null) {
                                                        answerText = answer.booleanValue ? "Yes" : "No"
                                                    }
                                                }

                                                return (
                                                    <TableCell key={question.id} className="max-w-[300px]">
                                                        <div className="truncate" title={answerText || "No response"}>
                                                            {answerText || (
                                                                <span className="text-muted-foreground italic">
                                                                    No response
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </TableComponent>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
