"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from "next-themes"
import { generateTeamTokenAction, regenerateTeamTokenAction, getTeamTokenAction } from "@/components/server-actions/team"
import { useUser } from "@/components/user-provider"
import { UpgradeModal } from "@/components/upgrade-modal"

export const ApiSettings = () => {
    const t = useTranslations("Settings.api")
    const { user, hasPermission } = useUser()
    const { theme } = useTheme()
    const [showSurveyToken, setShowSurveyToken] = useState(false)
    const [showApiToken, setShowApiToken] = useState(false)
    const [teamTokens, setTeamTokens] = useState<Record<number, { tokenSurvery: string | null, tokenApi: string | null }>>({})
    const [isGeneratingSurveyToken, setIsGeneratingSurveyToken] = useState(false)
    const [isGeneratingApiToken, setIsGeneratingApiToken] = useState(false)
    const [showRegenerateModal, setShowRegenerateModal] = useState(false)
    const [regenerateTokenType, setRegenerateTokenType] = useState<"survey" | "api">("survey")
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const { isAdmin } = hasPermission()

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast.success(t("codeCopied"))
    }

    const renderCodeSnippet = (title: string, description: string, code: string, language: string, copyButtonText: string) => (
        <Card className="w-full overflow-hidden p-0 pt-4 sm:pt-0 border-none rounded-none">
            <CardHeader className="p-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="bg-gray-900 p-4 rounded-lg relative overflow-hidden">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode(code)}
                        className="absolute top-2 right-2 px-2 sm:px-3 bg-background/80 backdrop-blur-sm z-10"
                    >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs sm:text-sm">{copyButtonText}</span>
                    </Button>
                    <div className="overflow-x-auto">
                        <SyntaxHighlighter
                            language={language}
                            style={a11yDark}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                background: 'transparent',
                                minWidth: 'max-content',
                                width: '100%'
                            }}
                            showLineNumbers={false}
                            wrapLines={true}
                            wrapLongLines={true}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const renderTabContent = (
        tokenType: "survey" | "api",
        tokenLabel: string,
        currentToken: string | null,
        showToken: boolean,
        setShowToken: (show: boolean) => void,
        handleCopyToken: () => void,
        isGeneratingToken: boolean,
        codeTitle: string,
        codeDescription: string,
        code: string,
        language: string,
        copyButtonText: string
    ) => (
        <Card className="p-0 border-none w-full overflow-hidden">
            <CardContent className="p-0 space-y-4 w-full">
                <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor={`${tokenType}-token`} className="text-sm font-medium">{tokenLabel}</Label>
                        <div className="space-y-2">
                            <div className="flex gap-1.5 sm:gap-2">
                                <div className="flex-1 relative">
                                    <Input
                                        id={`${tokenType}-token`}
                                        type={showToken || !currentToken ? "text" : "password"}
                                        value={currentToken || t("noTokenGenerated")}
                                        readOnly
                                        className="pr-10 text-xs sm:pr-12 sm:text-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0.5 top-0.5 h-6 w-6 p-0 sm:right-1 sm:top-1 sm:h-7 sm:w-7"
                                        onClick={() => setShowToken(!showToken)}
                                    >
                                        {showToken ? <EyeOff className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                                    </Button>
                                </div>
                                {currentToken && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopyToken}
                                        className="px-2 sm:px-3"
                                    >
                                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                )}
                            </div>
                            {isAdmin && (
                                <div className="flex sm:justify-end gap-1.5 sm:gap-2">
                                    {!currentToken ? (
                                        <Button
                                            onClick={() => handleGenerateToken(currentTeam!.id, tokenType)}
                                            disabled={isGeneratingToken}
                                            className="flex-1 sm:flex-none"
                                            size="sm"
                                        >
                                            {isGeneratingToken ? (
                                                <>
                                                    <RefreshCw className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                                                    <span className="text-xs sm:text-sm">{t("generating")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xs sm:text-sm">{t("generateToken")}</span>
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setRegenerateTokenType(tokenType)
                                                setShowRegenerateModal(true)
                                            }}
                                            variant="default"
                                            disabled={isGeneratingToken}
                                            className="flex-1 sm:flex-none"
                                            size="sm"
                                        >
                                            {isGeneratingToken ? (
                                                <>
                                                    <RefreshCw className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                                                    <span className="text-xs sm:text-sm">{t("regenerating")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xs sm:text-sm">{t("regenerateToken")}</span>
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Code Snippet */}
                {renderCodeSnippet(
                    codeTitle,
                    codeDescription,
                    code,
                    language,
                    copyButtonText
                )}
            </CardContent>
        </Card>
    )

    // Get current user's default team
    const currentTeam = user?.teams?.find((team: any) => team.id === user?.defaultTeamId) || user?.teams?.[0]
    const currentTeamTokens = currentTeam ? teamTokens[currentTeam.id] : null
    const currentSurveyToken = currentTeamTokens?.tokenSurvery || null
    const currentApiToken = currentTeamTokens?.tokenApi || null

    // Code snippets for each token type
    const surveyWidgetCode = `<!-- Survey Widget Integration -->
<script src="https://app.opineeo.com/opineeo-0.0.1.min.js"></script>
<script>
function handleSurveyComplete(data) {
  console.log('Survey completed:', data);
}

function handleSurveyClose() {
  console.log('Survey closed');
}
</script>

<!-- Survey container -->
<opineeo-survey
  survey-id="your-survey-id"
  token="${currentSurveyToken || 'YOUR_SURVEY_TOKEN'}"
  auto-close="3000"
  oncomplete="handleSurveyComplete"
  onclose="handleSurveyClose"
></opineeo-survey>`

    const apiIntegrationCode = `// API Integration Example - Get Survey Results
const getSurveyResults = async (surveyId) => {
  try {
    const response = await fetch(\`https://app.opineeo.com/api/survey/v0/results?surveyId=\${surveyId}\`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ${currentApiToken || 'YOUR_API_TOKEN'}'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Survey results:', result.data);
      return result.data;
    } else {
      const error = await response.json();
      console.error('Error fetching results:', error);
    }
  } catch (error) {
    console.error('Error fetching survey results:', error);
  }
};

// Usage example
getSurveyResults('your-survey-id');`

    const handleCopySurveyToken = () => {
        if (currentSurveyToken) {
            navigator.clipboard.writeText(currentSurveyToken)
            toast.success(t("tokenCopied"))
        }
    }

    const handleCopyApiToken = () => {
        if (currentApiToken) {
            navigator.clipboard.writeText(currentApiToken)
            toast.success(t("tokenCopied"))
        }
    }


    const handleGenerateToken = async (teamId: number, tokenType: "survey" | "api") => {
        try {
            if (tokenType === "survey") {
                setIsGeneratingSurveyToken(true)
            } else {
                setIsGeneratingApiToken(true)
            }

            const result = await generateTeamTokenAction({ teamId, tokenType })

            if (result.success) {
                setTeamTokens(prev => ({
                    ...prev,
                    [teamId]: {
                        ...prev[teamId],
                        [tokenType === "api" ? "tokenApi" : "tokenSurvery"]: result.token || null
                    }
                }))
                toast.success(result.message)
            } else {
                // Check if upgrade is required
                if ('requiresUpgrade' in result && result.requiresUpgrade) {
                    setShowUpgradeModal(true)
                } else {
                    toast.error(result.error || "Failed to generate token")
                }
            }
        } catch (error) {
            console.error("Generate token error:", error)
            toast.error(`An unexpected error occurred ${error}`)
        } finally {
            if (tokenType === "survey") {
                setIsGeneratingSurveyToken(false)
            } else {
                setIsGeneratingApiToken(false)
            }
        }
    }

    const handleRegenerateToken = async (teamId: number, tokenType: "survey" | "api") => {
        try {
            console.log("Regenerating token for", tokenType)
            if (tokenType === "survey") {
                setIsGeneratingSurveyToken(true)
            } else {
                setIsGeneratingApiToken(true)
            }
            setShowRegenerateModal(false)
            const result = await regenerateTeamTokenAction({ teamId, tokenType })

            if (result.success) {
                setTeamTokens(prev => ({
                    ...prev,
                    [teamId]: {
                        ...prev[teamId],
                        [tokenType === "api" ? "tokenApi" : "tokenSurvery"]: result.token || null
                    }
                }))
                toast.success(result.message)
            } else {
                // Check if upgrade is required
                if ('requiresUpgrade' in result && result.requiresUpgrade) {
                    setShowUpgradeModal(true)
                } else {
                    toast.error(result.error || "Failed to regenerate token")
                }
            }
        } catch (error) {
            console.error("Regenerate token error:", error)
            toast.error(`An unexpected error occurred ${error}`)
        } finally {
            if (tokenType === "survey") {
                setIsGeneratingSurveyToken(false)
            } else {
                setIsGeneratingApiToken(false)
            }
        }
    }

    const handleConfirmRegenerate = () => {
        if (currentTeam) {
            handleRegenerateToken(currentTeam.id, regenerateTokenType)
        }
    }

    const loadTeamTokens = async (teamId: number) => {
        try {
            const result = await getTeamTokenAction(teamId)
            if (result.success) {
                setTeamTokens(prev => ({
                    ...prev,
                    [teamId]: {
                        tokenSurvery: result.team?.tokenSurvery || null,
                        tokenApi: result.team?.tokenApi || null
                    }
                }))
            }
        } catch (error) {
            console.error("Load tokens error:", error)
        }
    }

    // Load tokens when component mounts
    useEffect(() => {
        if (currentTeam && !teamTokens[currentTeam.id]) {
            loadTeamTokens(currentTeam.id)
        }
    }, [currentTeam])

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t("title")}</CardTitle>
                <CardDescription className="text-sm">
                    {t("description")}
                </CardDescription>
            </CardHeader>

            {!currentTeam ? (
                <CardContent className="px-4">
                    <p className="text-sm text-muted-foreground">{t("noTeam")}</p>
                </CardContent>
            ) : (
                <CardContent className="px-3 sm:px-4 w-full">
                    <Tabs defaultValue="survey" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
                            <TabsTrigger value="survey" className="text-xs sm:text-sm">
                                {t("tabs.surveyToken")}
                            </TabsTrigger>
                            <TabsTrigger value="api" className="text-xs sm:text-sm">
                                {t("tabs.apiToken")}
                            </TabsTrigger>
                        </TabsList>

                        {/* Survey Token Tab */}
                        <TabsContent value="survey" className="space-y-4 sm:space-y-6">
                            {renderTabContent(
                                "survey",
                                t("surveyToken"),
                                currentSurveyToken,
                                showSurveyToken,
                                setShowSurveyToken,
                                handleCopySurveyToken,
                                isGeneratingSurveyToken,
                                t('codeSnippets.surveyWidget.title'),
                                t('codeSnippets.surveyWidget.description'),
                                surveyWidgetCode,
                                'html',
                                t("codeSnippets.surveyWidget.copyCode")
                            )}
                        </TabsContent>

                        {/* API Token Tab */}
                        <TabsContent value="api" className="space-y-4 sm:space-y-6">
                            {renderTabContent(
                                "api",
                                t("apiToken"),
                                currentApiToken,
                                showApiToken,
                                setShowApiToken,
                                handleCopyApiToken,
                                isGeneratingApiToken,
                                t('codeSnippets.apiIntegration.title'),
                                t('codeSnippets.apiIntegration.description'),
                                apiIntegrationCode,
                                'javascript',
                                t("codeSnippets.apiIntegration.copyCode")
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>)
            }

            {/* Regenerate Token Confirmation Modal */}
            <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("confirmRegenerateTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("confirmRegenerateDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowRegenerateModal(false)}
                            className="w-full sm:w-auto"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmRegenerate}
                            disabled={regenerateTokenType === "survey" ? isGeneratingSurveyToken : isGeneratingApiToken}
                            className="w-full sm:w-auto"
                        >
                            {(regenerateTokenType === "survey" ? isGeneratingSurveyToken : isGeneratingApiToken) ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    {t("regenerating")}
                                </>
                            ) : (
                                t("confirmRegenerate")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upgrade Modal */}
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                limitType="apis"
            />
        </Card >
    )
}
