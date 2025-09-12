"use client"

import { SurveyWidget } from './survey-widget'
import { QuestionFormat } from '@/lib/generated/prisma'

// Example JSON data structure for a survey
const exampleSurveyJSON = {
    id: "example-survey",
    name: "Customer Satisfaction Survey",
    description: "Help us improve our service by sharing your feedback",
    status: "published",
    questions: [
        {
            id: "q1",
            title: "How satisfied are you with our service?",
            description: "Please rate your overall experience",
            format: QuestionFormat.STAR_RATING,
            required: true,
            order: 0,
            options: []
        },
        {
            id: "q2",
            title: "Would you recommend us to a friend?",
            description: "Your honest opinion matters to us",
            format: QuestionFormat.YES_NO,
            required: true,
            order: 1,
            yesLabel: "Yes, definitely!",
            noLabel: "No, probably not",
            options: []
        },
        {
            id: "q3",
            title: "What did you like most about our service?",
            description: "Select all that apply",
            format: QuestionFormat.MULTIPLE_CHOICE,
            required: false,
            order: 2,
            options: [
                {
                    id: "opt1",
                    text: "Fast response time",
                    order: 0,
                    isOther: false
                },
                {
                    id: "opt2",
                    text: "Friendly staff",
                    order: 1,
                    isOther: false
                },
                {
                    id: "opt3",
                    text: "Quality of service",
                    order: 2,
                    isOther: false
                },
                {
                    id: "opt4",
                    text: "Other",
                    order: 3,
                    isOther: true
                }
            ]
        },
        {
            id: "q4",
            title: "Any additional comments?",
            description: "Feel free to share any other thoughts",
            format: QuestionFormat.LONG_TEXT,
            required: false,
            order: 3,
            options: []
        }
    ],
    style: {
        backgroundColor: "#f8fafc",
        textColor: "#1e293b",
        buttonBackgroundColor: "#3b82f6",
        buttonTextColor: "#ffffff",
        margin: "20px 0px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        titleFontSize: "20px",
        bodyFontSize: "16px",
        fontFamily: "Inter"
    }
}

export const SurveyWidgetJSONDemo = () => {
    const handleComplete = (responses: any[]) => {
        console.log("Survey completed with responses:", responses)
        alert("Survey completed! Check the console for responses.")
    }

    const handleError = (error: string) => {
        console.error("Survey error:", error)
        alert(`Survey error: ${error}`)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">Survey Widget with JSON Data</h2>
                <p className="text-muted-foreground mb-6">
                    This example shows how to use the SurveyWidget with JSON data instead of a survey ID.
                </p>
            </div>

            {/* Method 1: Using SurveyWidget directly with surveyData prop */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Method 1: Direct JSON Data</h3>
                <SurveyWidget
                    surveyData={exampleSurveyJSON as any}
                    key="direct-json"
                    testMode={true}
                    onComplete={handleComplete}
                    onError={handleError}
                />
            </div>

            {/* JSON Structure Example */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">JSON Structure Example</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify(exampleSurveyJSON, null, 2)}</code>
                </pre>
            </div>
        </div>
    )
}
