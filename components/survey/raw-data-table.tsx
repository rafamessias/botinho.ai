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
    console.log(rawData)
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

    // Define the columns in the specified order
    const columns = [
        { key: 'userIP', label: 'User IP', width: 'w-[120px]' },
        { key: 'userId', label: 'User ID', width: 'w-[100px]' },
        { key: 'extraInfo', label: 'Extra Info', width: 'w-[150px]' },
        { key: 'questionId', label: 'Question ID', width: 'w-[120px]' },
        { key: 'questionTitle', label: 'Question Title', width: 'w-[200px]' },
        { key: 'questionFormat', label: 'Question Format', width: 'w-[130px]' },
        { key: 'optionId', label: 'Option ID', width: 'w-[100px]' },
        { key: 'isOther', label: 'Is Other', width: 'w-[80px]' },
        { key: 'textValue', label: 'Text Value', width: 'w-[200px]' },
        { key: 'numberValue', label: 'Number Value', width: 'w-[120px]' },
        { key: 'booleanValue', label: 'Boolean Value', width: 'w-[120px]' },
        { key: 'createdAt', label: 'Created At', width: 'w-[150px]' }
    ]

    return (
        <Card className="shadow-none border-none">
            <CardHeader>
                <CardTitle>Raw Response Data</CardTitle>
                <CardDescription>
                    Individual question responses ({rawData.length} total responses)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                        <TableComponent>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableHead key={column.key} className={column.width}>
                                            {column.label}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rawData.map((response, index) => (
                                    <TableRow key={`${response.response?.userId || 'unknown'}-${response.questionId}-${index}`}>
                                        <TableCell className="text-sm">
                                            {response.response?.userIp || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {response.response?.userId || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm max-w-[150px]">
                                            <div className="truncate" title={response.response?.extraInfo || ''}>
                                                {response.response?.extraInfo || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-mono">
                                            {response.questionId}
                                        </TableCell>
                                        <TableCell className="text-sm max-w-[200px]">
                                            <div className="truncate" title={response.questionTitle || ''}>
                                                {response.questionTitle || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {response.questionFormat || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm font-mono">
                                            {response.optionId || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {response.isOther ? 'Yes' : 'No'}
                                        </TableCell>
                                        <TableCell className="text-sm max-w-[200px]">
                                            <div className="truncate" title={response.textValue || ''}>
                                                {response.textValue || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {response.numberValue !== null ? response.numberValue : '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {response.booleanValue !== null ? (response.booleanValue ? 'Yes' : 'No') : '-'}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {response.createdAt
                                                ? new Date(response.createdAt).toLocaleString()
                                                : '-'
                                            }
                                        </TableCell>
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
