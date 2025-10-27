"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createTeamAction, updateTeamAction } from "@/components/server-actions/team"

const teamSchema = z.object({
    name: z.string().min(2, "Team name must be at least 2 characters"),
    description: z.string().optional(),
})

type TeamFormData = z.infer<typeof teamSchema>

interface TeamFormProps {
    team?: {
        id: number
        name: string
        description?: string | null
    }
    onSuccess?: (newTeamId?: number) => void
    onCancel?: () => void
}

export const TeamForm = ({ team, onSuccess, onCancel }: TeamFormProps) => {
    const t = useTranslations("Team")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TeamFormData>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: team?.name || "",
            description: team?.description || "",
        },
    })

    const onSubmit = async (data: TeamFormData) => {
        try {
            setIsSubmitting(true)

            let result
            if (team) {
                result = await updateTeamAction({
                    id: team.id,
                    ...data,
                })
            } else {
                result = await createTeamAction(data)
            }

            if (result?.success) {
                toast.success(result.message)
                // Pass the team ID for new teams, undefined for updates
                const newTeamId = team ? undefined : result.team?.id
                onSuccess?.(newTeamId)
            } else {
                toast.error(result?.error || "Operation failed")
            }
        } catch (error) {
            console.error("Team form error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {team ? t("editTeam") : t("createTeam")}
                </CardTitle>
                <CardDescription>
                    {team ? t("editTeamDescription") : t("createTeamDescription")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("form.name")}</Label>
                        <Input
                            autoFocus
                            id="name"
                            placeholder={t("form.namePlaceholder")}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("form.description")}</Label>
                        <Textarea
                            id="description"
                            placeholder={t("form.descriptionPlaceholder")}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">

                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                {t("form.cancel")}
                            </Button>
                        )}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? (team ? t("form.updating") : t("form.creating"))
                                : (team ? t("form.update") : t("form.create"))
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
