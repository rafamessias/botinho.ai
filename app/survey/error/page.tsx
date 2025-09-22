"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"

export default function SurveyErrorPage() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message') || 'An error occurred'

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md mx-4">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Survey Error</h2>
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Please check that you have the correct survey link and token.
                        </p>
                        <Link href="/">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
