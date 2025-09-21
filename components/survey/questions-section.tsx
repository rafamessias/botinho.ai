"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { GripVertical, Plus, Settings, Trash2, FileText, X, CheckSquare, Star, Type, MessageSquare, Circle, Square, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useRef, useEffect } from "react"
import { QuestionFormat } from "@/lib/generated/prisma"

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
    hasOtherOption?: boolean
    options: Array<{
        id?: string
        text: string
        order: number
        isOther?: boolean
    }>
}

interface QuestionsSectionProps {
    questions: Question[]
    onChange: (questions: Question[]) => void
    expandAllQuestions?: boolean
}

const getQuestionFormats = (t: any) => [
    { value: QuestionFormat.YES_NO, label: t("formats.yesNo") },
    { value: QuestionFormat.STAR_RATING, label: t("formats.starRating") },
    { value: QuestionFormat.LONG_TEXT, label: t("formats.longText") },
    { value: QuestionFormat.STATEMENT, label: t("formats.statement") },
    { value: QuestionFormat.SINGLE_CHOICE, label: t("formats.singleChoice") },
    { value: QuestionFormat.MULTIPLE_CHOICE, label: t("formats.multipleChoice") }
]

const getQuestionIcon = (format: QuestionFormat) => {
    switch (format) {
        case QuestionFormat.YES_NO:
            return CheckSquare
        case QuestionFormat.STAR_RATING:
            return Star
        case QuestionFormat.LONG_TEXT:
            return Type
        case QuestionFormat.STATEMENT:
            return MessageSquare
        case QuestionFormat.SINGLE_CHOICE:
            return Circle
        case QuestionFormat.MULTIPLE_CHOICE:
            return Square
        default:
            return FileText
    }
}

