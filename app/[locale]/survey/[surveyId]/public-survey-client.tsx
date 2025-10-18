"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { CheckCircle, Moon, Sun } from "lucide-react"
import { OpineeoSurvey, SurveyResponse } from "@/components/survey-render"
import { Card, CardContent } from "@/components/ui/card"

interface PublicSurveyClientProps {
    surveyId: string
    token: string
    surveyName: string
    surveyDescription: string | null
}

export const PublicSurveyClient: React.FC<PublicSurveyClientProps> = ({
    surveyId,
    token,
    surveyName,
    surveyDescription,
}) => {
    const t = useTranslations("PublicSurvey")
    const [completed, setCompleted] = React.useState(false)
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleComplete = React.useCallback((responses: SurveyResponse[]) => {
        console.log('Survey completed:', responses)
        setCompleted(true)
    }, [])

    const handleClose = React.useCallback(() => {
        console.log('Survey closed')
    }, [])

    const toggleTheme = React.useCallback(() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }, [resolvedTheme, setTheme])

    if (completed) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                {/* Theme Toggle */}
                <div className="w-full flex justify-end p-4 sm:p-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label={t("toggleTheme")}
                    >
                        {mounted && (
                            <>
                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </>
                        )}
                    </Button>
                </div>

                {/* Success Message */}
                <div className="flex-1 flex items-center justify-center px-4 pb-20">
                    <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 dark:text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                                {t("thankYou")}
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground">
                                {t("responseSubmitted")}
                            </p>
                        </div>
                        {/*}
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="mt-4"
                        >
                            {t("submitAnother")}
                        </Button>
                        */}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Theme Toggle */}
            <div className="w-full flex justify-end p-4 sm:p-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label={t("toggleTheme")}
                >
                    {mounted && (
                        <>
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </>
                    )}
                </Button>
            </div>

            {/* Survey Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20 ">
                <div className="w-full flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8">
                    {/* Survey Header */}
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                            {surveyName}
                        </h2>
                        {surveyDescription && (
                            <p className="text-center sm:text-lg text-muted-foreground max-w-xl mx-auto">
                                {surveyDescription}
                            </p>
                        )}
                    </div>

                    <Card className="max-w-[380px] min-w-[320px] min-h-[300px] flex flex-col justify-between">
                        <CardContent>
                            {/* Survey Widget */}
                            <div className="flex justify-center w-full">
                                <OpineeoSurvey
                                    surveyId={surveyId}
                                    token={token}
                                    onComplete={handleComplete}
                                    onClose={handleClose}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
