"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { QuestionFormat, SurveyStatus } from "@/lib/generated/prisma"
import { getSurvey } from "@/components/server-actions/survey"
import { toast } from "sonner"
import { SurveyData } from "../survey/edit-survey-form"

interface QuestionOption {
    id: string
    text: string
    order: number
    isOther: boolean
}

interface Question {
    id: string
    title: string
    description?: string
    format: QuestionFormat
    required: boolean
    order: number
    yesLabel?: string
    noLabel?: string
    buttonLabel?: string
    options: QuestionOption[]
}

interface SurveyStyle {
    backgroundColor: string
    textColor: string
    buttonBackgroundColor: string
    buttonTextColor: string
    margin: string
    padding: string
    border: string
    borderRadius: string
    titleFontSize: string
    bodyFontSize: string
    fontFamily: string
}

interface Survey {
    id: string
    name: string
    description?: string
    status: SurveyStatus
    questions: Question[]
    style?: SurveyStyle
}

export interface SurveyResponse {
    questionId: string
    optionId?: string
    textValue?: string
    numberValue?: number
    booleanValue?: boolean
    isOther?: boolean
}

interface SurveyWidgetProps {
    surveyId?: string
    surveyData?: Survey | SurveyData
    key: string
    testMode?: boolean
    onComplete?: (responses: SurveyResponse[]) => void
    onError?: (error: string) => void
}

