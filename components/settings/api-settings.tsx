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
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from "next-themes"
import { generateTeamTokenAction, regenerateTeamTokenAction, getTeamTokenAction } from "@/components/server-actions/team"
import { useUser } from "@/components/user-provider"

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
    const { isAdmin } = hasPermission()

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast.success(t("codeCopied"))
    }

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
                toast.error(result.error || "Failed to generate token")
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
                toast.error(result.error || "Failed to regenerate token")
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
        <Card>
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
                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-2 sm:space-y-3">
                                    <Label htmlFor="survey-token" className="text-sm font-medium">{t("surveyToken")}</Label>
                                    <div className="space-y-2">
                                        <div className="flex gap-1.5 sm:gap-2">
                                            <div className="flex-1 relative">
                                                <Input
                                                    id="survey-token"
                                                    type={showSurveyToken || !currentSurveyToken ? "text" : "password"}
                                                    value={currentSurveyToken || t("noTokenGenerated")}
                                                    readOnly
                                                    className="pr-10 text-xs sm:pr-12 sm:text-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0.5 top-0.5 h-6 w-6 p-0 sm:right-1 sm:top-1 sm:h-7 sm:w-7"
                                                    onClick={() => setShowSurveyToken(!showSurveyToken)}
                                                >
                                                    {showSurveyToken ? <EyeOff className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                                                </Button>
                                            </div>
                                            {currentSurveyToken && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCopySurveyToken}
                                                    className="px-2 sm:px-3"
                                                >
                                                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        {isAdmin && (
                                            <div className="flex sm:justify-end gap-1.5 sm:gap-2">
                                                {!currentSurveyToken ? (
                                                    <Button
                                                        onClick={() => handleGenerateToken(currentTeam.id, "survey")}
                                                        disabled={isGeneratingSurveyToken}
                                                        className="flex-1 sm:flex-none"
                                                        size="sm"
                                                    >
                                                        {isGeneratingSurveyToken ? (
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
                                                            setRegenerateTokenType("survey")
                                                            setShowRegenerateModal(true)
                                                        }}
                                                        variant="default"
                                                        disabled={isGeneratingSurveyToken}
                                                        className="flex-1 sm:flex-none"
                                                        size="sm"
                                                    >
                                                        {isGeneratingSurveyToken ? (
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

                            {/* Survey Widget Code Snippet */}
                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-2 sm:space-y-3">
                                    <Label className="text-sm font-medium">{t("codeSnippets.surveyWidget.title")}</Label>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{t("codeSnippets.surveyWidget.description")}</p>
                                    <Card className="py-2">
                                        <CardContent className="p-0 ">
                                            <div className="relative">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleCopyCode(surveyWidgetCode)}
                                                    className="absolute top-2 right-2 px-2 sm:px-3 bg-background/80 backdrop-blur-sm"
                                                >
                                                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                    <span className="text-xs sm:text-sm">{t("codeSnippets.surveyWidget.copyCode")}</span>
                                                </Button>
                                                <SyntaxHighlighter
                                                    language="html"
                                                    style={theme === 'dark' ? oneDark : oneLight}
                                                    customStyle={{
                                                        margin: 0,
                                                        fontSize: '0.75rem',
                                                        lineHeight: '1.5',
                                                        padding: '0.75rem',
                                                        background: 'transparent',
                                                        color: 'inherit',
                                                        borderRadius: '0.5rem',
                                                        whiteSpace: 'pre',
                                                    }}
                                                    codeTagProps={{
                                                        style: {
                                                            fontSize: '0.75rem',
                                                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                            whiteSpace: 'pre'
                                                        }
                                                    }}
                                                >
                                                    {surveyWidgetCode}
                                                </SyntaxHighlighter>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* API Token Tab */}
                        <TabsContent value="api" className="space-y-4 sm:space-y-6">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-2 sm:space-y-3">
                                    <Label htmlFor="api-token" className="text-sm font-medium">{t("apiToken")}</Label>
                                    <div className="space-y-2">
                                        <div className="flex gap-1.5 sm:gap-2">
                                            <div className="flex-1 relative">
                                                <Input
                                                    id="api-token"
                                                    type={showApiToken || !currentApiToken ? "text" : "password"}
                                                    value={currentApiToken || t("noTokenGenerated")}
                                                    readOnly
                                                    className="pr-10 text-xs sm:pr-12 sm:text-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0.5 top-0.5 h-6 w-6 p-0 sm:right-1 sm:top-1 sm:h-7 sm:w-7"
                                                    onClick={() => setShowApiToken(!showApiToken)}
                                                >
                                                    {showApiToken ? <EyeOff className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                                                </Button>
                                            </div>
                                            {currentApiToken && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCopyApiToken}
                                                    className="px-2 sm:px-3"
                                                >
                                                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        {isAdmin && (
                                            <div className="flex sm:justify-end gap-1.5 sm:gap-2">
                                                {!currentApiToken ? (
                                                    <Button
                                                        onClick={() => handleGenerateToken(currentTeam.id, "api")}
                                                        disabled={isGeneratingApiToken}
                                                        className="flex-1 sm:flex-none"
                                                        size="sm"
                                                    >
                                                        {isGeneratingApiToken ? (
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
                                                            setRegenerateTokenType("api")
                                                            setShowRegenerateModal(true)
                                                        }}
                                                        variant="default"
                                                        disabled={isGeneratingApiToken}
                                                        className="flex-1 sm:flex-none"
                                                        size="sm"
                                                    >
                                                        {isGeneratingApiToken ? (
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

                            {/* API Integration Code Snippet */}
                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-2 sm:space-y-3">
                                    <Label className="text-sm font-medium">{t("codeSnippets.apiIntegration.title")}</Label>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{t("codeSnippets.apiIntegration.description")}</p>
                                    <Card className="py-2 relative">
                                        <CardContent className="relative p-0">
                                            <div className=" overflow-x-auto">
                                                <SyntaxHighlighter
                                                    language="javascript"
                                                    style={theme === 'dark' ? oneDark : oneLight}
                                                    customStyle={{
                                                        margin: 0,
                                                        fontSize: '0.75rem',
                                                        lineHeight: '1.5',
                                                        padding: '0.75rem',
                                                        background: 'transparent',
                                                        color: 'inherit',
                                                        borderRadius: '0.5rem',
                                                        whiteSpace: 'pre',
                                                    }}
                                                    codeTagProps={{
                                                        style: {
                                                            fontSize: '0.75rem',
                                                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                            whiteSpace: 'pre'
                                                        }
                                                    }}
                                                    wrapLongLines={true}
                                                >
                                                    {apiIntegrationCode}
                                                </SyntaxHighlighter>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyCode(apiIntegrationCode)}
                                                className="absolute top-2 right-2 px-2 sm:px-3 bg-background/80 backdrop-blur-sm"
                                            >
                                                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                <span className="text-xs sm:text-sm">{t("codeSnippets.apiIntegration.copyCode")}</span>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
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
        </Card >
    )
}
