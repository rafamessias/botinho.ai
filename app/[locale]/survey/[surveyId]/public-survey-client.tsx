"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { SurveyWidget, SurveyResponse } from "@/components/survey-render/survey-widget"
import { QuestionFormat, Survey, SurveyStatus } from "@/lib/generated/prisma"

interface SurveyData {
    id: string
    name: string
    description: string | null
    allowMultipleResponses: boolean
    style: any
    questions: Array<{
        id: string
        title: string
        description: string | null
        format: QuestionFormat
        required: boolean
        order: number
        yesLabel: string | null
        noLabel: string | null
        options: Array<{
            id: string
            text: string
            order: number
            isOther: boolean
        }>
    }>
}

interface ApiResponse {
    success: boolean
    data?: {
        survey: SurveyData
    }
    error?: string
}

interface PublicSurveyClientProps {
    surveyId: string
    token: string
}

export const PublicSurveyClient: React.FC<PublicSurveyClientProps> = ({
    surveyId,
    token
}) => {
    const [survey, setSurvey] = React.useState<SurveyData | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [submitted, setSubmitted] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)

    const fetchSurvey = React.useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/survey/v0?surveyId=${surveyId}&token=${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data: ApiResponse = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch survey')
            }

            setSurvey(data.data?.survey || null)
        } catch (err) {
            console.error('Error fetching survey:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch survey')
        } finally {
            setLoading(false)
        }
    }, [surveyId, token])

    React.useEffect(() => {
        fetchSurvey()
    }, [fetchSurvey])

    const handleSurveySubmit = async (responses: SurveyResponse[]) => {
        if (!survey) return

        try {
            setSubmitting(true)

            const response = await fetch('/api/survey/v0', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    surveyId: survey.id,
                    responses: responses,
                    userIp: '', // Will be handled by the API
                    extraInfo: '',
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to submit survey')
            }

            setSubmitted(true)
        } catch (err) {
            console.error('Error submitting survey:', err)
            setError(err instanceof Error ? err.message : 'Failed to submit survey')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading survey...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <Button
                            onClick={fetchSurvey}
                            variant="outline"
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                        <p className="text-muted-foreground mb-4">
                            Your response has been submitted successfully.
                        </p>
                        {survey?.allowMultipleResponses && (
                            <Button
                                onClick={() => {
                                    setSubmitted(false)
                                    fetchSurvey()
                                }}
                                variant="outline"
                            >
                                Submit Another Response
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!survey) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
                        <p className="text-muted-foreground">Survey not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Card className="mb-6">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl md:text-3xl">{survey.name}</CardTitle>
                        {survey.description && (
                            <CardDescription className="text-base md:text-lg">
                                {survey.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                </Card>

                <SurveyWidget
                    surveyData={survey as any}
                    key={survey.id}
                    onComplete={handleSurveySubmit}
                    onError={setError}
                />
            </div>
        </div>
    )
}