const SortableOptionItem = ({
    id,
    option,
    index,
    onUpdate,
    onRemove,
    shouldFocus = true,
    isOtherEnabled = false
}: {
    id: string
    option: { text: string; order: number; isOther?: boolean }
    index: number
    onUpdate: (index: number, value: string) => void
    onRemove: (index: number) => void
    shouldFocus?: boolean
    isOtherEnabled?: boolean
}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-2 bg-background border rounded-md ${isDragging ? 'opacity-50 shadow-lg' : ''
                } ${option.text.trim() === "" ? 'border-red-100 bg-red-50/30' : ''
                }`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Option Number */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${option.text.trim() === ""
                ? "bg-red-100 text-red-600 border border-red-300"
                : "bg-muted"
                }`}>
                {index + 1}
            </div>

            {/* Option Input */}
            <Input
                autoFocus={shouldFocus}
                ref={inputRef}
                placeholder="Enter option text"
                value={option.text}
                onChange={(e) => onUpdate(index, e.target.value)}
                className={`flex-1 ${option.text.trim() === "" ? "border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-red-100" : ""}`}
            />

            {/* Remove Button - Hide for "Other" option when enabled */}
            {!(option.isOther && isOtherEnabled) && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="flex-shrink-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}

const QuestionCard = ({
    question,
    onUpdate,
    onDelete,
    isFirstQuestion = false,
    isNewlyAdded = false,
    questionNumber = 1,
    allExpanded = true
}: {
    question: Question
    onUpdate: (question: Question) => void
    onDelete: (id: string) => void
    isFirstQuestion?: boolean
    isNewlyAdded?: boolean
    questionNumber?: number
    allExpanded?: boolean
}) => {
    const t = useTranslations("CreateSurvey.questions")
    const [isExpanded, setIsExpanded] = useState(isFirstQuestion || isNewlyAdded)

    // Update expanded state when allExpanded changes
    useEffect(() => {
        if (!allExpanded) {
            // When collapsing all, collapse ALL questions including the first one
            // But keep newly added questions expanded
            if (!isNewlyAdded) {
                setIsExpanded(false)
            }
        } else {
            // When expanding all, expand all questions
            setIsExpanded(true)
        }
    }, [allExpanded, isNewlyAdded])


    const [focusNewOption, setFocusNewOption] = useState<number | null>(null)
    const titleInputRef = useRef<HTMLInputElement>(null)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id })

    // Move sensors to top level to avoid Rules of Hooks violation
    const optionSensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleAddOption = () => {
        const newOptions = [...question.options, { text: "", order: question.options.length, isOther: false }]
        const newIndex = newOptions.length - 1
        onUpdate({ ...question, options: newOptions })
        setFocusNewOption(newIndex)

        // Reset focus state after a short delay
        setTimeout(() => {
            setFocusNewOption(null)
        }, 100)
    }

    const handleToggleOtherOption = (checked: boolean) => {
        let newOptions = [...question.options]

        if (checked) {
            // Add "Other" option if it doesn't exist
            const hasOther = newOptions.some(option => option.isOther)
            if (!hasOther) {
                newOptions.push({ text: t("options.otherOptionText"), order: newOptions.length, isOther: true })
            }
        } else {
            // Remove "Other" option if it exists
            newOptions = newOptions.filter(option => !option.isOther)
            // Update order for remaining options
            newOptions = newOptions.map((option, i) => ({ ...option, order: i }))
        }

        onUpdate({ ...question, hasOtherOption: checked, options: newOptions })
    }

    const handleUpdateOption = (index: number, value: string) => {
        const newOptions = [...question.options]
        newOptions[index] = { ...newOptions[index], text: value }
        onUpdate({ ...question, options: newOptions })
    }

    const handleRemoveOption = (index: number) => {
        const optionToRemove = question.options[index]

        // Don't allow removing the "Other" option if hasOtherOption is enabled
        if (optionToRemove.isOther && question.hasOtherOption) {
            return
        }

        const newOptions = question.options.filter((_, i) => i !== index)
        // Update order for remaining options
        const updatedOptions = newOptions.map((option, i) => ({ ...option, order: i }))
        onUpdate({ ...question, options: updatedOptions })
    }

    const handleReorderOptions = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = question.options.findIndex((_, i) => i.toString() === active.id)
            const newIndex = question.options.findIndex((_, i) => i.toString() === over.id)

            const newOptions = arrayMove(question.options, oldIndex, newIndex)
            // Update order for reordered options
            const updatedOptions = newOptions.map((option, i) => ({ ...option, order: i }))
            onUpdate({ ...question, options: updatedOptions })
        }
    }

    const needsOptions = question.format === QuestionFormat.SINGLE_CHOICE || question.format === QuestionFormat.MULTIPLE_CHOICE
    const needsYesNoLabels = question.format === QuestionFormat.YES_NO


    // Auto-focus title input for first question when expanded (but not on initial load)
    useEffect(() => {
        if (isFirstQuestion && isExpanded && titleInputRef.current && question.title !== "") {
            titleInputRef.current.focus()
        }
    }, [isFirstQuestion, isExpanded, question.title])

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`relative ${isDragging ? 'opacity-50' : ''}`}
        >
            <CardContent className="">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center justify-start gap-2">
                        {/* Drag Handle */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Question Number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                            {questionNumber}
                        </div>

                        {/* Question Icon */}
                        <div className="p-2 bg-muted rounded">
                            {(() => {
                                const IconComponent = getQuestionIcon(question.format)
                                return <IconComponent className="h-4 w-4" />
                            })()}
                        </div>

                        <h4 className="font-medium hidden sm:block">
                            {question.title.length > 30
                                ? `${question.title.slice(0, 30)}…`
                                : question.title}
                        </h4>

                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(question.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Question Title for mobile */}
                <div className="flex items-center gap-2 mt-2 sm:hidden">
                    <h4 className="font-medium">
                        {question.title.length > 20
                            ? `${question.title.slice(0, 20)}…`
                            : question.title}
                    </h4>
                </div>

                {/* Question Content */}
                <div className="flex-1 space-y-4">

                    {isExpanded && (
                        <>
                            {/* Question Title */}
                            <div className="space-y-2 mt-4">
                                <Label htmlFor={`question-title-${question.id}`}>{t("questionTitle.label")}</Label>
                                <Input
                                    ref={titleInputRef}
                                    id={`question-title-${question.id}`}
                                    placeholder={t("questionTitle.placeholder")}
                                    value={question.title}
                                    onChange={(e) => onUpdate({ ...question, title: e.target.value })}
                                />
                            </div>

                            {/* Question Description */}
                            <div className="space-y-2">
                                <Label htmlFor={`question-description-${question.id}`}>
                                    {t("description.label")}
                                </Label>
                                <Textarea
                                    id={`question-description-${question.id}`}
                                    placeholder={t("description.placeholder")}
                                    value={question.description}
                                    onChange={(e) => onUpdate({ ...question, description: e.target.value })}
                                    rows={2}
                                />
                            </div>

                            <div className="flex items-center justify-between space-y-2">
                                {/* Question Format */}
                                <div className="space-y-2">
                                    <Label htmlFor={`question-format-${question.id}`}>{t("format.label")}</Label>
                                    <Select
                                        value={question.format}
                                        onValueChange={(value) => {
                                            const updatedQuestion = { ...question, format: value as QuestionFormat }
                                            // Reset options and other option when changing format
                                            if (!needsOptions) {
                                                updatedQuestion.options = []
                                                updatedQuestion.hasOtherOption = false
                                            }
                                            // Set default labels for Yes/No questions
                                            if (value === QuestionFormat.YES_NO) {
                                                updatedQuestion.yesLabel = "Yes"
                                                updatedQuestion.noLabel = "No"
                                            }
                                            onUpdate(updatedQuestion)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("format.placeholder")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getQuestionFormats(t).map((format) => (
                                                <SelectItem key={format.value} value={format.value}>
                                                    {format.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Required Toggle - Hide for Statement format */}
                                {question.format !== QuestionFormat.STATEMENT && (
                                    <div className="flex items-center h-full space-x-2">
                                        <Switch
                                            id={`question-required-${question.id}`}
                                            checked={question.required}
                                            onCheckedChange={(checked) => onUpdate({ ...question, required: checked })}
                                        />
                                        <Label htmlFor={`question-required-${question.id}`} className="text-sm">
                                            {t("required.label")}
                                        </Label>
                                    </div>
                                )}
                            </div>
                            {/* Options Section for Single/Multiple Choice */}
                            {needsOptions && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">{t("options.label")}</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddOption}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            {t("options.addOption")}
                                        </Button>
                                    </div>

                                    {/* Other Option Switch */}
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id={`other-option-${question.id}`}
                                            checked={question.hasOtherOption || false}
                                            onCheckedChange={handleToggleOtherOption}
                                        />
                                        <Label htmlFor={`other-option-${question.id}`} className="text-sm">
                                            {t("options.includeOther")}
                                        </Label>
                                    </div>

                                    <DndContext
                                        sensors={optionSensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleReorderOptions}
                                    >
                                        <SortableContext
                                            items={question.options.map((_, index) => index.toString())}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-2">
                                                {question.options.map((option, index) => (
                                                    <SortableOptionItem
                                                        key={index}
                                                        id={index.toString()}
                                                        option={option}
                                                        index={index}
                                                        onUpdate={handleUpdateOption}
                                                        onRemove={handleRemoveOption}
                                                        shouldFocus={focusNewOption === index}
                                                        isOtherEnabled={question.hasOtherOption || false}
                                                    />
                                                ))}

                                                {question.options.length === 0 && (
                                                    <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed border-muted rounded-md">
                                                        No options added yet. Click "Add Option" to get started.
                                                    </div>
                                                )}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            )}

                            {/* Yes/No Labels Section */}
                            {needsYesNoLabels && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">{t("yesNoLabels.label")}</Label>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`yes-label-${question.id}`} className="text-xs">
                                                {t("yesNoLabels.yesLabel")}
                                            </Label>
                                            <Input
                                                id={`yes-label-${question.id}`}
                                                placeholder={t("yesNoLabels.yesPlaceholder")}
                                                value={question.yesLabel || "Yes"}
                                                onChange={(e) => onUpdate({ ...question, yesLabel: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`no-label-${question.id}`} className="text-xs">
                                                {t("yesNoLabels.noLabel")}
                                            </Label>
                                            <Input
                                                id={`no-label-${question.id}`}
                                                placeholder={t("yesNoLabels.noPlaceholder")}
                                                value={question.noLabel || "No"}
                                                onChange={(e) => onUpdate({ ...question, noLabel: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </CardContent>
        </Card >
    )
}

export const QuestionsSection = ({ questions, onChange, expandAllQuestions = true }: QuestionsSectionProps) => {
    const t = useTranslations("CreateSurvey.questions")
    const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<string | null>(null)
    const [allExpanded, setAllExpanded] = useState(expandAllQuestions)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = questions.findIndex((q) => q.id === active.id)
            const newIndex = questions.findIndex((q) => q.id === over.id)

            const newQuestions = arrayMove(questions, oldIndex, newIndex)
            // Update the order property for each question to match their new position
            const updatedQuestions = newQuestions.map((question, index) => ({
                ...question,
                order: index
            }))
            onChange(updatedQuestions)
        }
    }

    const handleAddQuestion = () => {
        const newId = (Math.max(...questions.map(q => parseInt(q.id) || 0), 0) + 1).toString()
        const newQuestion: Question = {
            id: newId,
            title: "",
            description: "",
            format: QuestionFormat.YES_NO,
            required: false,
            order: questions.length,
            options: [],
            yesLabel: "Yes",
            noLabel: "No",
            buttonLabel: "Continue",
            hasOtherOption: false
        }
        setNewlyAddedQuestionId(newId)
        onChange([...questions, newQuestion])

        // Focus the title input of the newly added question after a short delay
        setTimeout(() => {
            const titleInput = document.getElementById(`question-title-${newId}`) as HTMLInputElement
            if (titleInput) {
                titleInput.focus()
            }

        }, 100)
    }

    const handleUpdateQuestion = (updatedQuestion: Question) => {
        const newQuestions = questions.map(q =>
            q.id === updatedQuestion.id ? updatedQuestion : q
        )
        onChange(newQuestions)
    }

    const handleDeleteQuestion = (id: string) => {
        const newQuestions = questions.filter(q => q.id !== id)
        // Update the order property for each remaining question to maintain sequential order
        const updatedQuestions = newQuestions.map((question, index) => ({
            ...question,
            order: index
        }))
        onChange(updatedQuestions)
    }

    const toggleAllQuestions = () => {
        setAllExpanded(!allExpanded)
        // Clear the newly added
        setNewlyAddedQuestionId(null)
    }

    return (
        <Card className="border-none px-0 pt-4 shadow-none bg-transparent">
            <CardHeader className="p-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle>{t("title")}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            ({questions.length} {questions.length === 1 ? t("question") : t("questions")})
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleAllQuestions}
                        className="flex items-center gap-2"
                    >
                        {allExpanded ? (
                            <>
                                <ChevronUp className="h-4 w-4" />
                                {t("collapseAll")}
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                {t("expandAll")}
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={questions.map(q => q.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {questions.map((question, index) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                onUpdate={handleUpdateQuestion}
                                onDelete={handleDeleteQuestion}
                                isFirstQuestion={index === 0}
                                isNewlyAdded={question.id === newlyAddedQuestionId}
                                questionNumber={index + 1}
                                allExpanded={allExpanded}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <Button
                    variant="outline"
                    onClick={handleAddQuestion}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addQuestion")}
                </Button>
            </CardContent>
        </Card>
    )
}
