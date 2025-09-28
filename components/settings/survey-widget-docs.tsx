"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'

interface SurveyWidgetDocsProps {
    currentTeamToken: string | null
}

export const SurveyWidgetDocs = ({ currentTeamToken }: SurveyWidgetDocsProps) => {
    const t = useTranslations("Settings.api.widget")

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast.success(t("codeCopied"))
    }

    const baseUrl = "https://app.opineeo.com"

    const htmlExample = `<html>
<head>
    <title>Survey Widget Example</title>
    <!-- 1. Include the widget script -->
    <script src="${baseUrl}/opineeo-0.0.1.min.js"></script>
</head>
<body>
    <!-- 2. Create container -->
    <div id="my-survey"></div>

    <!-- 3. Initialize and configure -->
    <script>
        const surveyWidget = window.initSurveyWidget({
            teamToken: '${currentTeamToken || 'your-team-token-here'}',
            surveyId: 'my-survey-id'
        });
        surveyWidget.mount('my-survey');
    </script>
</body>
</html>`

    return (
        <Card className="border-none">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{t("title")}</CardTitle>
                        <CardDescription className="text-sm">
                            {t("description")}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">{t("htmlSetup")}</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyCode(htmlExample)}
                            className="px-2"
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="w-full max-w-full border rounded-md overflow-hidden">
                        <div className="h-[370px] w-full overflow-auto">
                            <CodeMirror
                                value={htmlExample}
                                height="100%"
                                width="100%"
                                readOnly
                                extensions={[
                                    html(),
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
                </div>
            </CardContent>
        </Card>
    )
}
