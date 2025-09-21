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
}

export const RawDataTable: React.FC<RawDataTableProps> = ({ survey }) => {
    if (!survey.responses || survey.responses.length === 0) {
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Raw Response Data</CardTitle>
                <CardDescription>
                    Individual responses from {survey.totalResponses} survey participants
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
                                    {survey.questions.map((question) => (
                                        <TableHead key={question.id} className="min-w-[200px]">
                                            {question.text}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {survey.responses.map((response, index) => (
                                    <TableRow key={response.id}>
                                        <TableCell className="font-medium">
                                            #{index + 1}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(response.submittedAt).toLocaleDateString()}
                                        </TableCell>
                                        {survey.questions.map((question) => {
                                            const answer = response.answers.find(a => a.questionId === question.id)
                                            return (
                                                <TableCell key={question.id} className="max-w-[300px]">
                                                    <div className="truncate" title={answer?.answer || "No response"}>
                                                        {answer?.answer || (
                                                            <span className="text-muted-foreground italic">
                                                                No response
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableComponent>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
