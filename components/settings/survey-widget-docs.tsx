"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/components/user-provider"
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'

interface SurveyWidgetDocsProps {
    currentTeamToken: string | null
}

export const SurveyWidgetDocs = ({ currentTeamToken }: SurveyWidgetDocsProps) => {
    const t = useTranslations("Settings.api.widget")
    const { user } = useUser()
    const [isExpanded, setIsExpanded] = useState(false)

    // Get current user's default team
    const currentTeam = user?.teams?.find((team: any) => team.id === user?.defaultTeamId) || user?.teams?.[0]

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast.success(t("codeCopied"))
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'

    const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey Widget Example</title>
</head>
<body>
    <!-- 1. Include the widget script -->
    <script src="${baseUrl}/opineeo-sv-w.min.js"></script>

    <!-- 2. Create container -->
    <div id="my-survey"></div>

    <!-- 3. Initialize and configure -->
    <script>
        // Your implementation code here
    </script>
</body>
</html>`

    const implementationExample = `// Initialize the survey widget
const surveyWidget = window.initSurveyWidget({
    surveyData: {
        id: 'my-survey-id',
        name: 'Customer Feedback',
        description: 'Help us improve our service',
        status: 'published',
        questions: [
            {
                id: 'satisfaction',
                title: 'How satisfied are you with our service?',
                format: 'STAR_RATING',
                required: true,
                order: 1,
                options: []
            },
            {
                id: 'recommend',
                title: 'Would you recommend us?',
                format: 'YES_NO',
                required: true,
                order: 2,
                yesLabel: 'Yes, definitely',
                noLabel: 'Not yet',
                options: []
            },
            {
                id: 'comments',
                title: 'Additional comments',
                format: 'LONG_TEXT',
                required: false,
                order: 3,
                options: []
            }
        ]
    },
    // Add your team token for submission
    teamToken: '${currentTeamToken || 'your-team-token-here'}',
    
    // Optional: Custom styling
    customCSS: \`
        .sv {
            background: #ffffff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .qt {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
        }
        .btnp {
            background: #3b82f6;
            color: #ffffff;
            border-radius: 8px;
            padding: 12px 24px;
        }
    \`,
    
    // Handle completion
    onComplete: (responses) => {
        console.log('Survey completed!', responses);
        // Responses are automatically submitted to your API
        alert('Thank you for your feedback!');
    },
    
    // Handle errors
    onError: (error) => {
        console.error('Survey error:', error);
        alert('Sorry, there was an error. Please try again.');
    }
});

// Mount the survey to your container
surveyWidget.mount('my-survey');`

    const questionFormats = `// Available question formats:

// Star Rating (1-5 stars)
{
    format: 'STAR_RATING',
    title: 'Rate our service',
    required: true,
    options: []
}

// Yes/No Questions
{
    format: 'YES_NO',
    title: 'Would you recommend us?',
    yesLabel: 'Yes, definitely',
    noLabel: 'Not yet',
    required: true,
    options: []
}

// Single Choice (Radio buttons)
{
    format: 'SINGLE_CHOICE',
    title: 'How did you hear about us?',
    required: true,
    options: [
        { id: 'google', text: 'Google Search', order: 1 },
        { id: 'social', text: 'Social Media', order: 2 },
        { id: 'other', text: 'Other', order: 3, isOther: true }
    ]
}

// Multiple Choice (Checkboxes)
{
    format: 'MULTIPLE_CHOICE',
    title: 'What features interest you?',
    required: false,
    options: [
        { id: 'mobile', text: 'Mobile App', order: 1 },
        { id: 'analytics', text: 'Analytics', order: 2 },
        { id: 'integrations', text: 'Integrations', order: 3 }
    ]
}

// Long Text (Textarea)
{
    format: 'LONG_TEXT',
    title: 'Additional comments',
    description: 'Tell us more...',
    required: false,
    options: []
}

// Statement (Information display)
{
    format: 'STATEMENT',
    title: 'Privacy Notice',
    description: 'Your data is secure and confidential.',
    options: []
}`

    if (!currentTeamToken) {
        return null
    }

    return (
        <Card className="mt-6 border-none">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{t("title")}</CardTitle>
                        <CardDescription className="text-sm">
                            {t("description")}
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2"
                    >
                        {isExpanded ? t("hide") : t("show")}
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-6">
                    <Tabs defaultValue="setup" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 mb-24 space-y-4 bg-transparent sm:bg-muted sm:grid-cols-3 sm:mb-0 sm:space-y-0">
                            <TabsTrigger className="cursor-pointer" value="setup">{t("tabs.setup")}</TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="implementation">{t("tabs.implementation")}</TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="formats">{t("tabs.formats")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="setup" className="space-y-4 mt-4">
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
                                    <div className="h-48 sm:h-48 w-full overflow-auto">
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
                        </TabsContent>

                        <TabsContent value="implementation" className="space-y-4 mt-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium">{t("fullExample")}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(implementationExample)}
                                        className="px-2"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="w-full max-w-full border rounded-md overflow-hidden">
                                    <div className="h-64 sm:h-64 w-full overflow-auto">
                                        <CodeMirror
                                            value={implementationExample}
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
                            </div>
                        </TabsContent>

                        <TabsContent value="formats" className="space-y-4 mt-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium">{t("questionFormats")}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(questionFormats)}
                                        className="px-2"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="w-full max-w-full border rounded-md overflow-hidden">
                                    <div className="h-64 sm:h-64 w-full overflow-auto">
                                        <CodeMirror
                                            value={questionFormats}
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
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">{t("quickStart")}</h4>
                        <ol className="text-sm text-blue-800 space-y-1">
                            <li>1. {t("steps.includeScript")}</li>
                            <li>2. {t("steps.createContainer")}</li>
                            <li>3. {t("steps.configureQuestions")}</li>
                            <li>4. {t("steps.addToken")}</li>
                            <li>5. {t("steps.mount")}</li>
                        </ol>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
