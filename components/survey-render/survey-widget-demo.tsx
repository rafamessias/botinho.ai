"use client"

import { useState } from "react"
import { SurveyWidget } from "./survey-widget"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SurveyResponse } from "./survey-widget"

export const SurveyWidgetDemo = () => {
    const [surveyId, setSurveyId] = useState("")
    const [key, setKey] = useState("demo-key")
    const [testMode, setTestMode] = useState(true)
    const [showWidget, setShowWidget] = useState(false)
    const [responses, setResponses] = useState<SurveyResponse[]>([])
    const [isCompleted, setIsCompleted] = useState(false)

    const handleComplete = (responses: SurveyResponse[]) => {
        setResponses(responses)
        setIsCompleted(true)
        console.log("Survey completed with responses:", responses)
    }

    const handleError = (error: string) => {
        console.error("Survey error:", error)
        alert(`Error: ${error}`)
    }

    const handleStartSurvey = () => {
        if (!surveyId.trim()) {
            alert("Please enter a survey ID")
            return
        }
        setShowWidget(true)
        setIsCompleted(false)
        setResponses([])
    }

    const handleReset = () => {
        setShowWidget(false)
        setIsCompleted(false)
        setResponses([])
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Survey Widget Demo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="survey-id">Survey ID</Label>
                            <Input
                                id="survey-id"
                                placeholder="Enter survey ID"
                                value={surveyId}
                                onChange={(e) => setSurveyId(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="key">Key</Label>
                            <Input
                                id="key"
                                placeholder="Enter key"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="test-mode"
                            checked={testMode}
                            onCheckedChange={setTestMode}
                        />
                        <Label htmlFor="test-mode">Test Mode (No data saved)</Label>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleStartSurvey} disabled={!surveyId.trim()}>
                            {showWidget ? "Restart Survey" : "Start Survey"}
                        </Button>
                        {showWidget && (
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {showWidget && (
                <SurveyWidget
                    surveyId={surveyId}
                    key={key}
                    testMode={testMode}
                    onComplete={handleComplete}
                    onError={handleError}
                />
            )}

            {isCompleted && (
                <Card>
                    <CardHeader>
                        <CardTitle>Survey Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                            {JSON.stringify(responses, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
