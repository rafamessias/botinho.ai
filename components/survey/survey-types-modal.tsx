"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createSurveyType, updateSurveyType, deleteSurveyType } from "@/components/server-actions/survey-types"

export interface SurveyType {
    id: string
    name: string
    isDefault?: boolean
}

interface SurveyTypesModalProps {
    isOpen: boolean
    onClose: () => void
    surveyTypes: SurveyType[]
    onSurveyTypesChange: (types: SurveyType[]) => void
    selectedTypeId?: string
    onTypeSelect: (typeId: string) => void
}

export const SurveyTypesModal = ({
    isOpen,
    onClose,
    surveyTypes,
    onSurveyTypesChange,
    selectedTypeId,
    onTypeSelect,
}: SurveyTypesModalProps) => {
    const t = useTranslations("CreateSurvey.surveyTypes")
    const [isCreating, setIsCreating] = useState(false)
    const [editingType, setEditingType] = useState<SurveyType | null>(null)
    const [deletingType, setDeletingType] = useState<SurveyType | null>(null)
    const [newTypeName, setNewTypeName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCreateType = () => {
        setIsCreating(true)
        setEditingType(null)
        setNewTypeName("")
    }

    const handleEditType = (type: SurveyType) => {
        setEditingType(type)
        setIsCreating(false)
        setNewTypeName(type.name)
    }

    const handleDeleteType = (type: SurveyType) => {
        setDeletingType(type)
    }

    const handleSaveType = async () => {
        if (!newTypeName.trim()) {
            toast.error(t("messages.nameRequired"))
            return
        }

        if (newTypeName.length > 50) {
            toast.error(t("messages.nameTooLong"))
            return
        }

        setIsSubmitting(true)

        try {
            if (isCreating) {
                // Create new survey type
                const formData = new FormData()
                formData.append("name", newTypeName.trim())
                formData.append("isDefault", "false")

                const result = await createSurveyType(formData)

                if (result.success && result.surveyType) {
                    const newType: SurveyType = {
                        id: result.surveyType.id,
                        name: result.surveyType.name,
                        isDefault: result.surveyType.isDefault
                    }
                    onSurveyTypesChange([...surveyTypes, newType])
                    toast.success(t("messages.createSuccess"))
                } else {
                    toast.error(result.error || t("messages.createFailed"))
                }
            } else if (editingType) {
                // Update existing survey type
                const formData = new FormData()
                formData.append("id", editingType.id)
                formData.append("name", newTypeName.trim())
                formData.append("isDefault", editingType.isDefault?.toString() || "false")

                const result = await updateSurveyType(formData)

                if (result.success && result.surveyType) {
                    const updatedTypes = surveyTypes.map(type =>
                        type.id === editingType.id
                            ? { ...type, name: result.surveyType!.name, isDefault: result.surveyType!.isDefault }
                            : type
                    )
                    onSurveyTypesChange(updatedTypes)
                    toast.success(t("messages.updateSuccess"))
                } else {
                    toast.error(result.error || t("messages.updateFailed"))
                }
            }

            setNewTypeName("")
            setIsCreating(false)
            setEditingType(null)
        } catch (error) {
            toast.error(
                isCreating
                    ? t("messages.createFailed")
                    : t("messages.updateFailed")
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deletingType) return

        setIsSubmitting(true)

        try {
            // Delete survey type from database
            const result = await deleteSurveyType(deletingType.id)

            if (result.success) {
                const updatedTypes = surveyTypes.filter(
                    type => type.id !== deletingType.id
                )
                onSurveyTypesChange(updatedTypes)

                // If the deleted type was selected, clear selection
                if (selectedTypeId === deletingType.id) {
                    onTypeSelect("")
                }

                toast.success(t("messages.deleteSuccess"))
            } else {
                toast.error(result.error || t("messages.deleteFailed"))
            }
        } catch (error) {
            toast.error(t("messages.deleteFailed"))
        } finally {
            setIsSubmitting(false)
            setDeletingType(null)
        }
    }

    const handleCancel = () => {
        setNewTypeName("")
        setIsCreating(false)
        setEditingType(null)
        setDeletingType(null)
    }

    const handleSelectType = (typeId: string) => {
        onTypeSelect(typeId)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t("modal.title")}</DialogTitle>
                    <DialogDescription>
                        {t("modal.description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Create/Edit Form */}
                    {(isCreating || editingType) && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                            <div className="space-y-2">
                                <Label htmlFor="type-name">
                                    {t("modal.typeName")}
                                </Label>
                                <Input
                                    id="type-name"
                                    placeholder={t("modal.typeNamePlaceholder")}
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSaveType()
                                        } else if (e.key === "Escape") {
                                            handleCancel()
                                        }
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSaveType}
                                    disabled={isSubmitting}
                                    size="sm"
                                >
                                    {isSubmitting
                                        ? t("modal.saving")
                                        : t("modal.save")}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    size="sm"
                                >
                                    {t("modal.cancel")}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Types List */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                                {t("modal.title")}
                            </h3>
                            {!isCreating && !editingType && (
                                <Button
                                    onClick={handleCreateType}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("modal.createNew")}
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {surveyTypes.map((type) => (
                                        <TableRow
                                            key={type.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSelectType(type.id)}
                                        >
                                            <TableCell>
                                                <span className="font-medium">
                                                    {type.name}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEditType(type)
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            {t("actions.edit")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDeleteType(type)
                                                            }}
                                                            className="bg-destructive text-white"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2 text-white" />
                                                            {t("actions.delete")}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t("modal.cancel")}
                    </Button>
                </DialogFooter>

                {/* Delete Confirmation Dialog */}
                <Dialog open={!!deletingType} onOpenChange={() => setDeletingType(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("modal.deleteType")}</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{deletingType?.name}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeletingType(null)}
                                disabled={isSubmitting}
                            >
                                {t("modal.cancel")}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleConfirmDelete}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? t("modal.deleting")
                                    : t("modal.delete")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    )
}
