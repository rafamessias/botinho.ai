"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/components/user-provider"
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { StreamLanguage } from '@codemirror/language'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'

interface ApiEndpointProps {
    currentTeamToken: string | null
}

export const ApiEndpoint = ({ currentTeamToken }: ApiEndpointProps) => {
    const t = useTranslations("Settings.api")
    const { user } = useUser()
    const [showApiDocs, setShowApiDocs] = useState(false)

    // Get current user's default team
    const currentTeam = user?.teams?.find((team: any) => team.id === user?.defaultTeamId) || user?.teams?.[0]

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast.success(t("codeCopied"))
    }

    const handleCopyEndpoint = () => {
        const endpoint = `${window.location.origin}/api/survey/v0`
        navigator.clipboard.writeText(endpoint)
        toast.success(t("endpointCopied"))
    }

    const examplePayload = {
        teamToken: currentTeamToken || "your-token-here",
        surveyId: "survey-123",
        responses: [
            {
                questionId: "q1",
                textValue: "Sample text"
            },
            {
                questionId: "q2",
                optionId: "opt-1"
            },
            {
                questionId: "q3",
                numberValue: 5
            },
            {
                questionId: "q4",
                booleanValue: true
            }
        ]
    }

    const curlExample = `curl -X POST /api/survey/v0 \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(examplePayload, null, 2)}'`

    const javascriptExample = `const response = await fetch('/api/survey/v0', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(examplePayload, null, 2)})
});

const result = await response.json();
console.log(result);`

    return (
        <div className="space-y-3 sm:space-y-4 w-full">
            {/* API Endpoint */}
            <div className="space-y-1.5 sm:space-y-2 mb-8">
                <Label className="text-sm font-medium">{t("apiEndpoint")}</Label>
                <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex gap-1.5 sm:gap-2">
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">POST</Badge>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                        <div className="flex-1 border bg-muted px-2 py-1.5 rounded-md text-xs font-mono break-all overflow-x-auto sm:px-3 sm:py-2">
                            {typeof window !== 'undefined' ? `${window.location.origin}/api/survey/v0` : '/api/survey/v0'}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCopyEndpoint}
                            className="px-2 sm:px-3"
                        >
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Documentation Toggle */}
            <div className="space-y-2 sm:space-y-3">
                <div className="space-y-0.5 sm:space-y-1">
                    <h4 className="text-sm font-medium">{t("documentation")}</h4>
                    <p className="text-xs text-muted-foreground">{t("documentationDescription")}</p>
                </div>
                <div className="flex sm:justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiDocs(!showApiDocs)}
                        className="w-full sm:w-auto text-sm"
                    >
                        {showApiDocs ? t("hideDocs") : t("showDocs")}
                        <ExternalLink className="ml-1.5 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>

            {/* API Documentation */}
            {showApiDocs && (
                <div className="pt-2 border-t max-w-full w-full max-h-[60vh] overflow-hidden">
                    <div className="space-y-1 sm:space-y-1.5 pb-1 h-full overflow-y-auto overscroll-contain">
                        <Tabs defaultValue="javascript" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="javascript" className="text-xs">JavaScript</TabsTrigger>
                                <TabsTrigger value="curl" className="text-xs">cURL</TabsTrigger>
                            </TabsList>
                            <TabsContent value="javascript" className="space-y-1 mt-1 sm:space-y-1 sm:mt-1.5">
                                <div className="flex justify-between items-center gap-2">
                                    <Label className="text-xs sm:text-sm truncate">JavaScript Example</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(javascriptExample)}
                                        className="px-1.5 sm:px-2 flex-shrink-0"
                                    >
                                        <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                </div>
                                <div className="w-full max-w-full border rounded-md overflow-hidden">
                                    <div className="h-32 sm:h-40 w-full overflow-auto">
                                        <CodeMirror
                                            value={javascriptExample}
                                            height="100%"
                                            width="100%"
                                            readOnly
                                            extensions={[
                                                javascript(),
                                                EditorView.lineWrapping
                                            ]}
                                            theme={oneDark}
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: false,
                                                dropCursor: false,
                                                allowMultipleSelections: false,
                                                indentOnInput: false,
                                                searchKeymap: false,
                                            }}
                                            style={{
                                                maxWidth: '100%',
                                                overflow: 'auto'
                                            }}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="curl" className="space-y-1 mt-1 sm:space-y-1 sm:mt-1.5">
                                <div className="flex justify-between items-center gap-2">
                                    <Label className="text-xs sm:text-sm truncate">cURL Example</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(curlExample)}
                                        className="px-1.5 sm:px-2 flex-shrink-0"
                                    >
                                        <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                </div>
                                <div className="w-full max-w-full border rounded-md overflow-hidden">
                                    <div className="h-32 sm:h-40 w-full overflow-auto">
                                        <CodeMirror
                                            value={curlExample}
                                            height="100%"
                                            width="100%"
                                            readOnly
                                            extensions={[
                                                StreamLanguage.define(shell),
                                                EditorView.lineWrapping
                                            ]}
                                            theme={oneDark}
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: false,
                                                dropCursor: false,
                                                allowMultipleSelections: false,
                                                indentOnInput: false,
                                                searchKeymap: false,
                                            }}
                                            style={{
                                                maxWidth: '100%',
                                                overflow: 'auto'
                                            }}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Request/Response Examples */}
                        <Tabs defaultValue="request" className="w-full mt-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="request" className="text-xs">Request</TabsTrigger>
                                <TabsTrigger value="response" className="text-xs">Response</TabsTrigger>
                            </TabsList>
                            <TabsContent value="request" className="space-y-1 mt-1 sm:space-y-1 sm:mt-1.5">
                                <div className="flex justify-between items-center gap-2">
                                    <Label className="text-xs sm:text-sm truncate">{t("requestBody")}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(JSON.stringify(examplePayload, null, 2))}
                                        className="px-1.5 sm:px-2 flex-shrink-0"
                                    >
                                        <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                </div>
                                <div className="w-full max-w-full border rounded-md overflow-hidden">
                                    <div className="h-32 sm:h-40 w-full overflow-auto">
                                        <CodeMirror
                                            value={JSON.stringify(examplePayload, null, 2)}
                                            height="100%"
                                            width="100%"
                                            readOnly
                                            extensions={[
                                                json(),
                                                EditorView.lineWrapping
                                            ]}
                                            theme={oneDark}
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: false,
                                                dropCursor: false,
                                                allowMultipleSelections: false,
                                                indentOnInput: false,
                                                searchKeymap: false,
                                            }}
                                            style={{
                                                maxWidth: '100%',
                                                overflow: 'auto'
                                            }}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="response" className="space-y-1 mt-1 sm:space-y-1 sm:mt-1.5">
                                <div className="flex justify-between items-center gap-2">
                                    <Label className="text-xs sm:text-sm truncate">{t("successResponse")}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(JSON.stringify({
                                            success: true,
                                            message: "Survey response submitted successfully",
                                            data: {
                                                responseId: "response-123",
                                                surveyId: "survey-456",
                                                teamName: currentTeam?.name || "Team Name",
                                                submittedAt: "2024-01-01T00:00:00.000Z"
                                            }
                                        }, null, 2))}
                                        className="px-1.5 sm:px-2 flex-shrink-0"
                                    >
                                        <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                </div>
                                <div className="w-full max-w-full border rounded-md overflow-hidden">
                                    <div className="h-32 sm:h-40 w-full overflow-auto">
                                        <CodeMirror
                                            value={JSON.stringify({
                                                success: true,
                                                message: "Survey response submitted successfully",
                                                data: {
                                                    responseId: "response-123",
                                                    surveyId: "survey-456",
                                                    teamName: currentTeam?.name || "Team Name",
                                                    submittedAt: "2024-01-01T00:00:00.000Z"
                                                }
                                            }, null, 2)}
                                            height="100%"
                                            width="100%"
                                            readOnly
                                            extensions={[
                                                json(),
                                                EditorView.lineWrapping
                                            ]}
                                            theme={oneDark}
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: false,
                                                dropCursor: false,
                                                allowMultipleSelections: false,
                                                indentOnInput: false,
                                                searchKeymap: false,
                                            }}
                                            style={{
                                                maxWidth: '100%',
                                                overflow: 'auto'
                                            }}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}
        </div>
    )
}
