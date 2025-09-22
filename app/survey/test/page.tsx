"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink } from "lucide-react"

export default function SurveyTestPage() {
    const [surveyId, setSurveyId] = useState("")
    const [token, setToken] = useState("")
    const [error, setError] = useState("")

    const handleTest = () => {
        if (!surveyId.trim() || !token.trim()) {
            setError("Please provide both Survey ID and Token")
            return
        }
        setError("")

        // Open the survey in a new tab
        const surveyUrl = `/survey/${surveyId}?token=${encodeURIComponent(token)}`
        window.open(surveyUrl, '_blank')
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Test Public Survey</CardTitle>
                        <CardDescription>
                            Enter a survey ID and token to test the public survey page
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="surveyId">Survey ID</Label>
                            <Input
                                id="surveyId"
                                placeholder="Enter survey ID"
                                value={surveyId}
                                onChange={(e) => setSurveyId(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="token">Team Token</Label>
                            <Input
                                id="token"
                                placeholder="Enter team token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleTest} className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Survey
                        </Button>

                        <div className="text-sm text-muted-foreground space-y-2">
                            <p><strong>How to use:</strong></p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Get a survey ID from your dashboard</li>
                                <li>Get your team token from settings</li>
                                <li>Enter both values above and click "Open Survey"</li>
                                <li>The survey will open in a new tab</li>
                            </ol>

                            <p className="mt-4"><strong>URL Format:</strong></p>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                                /survey/[surveyId]?token=[teamToken]
                            </code>

                            <p className="mt-4"><strong>Headers (Alternative):</strong></p>
                            <div className="bg-muted p-2 rounded text-xs font-mono">
                                <div>Authorization: Bearer [teamToken]</div>
                                <div>or</div>
                                <div>X-Team-Token: [teamToken]</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