export const SurveyWidget = ({
    surveyId,
    surveyData,
    key,
    testMode = false,
    onComplete,
    onError
}: SurveyWidgetProps) => {
    const [survey, setSurvey] = useState<Survey | SurveyData | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [responses, setResponses] = useState<SurveyResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [otherText, setOtherText] = useState<{ [questionId: string]: string }>({})

    // Load survey data
    useEffect(() => {
        const loadSurvey = async () => {
            try {
                // If surveyData is provided directly, use it
                if (surveyData) {
                    setSurvey(surveyData as SurveyData)
                    setIsLoading(false)
                    return
                }

                // Otherwise, load from surveyId
                if (surveyId) {
                    const result = await getSurvey(surveyId)
                    if (result.success && result.survey) {
                        setSurvey(result.survey)
                    } else {
                        onError?.(result.error || "Failed to load survey")
                    }
                } else {
                    onError?.("Either surveyId or surveyData must be provided")
                }
            } catch (error) {
                onError?.(error instanceof Error ? error.message : "Failed to load survey")
            } finally {
                setIsLoading(false)
            }
        }

        loadSurvey()
    }, [surveyId, surveyData, onError])

    const currentQuestion = survey?.questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === (survey?.questions.length || 0) - 1
    const isFirstQuestion = currentQuestionIndex === 0

    const handleResponseChange = (questionId: string, value: any, optionId?: string, isOther = false) => {
        setResponses(prev => {
            const existingIndex = prev.findIndex(r => r.questionId === questionId)

            // If updating an existing response, preserve the optionId if not provided
            const finalOptionId = optionId || (existingIndex >= 0 ? prev[existingIndex].optionId : undefined)

            const newResponse: SurveyResponse = {
                questionId,
                optionId: finalOptionId,
                textValue: typeof value === 'string' ? value : undefined,
                numberValue: typeof value === 'number' ? value : undefined,
                booleanValue: typeof value === 'boolean' ? value : undefined,
                isOther
            }

            if (existingIndex >= 0) {
                const updated = [...prev]
                updated[existingIndex] = newResponse
                return updated
            } else {
                return [...prev, newResponse]
            }
        })

        // Clear otherText if "Other" option is deselected
        if (!isOther) {
            setOtherText(prev => {
                const updated = { ...prev }
                delete updated[questionId]
                return updated
            })
        }
    }

    const handleMultipleChoiceChange = (questionId: string, optionId: string, checked: boolean) => {
        // Check if this is the "Other" option being deselected
        const isOtherOption = currentQuestion?.options.find(opt => opt.id === optionId)?.isOther
        if (isOtherOption && !checked) {
            // Clear otherText when "Other" is deselected
            setOtherText(prev => {
                const updated = { ...prev }
                delete updated[questionId]
                return updated
            })
        }

        setResponses(prev => {
            const existingResponse = prev.find(r => r.questionId === questionId)

            if (existingResponse) {
                // Update existing response
                const updated = prev.map(r => {
                    if (r.questionId === questionId) {
                        const currentOptions = r.optionId ? r.optionId.split(',') : []

                        if (checked) {
                            // Add option if not already present
                            if (!currentOptions.includes(optionId)) {
                                currentOptions.push(optionId)
                            }
                        } else {
                            // Remove option
                            const filteredOptions = currentOptions.filter(id => id !== optionId)
                            return {
                                ...r,
                                optionId: filteredOptions.length > 0 ? filteredOptions.join(',') : undefined
                            }
                        }

                        const newOptionId = currentOptions.join(',')
                        return {
                            ...r,
                            optionId: newOptionId
                        }
                    }
                    return r
                })
                return updated
            } else if (checked) {
                // Create new response
                const newResponse = { questionId, optionId }
                return [...prev, newResponse]
            }

            return prev
        })
    }

    const handleNext = () => {
        if (currentQuestion?.required) {
            const hasResponse = responses.some(r => r.questionId === currentQuestion.id)
            if (!hasResponse) {
                toast.error("This question is required")
                return
            }
        }

        if (isLastQuestion) {
            handleSubmit()
        } else {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        if (testMode) {
            onComplete?.(responses)
            toast.success("Survey completed (Test Mode)")
            return
        }

        setIsSubmitting(true)
        try {
            // Here you would implement the actual submission logic
            // For now, we'll just call the onComplete callback
            onComplete?.(responses)
            toast.success("Survey completed successfully!")
        } catch (error) {
            onError?.(error instanceof Error ? error.message : "Failed to submit survey")
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderQuestion = () => {
        if (!currentQuestion) return null

        const currentResponse = responses.find(r => r.questionId === currentQuestion.id)

        switch (currentQuestion.format) {
            case QuestionFormat.YES_NO:
                return (
                    <>
                        <RadioGroup
                            value={currentResponse?.booleanValue?.toString()}
                            onValueChange={(value) => handleResponseChange(
                                currentQuestion.id,
                                value === 'true',
                                undefined,
                                false
                            )}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="yes" />
                                <Label htmlFor="yes" className="text-base">
                                    {currentQuestion.yesLabel || "Yes"}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="no" />
                                <Label htmlFor="no" className="text-base">
                                    {currentQuestion.noLabel || "No"}
                                </Label>
                            </div>
                        </RadioGroup>
                    </>
                )

            case QuestionFormat.SINGLE_CHOICE:
                return (
                    <>
                        <RadioGroup
                            value={currentResponse?.optionId}
                            onValueChange={(value) => handleResponseChange(currentQuestion.id, value, value, false)}
                        >
                            {currentQuestion.options.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.id || ''} id={option.id || ''} />
                                    <Label htmlFor={option.id} className="text-base">
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {currentQuestion.options.some(opt => opt.isOther) &&
                            currentQuestion.options.find(opt => opt.isOther)?.id === currentResponse?.optionId && (
                                <div className="space-y-2">
                                    <Input
                                        autoFocus={true}
                                        placeholder=""
                                        value={otherText[currentQuestion.id] || ''}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setOtherText(prev => ({
                                                ...prev,
                                                [currentQuestion.id]: value
                                            }))
                                            // Save the "Other" text to the response
                                            handleResponseChange(currentQuestion.id, value, currentResponse?.optionId, true)
                                        }}
                                    />
                                </div>
                            )}
                    </>
                )

            case QuestionFormat.MULTIPLE_CHOICE:
                return (
                    <>
                        {currentQuestion.options.map((option, index) => {
                            const selectedOptions = currentResponse?.optionId?.split(',') || []
                            const optionId = option.id || `option_${index}`
                            const isChecked = selectedOptions.includes(optionId)

                            return (
                                <div key={optionId} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={optionId}
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                            handleMultipleChoiceChange(currentQuestion.id, optionId, !!checked)
                                        }}
                                    />
                                    <Label htmlFor={optionId} className="text-base">
                                        {option.text}
                                    </Label>
                                </div>
                            )
                        })}
                        {currentQuestion.options.some(opt => opt.isOther) &&
                            currentQuestion.options.find(opt => opt.isOther) &&
                            currentResponse?.optionId?.split(',').includes(currentQuestion.options.find(opt => opt.isOther)?.id || '') && (
                                <div className="mt-4">
                                    <Input
                                        autoFocus={true}
                                        placeholder=""
                                        value={otherText[currentQuestion.id] || ''}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setOtherText(prev => ({
                                                ...prev,
                                                [currentQuestion.id]: value
                                            }))
                                            // Save the "Other" text to the response
                                            handleResponseChange(currentQuestion.id, value, currentResponse?.optionId, true)
                                        }}
                                    />
                                </div>
                            )}
                    </>
                )

            case QuestionFormat.STAR_RATING:
                return (
                    <>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => handleResponseChange(currentQuestion.id, rating)}
                                    className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer"
                                >
                                    <Star
                                        className={`h-8 w-8 ${currentResponse?.numberValue && rating <= currentResponse.numberValue
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </>
                )

            case QuestionFormat.LONG_TEXT:
                return (
                    <>
                        <Textarea
                            autoFocus={true}
                            placeholder=""
                            value={currentResponse?.textValue || ''}
                            onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </>
                )

            case QuestionFormat.STATEMENT:
                return (
                    <>
                        <div className="text-start">
                            <p className="text-lg font-medium mb-4">{currentQuestion.description}</p>
                        </div>
                    </>
                )

            default:
                return <p>Unsupported question format</p>
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!survey) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Survey not found</p>
            </div>
        )
    }

    if (survey.status !== SurveyStatus.published && !testMode) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">This survey is not available</p>
            </div>
        )
    }

    const widgetStyle = survey.style || {
        backgroundColor: "transparent",
        textColor: "#222222",
        buttonBackgroundColor: "#222222",
        buttonTextColor: "#ffffff",
        margin: "16px 0px",
        padding: "16px",
        border: "1px solid #222222",
        borderRadius: "6px",
        titleFontSize: "18px",
        bodyFontSize: "16px",
        fontFamily: "Inter"
    }

    return (
        <div
            className="max-w-[300px] min-h-[300px] mx-auto"
        >
            <Card
                className="shadow-lg max-w-[300px] min-h-[300px] flex flex-col justify-between"
                style={{
                    backgroundColor: widgetStyle.backgroundColor === 'transparent' ? 'transparent' : widgetStyle.backgroundColor,
                    fontFamily: widgetStyle.fontFamily,
                    border: widgetStyle.border,
                    borderRadius: widgetStyle.borderRadius,
                    margin: widgetStyle.margin,
                    padding: widgetStyle.padding
                }}
            >

                <CardContent className="px-2 space-y-2 mb-4">
                    {currentQuestion && (
                        <>
                            <div >
                                <h2
                                    className="text-lg font-semibold"
                                    style={{
                                        color: widgetStyle.textColor,
                                        fontSize: widgetStyle.titleFontSize
                                    }}
                                >
                                    {currentQuestion.title}
                                </h2>
                                {currentQuestion.description && currentQuestion.format !== QuestionFormat.STATEMENT && (
                                    <p
                                        className="text-muted-foreground"
                                        style={{
                                            color: widgetStyle.textColor,
                                            fontSize: widgetStyle.bodyFontSize,
                                            opacity: 0.8
                                        }}
                                    >
                                        {currentQuestion.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 mt-4 flex flex-col justify-center items-start">
                                {renderQuestion()}
                            </div>

                            {currentQuestion.required && (
                                <span className="text-red-500 text-xs">* Required</span>
                            )}
                        </>
                    )}
                </CardContent>

                <CardFooter className="px-2 flex flex-col justify-between py-0">
                    <div className="flex w-full justify-start">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirstQuestion}
                            className="flex items-center gap-2 mr-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                            style={{
                                backgroundColor: widgetStyle.buttonBackgroundColor,
                                color: widgetStyle.buttonTextColor,
                                border: 'none'
                            }}
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) :
                                isLastQuestion ? <CheckCircle className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />
                            }
                            {isLastQuestion ? 'Complete' : 'Continue'}
                        </Button>
                    </div>
                    <div className="mt-6 w-full flex justify-start">
                        <div className="flex items-center text-xs text-muted-foreground">
                            <p>Powered by <strong>Opineeo</strong> </p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
