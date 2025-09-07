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
import { GripVertical, Plus, Settings, Trash2, FileText } from "lucide-react"

interface Question {
    id: number
    title: string
    description: string
    format: string
    required: boolean
    options: string[]
}

interface QuestionsSectionProps {
    questions: Question[]
    onChange: (questions: Question[]) => void
}

const questionFormats = [
    "Yes/No",
    "Star Rating",
    "5 Point Rating",
    "Long Text",
    "Statement",
    "Single Choice",
    "Multiple Choice"
]

const QuestionCard = ({
    question,
    onUpdate,
    onDelete
}: {
    question: Question
    onUpdate: (question: Question) => void
    onDelete: (id: number) => void
}) => {
    const t = useTranslations("CreateSurvey.questions")
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`relative ${isDragging ? 'opacity-50' : ''}`}
        >
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Question Icon */}
                    <div className="p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Question {question.id}:</h4>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <Settings className="h-4 w-4" />
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

                        {/* Question Title */}
                        <div className="space-y-2">
                            <Label htmlFor={`question-title-${question.id}`}>{t("questionTitle.label")}</Label>
                            <Input
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

                        {/* Question Format */}
                        <div className="space-y-2">
                            <Label htmlFor={`question-format-${question.id}`}>{t("format.label")}</Label>
                            <Select
                                value={question.format}
                                onValueChange={(value) => onUpdate({ ...question, format: value })}
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
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const QuestionsSection = ({ questions, onChange }: QuestionsSectionProps) => {
    const t = useTranslations("CreateSurvey.questions")

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
            format: "Multiple Choice",
            required: false,
            options: []
        }
        onChange([...questions, newQuestion])
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={questions.map(q => q.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {questions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                onUpdate={handleUpdateQuestion}
                                onDelete={handleDeleteQuestion}
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
