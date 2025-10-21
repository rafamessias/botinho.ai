"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Brain, Zap, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { CreateSurveyQuestion } from "./types"
import { generateSurveyWithAI } from "@/components/server-actions/survey"

interface AIGeneratorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSurveyGenerated: (data: {
        surveyName: string
        surveyDescription: string
        typeId?: string
        questions: CreateSurveyQuestion[]
    }) => void
    surveyTypes?: { id: string; name: string }[]
}

type GenerationStep = 'idle' | 'analyzing' | 'thinking' | 'creating' | 'done'

export const AISurveyGenerator = ({ open, onOpenChange, onSurveyGenerated, surveyTypes = [] }: AIGeneratorProps) => {
    const t = useTranslations("CreateSurvey.aiGenerator")
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationStep, setGenerationStep] = useState<GenerationStep>('idle')
    const [generatedQuestions, setGeneratedQuestions] = useState<CreateSurveyQuestion[]>([])
    const [generatedSurveyName, setGeneratedSurveyName] = useState("")
    const [generatedTypeId, setGeneratedTypeId] = useState<string | undefined>()
    const [showQuestionAnimation, setShowQuestionAnimation] = useState(false)

    const handleClose = () => {
        if (!isGenerating) {
            onOpenChange(false)
            // Reset state when closing
            setPrompt("")
            setGeneratedQuestions([])
            setGeneratedSurveyName("")
            setGeneratedTypeId(undefined)
            setShowQuestionAnimation(false)
            setGenerationStep('idle')
        }
    }

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error(t("errors.emptyPrompt"))
            return
        }

        setIsGenerating(true)
        setGeneratedQuestions([])
        setShowQuestionAnimation(false)

        try {
            // Step 1: Analyzing
            setGenerationStep('analyzing')
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Step 2: Thinking
            setGenerationStep('thinking')
            await new Promise(resolve => setTimeout(resolve, 1200))

            // Step 3: Creating (Server action call)
            setGenerationStep('creating')

            const result = await generateSurveyWithAI(prompt, surveyTypes)

            if (!result.success || !result.questions) {
                throw new Error(result.error || 'Failed to generate survey')
            }

            // Step 4: Done
            setGenerationStep('done')
            await new Promise(resolve => setTimeout(resolve, 800))

            const questions = result.questions || []
            const surveyName = result.surveyName || ''
            const surveyDescription = result.surveyDescription || ''
            const typeId = result.typeId

            // Animate questions appearing one by one
            setGeneratedQuestions(questions)
            setGeneratedSurveyName(surveyName)
            setGeneratedTypeId(typeId)
            setShowQuestionAnimation(true)

            // Wait for animation to complete, then pass to parent
            await new Promise(resolve => setTimeout(resolve, questions.length * 300 + 500))

            onSurveyGenerated({
                surveyName,
                surveyDescription,
                typeId,
                questions
            })
            toast.success(t("success", { count: questions.length }))

            // Close modal and reset after successful generation
            setTimeout(() => {
                onOpenChange(false)
                setPrompt("")
                setGenerationStep('idle')
                setShowQuestionAnimation(false)
                setGeneratedQuestions([])
                setGeneratedSurveyName("")
                setGeneratedTypeId(undefined)
            }, 500)

        } catch (error) {
            console.error('Error generating survey:', error)
            toast.error(error instanceof Error ? error.message : t("errors.failed"))
            setGenerationStep('idle')
        } finally {
            setIsGenerating(false)
        }
    }

    const getStepInfo = (step: GenerationStep) => {
        switch (step) {
            case 'analyzing':
                return {
                    icon: Brain,
                    text: t("steps.analyzing"),
                    color: "text-blue-500"
                }
            case 'thinking':
                return {
                    icon: Loader2,
                    text: t("steps.thinking"),
                    color: "text-purple-500"
                }
            case 'creating':
                return {
                    icon: Zap,
                    text: t("steps.creating"),
                    color: "text-amber-500"
                }
            case 'done':
                return {
                    icon: CheckCircle2,
                    text: t("steps.done"),
                    color: "text-green-500"
                }
            default:
                return null
        }
    }

    const stepInfo = getStepInfo(generationStep)

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    <div className="space-y-3">
                        <Textarea
                            placeholder={t("placeholder")}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isGenerating}
                            className="min-h-[100px] resize-none border-border/50 focus:border-primary/50 transition-colors"
                            rows={4}
                        />
                        <p className="text-xs text-muted-foreground/80">
                            {t("hint")}
                        </p>
                    </div>

                    {/* Generation Animation */}
                    <AnimatePresence mode="wait">
                        {isGenerating && stepInfo && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="flex items-center gap-3 py-4"
                            >
                                <motion.div
                                    animate={{
                                        rotate: generationStep === 'thinking' ? 360 : 0,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear"
                                        },
                                        scale: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                >
                                    <stepInfo.icon className={`h-5 w-5 ${stepInfo.color}`} />
                                </motion.div>
                                <div className="flex-1 space-y-2">
                                    <motion.p
                                        key={generationStep}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`text-sm font-medium ${stepInfo.color}`}
                                    >
                                        {stepInfo.text}
                                    </motion.p>
                                    <div className="h-0.5 bg-border rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{
                                                duration: generationStep === 'creating' ? 3 : 1,
                                                ease: "easeOut"
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Animated Survey Preview */}
                    <AnimatePresence>
                        {showQuestionAnimation && generatedQuestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 pt-2"
                            >
                                {/* Survey Metadata Preview */}
                                {generatedSurveyName && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="space-y-2"
                                    >
                                        <div className="p-4 rounded-md bg-muted/30 border-l-2 border-primary">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                                                Survey
                                            </p>
                                            <p className="text-base font-semibold text-foreground leading-tight">
                                                {generatedSurveyName}
                                            </p>
                                            {generatedTypeId && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {surveyTypes.find(t => t.id === generatedTypeId)?.name}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Questions Preview */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>{t("preview", { count: generatedQuestions.length })}</span>
                                    </div>
                                    <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                                        {generatedQuestions.map((question, index) => (
                                            <motion.div
                                                key={question.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.08,
                                                    duration: 0.3,
                                                    ease: "easeOut"
                                                }}
                                                className="group p-3 rounded-md bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border/50 transition-all duration-200"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold mt-0.5">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <p className="text-sm font-medium text-foreground leading-snug">
                                                            {question.title}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                                                            {question.format.replace(/_/g, ' ')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full group"
                        size="default"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>{t("generating")}</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                <span>{t("generate")}</span>
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

