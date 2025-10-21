"use client"

import { useState, useTransition, useCallback, useMemo, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SurveyDetailsSection } from "@/components/survey/survey-details-section"
import { QuestionsSection } from "@/components/survey/questions-section"
import { StyleSection } from "@/components/survey/style-section"
import { updateSurvey, regenerateSurveyPublicToken } from "@/components/server-actions/survey"
import { toast } from "sonner"
import { QuestionFormat, SurveyType } from "@/lib/generated/prisma"
import { ArrowLeft, Clipboard, Eye, EyeOff, Settings, RefreshCw, Link as LinkIcon, ExternalLink } from "lucide-react"
import { useUser } from "../user-provider"
import { UpgradeModal } from "@/components/upgrade-modal"
import { getTeamTokenAction } from "@/components/server-actions/team"
import { useParams } from "next/navigation"
import { Separator } from "../ui/separator"
import { Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { AccordionContent } from "@radix-ui/react-accordion"

interface Question {
    id: string
    title: string
    description: string
    format: QuestionFormat
    required: boolean
    order: number
    yesLabel?: string
    noLabel?: string
    buttonLabel?: string
    options: Array<{
        id?: string
        text: string
        order: number
        isOther?: boolean
    }>
}

export interface SurveyData {
    id: string
    name: string
    description: string
    typeId?: string
    status: 'draft' | 'published' | 'archived'
    allowMultipleResponses: boolean
    questions: Question[]
    style: {
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
        styleMode: 'none' | 'basic' | 'advanced'
        basicCSS?: string
        advancedCSS?: string
    }
}

interface Survey {
    id: string
    name: string
    description: string | null
    typeId: string | null
    status: 'draft' | 'published' | 'archived'
    allowMultipleResponses: boolean
    publicToken: string | null
    questions: Array<{
        id: string
        title: string
        description: string | null
        format: QuestionFormat
        required: boolean
        order: number
        yesLabel: string | null
        noLabel: string | null
        buttonLabel: string | null
        options: Array<{
            id: string
            text: string
            order: number
            isOther: boolean
        }>
    }>
    style: {
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
        styleMode?: 'none' | 'basic' | 'advanced'
        basicCSS?: string
        advancedCSS?: string
    } | null
}

interface EditSurveyFormProps {
    survey: Survey
    surveyTypes: SurveyType[]
}

export const EditSurveyForm = ({ survey, surveyTypes }: EditSurveyFormProps) => {
    const t = useTranslations("CreateSurvey")
    const router = useRouter()
    const params = useParams()
    const locale = (params.locale as string) || 'en'
    const [isPending, startTransition] = useTransition()
    const [pendingAction, setPendingAction] = useState<'save' | 'publish' | null>(null)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [upgradeLimit, setUpgradeLimit] = useState<number | undefined>(undefined)
    const [currentToken, setCurrentToken] = useState<string | null>(null)
    const [showToken, setShowToken] = useState(false)
    const [publicToken, setPublicToken] = useState<string | null>(survey.publicToken)
    const [isRegeneratingToken, setIsRegeneratingToken] = useState(false)
    const { hasPermission, user } = useUser()
    const userHasPermission = hasPermission()
    const canCreateSurvey = userHasPermission.canPost || userHasPermission.isAdmin
    const isReadonly = !canCreateSurvey

    const [surveyData, setSurveyData] = useState<SurveyData>({
        id: survey.id,
        name: survey.name,
        description: survey.description || "",
        typeId: survey.typeId || "",
        status: survey.status,
        allowMultipleResponses: survey.allowMultipleResponses,
        questions: survey.questions.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description || "",
            format: q.format,
            required: q.required,
            order: q.order,
            yesLabel: q.yesLabel || undefined,
            noLabel: q.noLabel || undefined,
            buttonLabel: q.buttonLabel || undefined,
            hasOtherOption: q.options.some(option => option.isOther),
            options: q.options.map(o => ({
                id: o.id,
                text: o.text,
                order: o.order,
                isOther: o.isOther
            }))
        })),
        style: survey.style ? {
            ...survey.style,
            styleMode: survey.style.styleMode || 'basic',
            basicCSS: survey.style.basicCSS || '',
            advancedCSS: survey.style.advancedCSS || ''
        } : {
            backgroundColor: "",
            textColor: "",
            buttonBackgroundColor: "",
            buttonTextColor: "",
            margin: "",
            padding: "",
            border: "",
            borderRadius: "",
            titleFontSize: "",
            bodyFontSize: "",
            fontFamily: "",
            styleMode: "basic" as const,
            basicCSS: "",
            advancedCSS: ""
        }
    })

    const handleSave = useCallback(() => {
        setPendingAction('save')
        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append("id", surveyData.id)
                formData.append("name", surveyData.name)
                formData.append("description", surveyData.description || "")
                formData.append("typeId", surveyData.typeId || "null")
                formData.append("status", surveyData.status)
                formData.append("allowMultipleResponses", surveyData.allowMultipleResponses.toString())
                formData.append("questions", JSON.stringify(surveyData.questions))
                formData.append("style", JSON.stringify(surveyData.style))

                const result = await updateSurvey(formData)
                if (result.success) {
                    toast.success(t("messages.saveSuccess"))
                    //router.push("/survey")
                } else {
                    if (result.upgrade) {
                        // Show upgrade modal instead of toast
                        const limitResult = result as any
                        setUpgradeLimit(limitResult.currentLimit || 0)
                        setShowUpgradeModal(true)
                    } else {
                        console.log(result.error)
                        toast.error(t("messages.saveError"))
                    }
                }
            } catch (error) {
                console.log("error save", error)
                toast.error(t("messages.unexpectedError"))
            } finally {
                setPendingAction(null)
            }
        })
    }, [surveyData, t])

    const handlePublish = useCallback(() => {
        setPendingAction('publish')
        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append("id", surveyData.id)
                formData.append("name", surveyData.name)
                formData.append("description", surveyData.description || "")
                formData.append("typeId", surveyData.typeId || "null")
                formData.append("status", "published") // Always enable when publishing
                formData.append("allowMultipleResponses", surveyData.allowMultipleResponses.toString())
                formData.append("questions", JSON.stringify(surveyData.questions))
                formData.append("style", JSON.stringify(surveyData.style))

                const result = await updateSurvey(formData)

                if (result.success) {
                    // If survey was newly published, regenerate the public token
                    if (!publicToken) {
                        const tokenResult = await regenerateSurveyPublicToken(surveyData.id)
                        if (tokenResult.success && tokenResult.publicToken) {
                            setPublicToken(tokenResult.publicToken)
                        }
                    }
                    toast.success(t("messages.publishSuccess"))
                    router.push("/survey")
                } else {
                    if (result.upgrade) {
                        // Show upgrade modal instead of toast
                        const limitResult = result as any
                        setUpgradeLimit(limitResult.currentLimit || 0)
                        setShowUpgradeModal(true)
                    } else {
                        console.log(result.error)
                        toast.error(result.error || t("messages.publishError"))
                    }
                }

            } catch (error) {
                console.log(error)
                toast.error(t("messages.unexpectedError"))
            } finally {
                setPendingAction(null)
            }
        })
    }, [surveyData, t, router, publicToken])

    const handleCopySurveyId = useCallback(async () => {
        await navigator.clipboard.writeText(surveyData.id)
        toast.success(t("messages.surveyIdCopied") || "Survey ID copied to clipboard")
    }, [surveyData.id, t])

    const handleCopySurveyToken = useCallback(async () => {
        if (currentToken) {
            await navigator.clipboard.writeText(currentToken)
            toast.success("Survey token copied to clipboard")
        } else {
            toast.error("No token available. Please generate one in Settings > API.")
        }
    }, [currentToken])

    const handleRegeneratePublicToken = useCallback(async () => {
        setIsRegeneratingToken(true)
        try {
            const result = await regenerateSurveyPublicToken(surveyData.id)
            if (result.success && result.publicToken) {
                setPublicToken(result.publicToken)
                toast.success("Public token regenerated successfully")
            } else {
                toast.error(result.error || "Failed to regenerate public token")
            }
        } catch (error) {
            console.error("Error regenerating token:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsRegeneratingToken(false)
        }
    }, [surveyData.id])

    const handleCopyPublicUrl = useCallback(async () => {
        if (publicToken) {
            const baseUrl = window.location.origin
            const publicUrl = `${baseUrl}/${locale}/survey/${surveyData.id}?token=${publicToken}`
            await navigator.clipboard.writeText(publicUrl)
            toast.success("Public URL copied to clipboard")
        } else {
            toast.error("No public token available. Please publish the survey first or regenerate the token.")
        }
    }, [publicToken, surveyData.id, locale])

    const truncateUrl = useCallback((url: string, maxLength: number = 50) => {
        if (url.length <= maxLength) return url
        const start = url.slice(0, maxLength / 2)
        const end = url.slice(-maxLength / 2)
        return `${start}...${end}`
    }, [])

    // Load team token when component mounts
    useEffect(() => {
        const loadTeamToken = async () => {
            if (user?.defaultTeamId) {
                try {
                    const result = await getTeamTokenAction(user.defaultTeamId)
                    if (result.success && result.team?.tokenSurvery) {
                        setCurrentToken(result.team.tokenSurvery)
                    }
                } catch (error) {
                    console.error("Failed to load team token:", error)
                }
            }
        }
        loadTeamToken()
    }, [user?.defaultTeamId])

    // Optimized change handlers to prevent unnecessary re-renders
    const handleSurveyDetailsChange = useCallback((data: Partial<SurveyData>) => {
        setSurveyData(prev => ({ ...prev, ...data }))
    }, [])

    const handleQuestionsChange = useCallback((questions: Question[]) => {
        setSurveyData(prev => ({ ...prev, questions }))
    }, [])

    const handleStyleChange = useCallback((style: SurveyData['style']) => {
        setSurveyData(prev => ({ ...prev, style }))
    }, [])

    // Memoize the survey data to prevent unnecessary re-renders
    const memoizedSurveyData = useMemo(() => surveyData, [surveyData])

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const publicUrl = publicToken ? `${baseUrl}/${locale}/survey/${surveyData.id}?token=${publicToken}` : null
    const truncatedUrl = publicUrl ? truncateUrl(publicUrl, 50) : 'Not available'

    return (
        <div className="space-y-6">
            {/* Page Header */}
            {/* 
                Use an accordion: 
                - closed by default on mobile (open = false), open on desktop (open = true)
                - Assumes you have Accordion, AccordionItem, AccordionTrigger, AccordionContent components available (e.g., from shadcn/ui, radix, or custom)
            */}
            <Accordion
                type="single"
                collapsible
                defaultValue={typeof window !== "undefined" && window.innerWidth >= 640 ? "info" : undefined}
                className="space-y-4"
            >
                <AccordionItem
                    value="info"
                    // Open when screen is sm (640px) or above, closed otherwise
                    className="border-none"
                >
                    <AccordionTrigger className="!no-underline p-0">
                        <div className="flex items-center gap-2">
                            <div
                                className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push("/survey");
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label="Go back to surveys"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push("/survey");
                                    }
                                }}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            <span className="text-base font-medium">
                                Survey Info
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        {/* Survey ID and Token Section */}
                        <div className="flex gap-4 sm:flex-row sm:items-center sm:gap-6 pt-3">
                            {/* Survey ID */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">ID:</p>
                                <p className="hidden text-muted-foreground font-mono text-xs sm:inline-block sm:text-sm">
                                    {surveyData.id}
                                </p>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handleCopySurveyId}
                                    aria-label={t("actions.copySurveyId") || "Copy Survey ID"}
                                >
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Team Token */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">Token:</p>
                                <p className="hidden text-muted-foreground font-mono text-xs sm:inline-block sm:text-sm">
                                    {currentToken ? '••••••••••••••••••••••••' : 'Not generated'}
                                </p>
                                {currentToken ? (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleCopySurveyToken}
                                        aria-label="Copy Survey Token"
                                    >
                                        <Clipboard className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={() => router.push("/settings")}
                                        aria-label="Go to Settings to generate token"
                                    >
                                        <Settings className="h-4 w-4 sm:mr-1" />
                                        <span className="hidden sm:inline">Generate</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Public URL Section */}

                        <div className="flex flex-col gap-3 mt-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-medium">Public URL:</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {publicUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8"
                                            asChild
                                            aria-label="Open Survey in new tab"
                                        >
                                            <Link href={publicUrl} className="flex items-center" target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}
                                    {publicToken && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8"
                                            onClick={handleCopyPublicUrl}
                                            aria-label="Copy Public URL"
                                        >
                                            <Clipboard className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {canCreateSurvey && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8"
                                            onClick={handleRegeneratePublicToken}
                                            disabled={isRegeneratingToken}
                                            aria-label="Regenerate Public Token"
                                        >
                                            <RefreshCw className={`h-4 w-4 ${isRegeneratingToken ? 'animate-spin' : ''}`} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {publicUrl ? (
                                    <>
                                        <div className="text-muted-foreground font-mono text-xs break-all" title={publicUrl}>
                                            <span className="">{truncateUrl(publicUrl, 40)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Publish the survey to generate a public URL
                                    </p>
                                )}
                            </div>
                        </div>

                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Separator className="my-6" />

            {/* Survey Details Section */}
            <SurveyDetailsSection
                data={memoizedSurveyData}
                onChange={handleSurveyDetailsChange}
                surveyTypesData={surveyTypes}
                readonly={isReadonly}
            />

            {/* Questions and Style Tabs */}
            <Tabs defaultValue="questions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="questions" className="cursor-pointer">{t("questions.title")}</TabsTrigger>
                    <TabsTrigger value="style" className="cursor-pointer">{t("style.title")}</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="mt-6">
                    <QuestionsSection
                        questions={memoizedSurveyData.questions}
                        onChange={handleQuestionsChange}
                        expandAllQuestions={false}
                        readonly={isReadonly}
                    />
                </TabsContent>

                <TabsContent value="style" className="mt-6">
                    <StyleSection
                        surveyData={memoizedSurveyData as SurveyData}
                        style={memoizedSurveyData.style}
                        onChange={handleStyleChange}
                        readonly={isReadonly}
                    />
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <Card className="border-none px-0 pt-4 shadow-none bg-transparent">
                <CardContent className="pt-6 p-0">
                    {canCreateSurvey ? (
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={handleSave}
                                disabled={isPending || !surveyData.name.trim() || !surveyData.status}
                            >
                                {pendingAction === 'save' ? t("actions.saving") : t("actions.saveDraft")}
                            </Button>
                            <Button
                                onClick={handlePublish}
                                disabled={isPending || !surveyData.name.trim() || surveyData.questions.length === 0 || !surveyData.status}
                            >
                                {pendingAction === 'publish' ? t("actions.publishing") : t("actions.publish")}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-4">
                            <p>{t("messages.readonlyMode") || "You don't have permission to edit this survey"}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                limitType="surveys"
                currentLimit={upgradeLimit}
            />
        </div>
    )
}
