"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Home, Moon, Sun } from "lucide-react"
import { Link } from "@/i18n/navigation"

export default function SurveyErrorPage() {
    const t = useTranslations("PublicSurvey.error")
    const tToggle = useTranslations("PublicSurvey")
    const searchParams = useSearchParams()
    const message = searchParams.get('message') || t("description")
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = React.useCallback(() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }, [resolvedTheme, setTheme])

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Theme Toggle */}
            <div className="w-full flex justify-end p-4 sm:p-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label={tToggle("toggleTheme")}
                >
                    {mounted && (
                        <>
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </>
                    )}
                </Button>
            </div>

            {/* Error Message */}
            <div className="flex-1 flex items-center justify-center px-4 pb-20">
                <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
                    <div className="rounded-full bg-destructive/10 dark:bg-destructive/20 p-4">
                        <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive" />
                    </div>
                    <div className="space-y-4 w-full">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                            {t("title")}
                        </h2>
                        <Alert variant="destructive" className="text-left">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {t("description")}
                        </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 mt-4" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            {t("goHome")}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
