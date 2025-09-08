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

interface Question {
    id: number
    title: string
    description: string
    format: string
    required: boolean
    options: string[]
    ratingMin?: number
    ratingMax?: number
    ratingStep?: number
    yesLabel?: string
    noLabel?: string
    buttonLabel?: string
}

interface QuestionsSectionProps {
    questions: Question[]
    onChange: (questions: Question[]) => void
}

const questionFormats = [
    "Yes/No",
    "Star Rating",
    "Long Text",
    "Statement",
    "Single Choice",
    "Multiple Choice"
]

const getQuestionIcon = (format: string) => {
    switch (format) {
        case "Yes/No":
            return CheckSquare
        case "Star Rating":
            return Star
        case "Long Text":
            return Type
        case "Statement":
            return MessageSquare
        case "Single Choice":
            return Circle
        case "Multiple Choice":
            return Square
        case "":
        case undefined:
        case null:
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
    shouldFocus = false
}: {
    id: number
    option: string
    index: number
    onUpdate: (index: number, value: string) => void
    onRemove: (index: number) => void
    shouldFocus?: boolean
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
            <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
            </div>

            {/* Option Input */}
            <Input
                ref={inputRef}
                placeholder="Enter option text"
                value={option}
                onChange={(e) => onUpdate(index, e.target.value)}
                className="flex-1"
            />

            {/* Remove Button */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="flex-shrink-0"
            >
                <X className="h-4 w-4" />
            </Button>
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
    onDelete: (id: number) => void
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
        const newOptions = [...question.options, ""]
        const newIndex = newOptions.length - 1
        onUpdate({ ...question, options: newOptions })
        setFocusNewOption(newIndex)

        // Reset focus state after a short delay
        setTimeout(() => {
            setFocusNewOption(null)
        }, 100)
    }

    const handleUpdateOption = (index: number, value: string) => {
        const newOptions = [...question.options]
        newOptions[index] = value
        onUpdate({ ...question, options: newOptions })
    }

    const handleRemoveOption = (index: number) => {
        const newOptions = question.options.filter((_, i) => i !== index)
        onUpdate({ ...question, options: newOptions })
    }

    const handleReorderOptions = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = question.options.findIndex((_, i) => i === active.id)
            const newIndex = question.options.findIndex((_, i) => i === over.id)

            const newOptions = arrayMove(question.options, oldIndex, newIndex)
            onUpdate({ ...question, options: newOptions })
        }
    }

    const needsOptions = question.format === "Single Choice" || question.format === "Multiple Choice"
    const needsYesNoLabels = question.format === "Yes/No"
    const needsButtonLabel = question.format === "Statement"

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
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Question Number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-muted text-white rounded-full flex items-center justify-center text-sm font-medium">
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
                                            const updatedQuestion = { ...question, format: value }
                                            // Reset options when changing format
                                            if (!needsOptions) {
                                                updatedQuestion.options = []
                                            }
                                            // Set default labels for Yes/No questions
                                            if (value === "Yes/No") {
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
                                            {questionFormats.map((format) => (
                                                <SelectItem key={format} value={format}>
                                                    {format}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Required Toggle */}
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

                                    <DndContext
                                        sensors={optionSensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleReorderOptions}
                                    >
                                        <SortableContext
                                            items={question.options.map((_, index) => index)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-2">
                                                {question.options.map((option, index) => (
                                                    <SortableOptionItem
                                                        key={index}
                                                        id={index}
                                                        option={option}
                                                        index={index}
                                                        onUpdate={handleUpdateOption}
                                                        onRemove={handleRemoveOption}
                                                        shouldFocus={focusNewOption === index}
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

                            {/* Button Label Section for Statement */}
                            {needsButtonLabel && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">{t("buttonLabel.label")}</Label>
                                    <div className="space-y-2">
                                        <Input
                                            id={`button-label-${question.id}`}
                                            placeholder={t("buttonLabel.buttonPlaceholder")}
                                            value={question.buttonLabel || ""}
                                            onChange={(e) => onUpdate({ ...question, buttonLabel: e.target.value })}
                                        />
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

export const QuestionsSection = ({ questions, onChange }: QuestionsSectionProps) => {
    const t = useTranslations("CreateSurvey.questions")
    const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<number | null>(null)
    const [allExpanded, setAllExpanded] = useState(true)

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
            onChange(newQuestions)
        }
    }

    const handleAddQuestion = () => {
        const newId = Math.max(...questions.map(q => q.id), 0) + 1
        const newQuestion: Question = {
            id: newId,
            title: "",
            description: "",
            format: "Yes/No",
            required: false,
            options: [],
            ratingMin: 1,
            ratingMax: 5,
            ratingStep: 1,
            yesLabel: "Yes",
            noLabel: "No",
            buttonLabel: "Continue"
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

    const handleDeleteQuestion = (id: number) => {
        const newQuestions = questions.filter(q => q.id !== id)
        onChange(newQuestions)
    }

    const toggleAllQuestions = () => {
        setAllExpanded(!allExpanded)
        // Clear the newly added
        setNewlyAddedQuestionId(null)
    }

    return (
        <Card className="border-none px-0 pt-4">
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
