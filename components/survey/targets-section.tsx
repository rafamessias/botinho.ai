"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Target {
    id: number
    name: string
    url: string
    selector?: string
}

interface TargetsSectionProps {
    targets: Target[]
    onChange: (targets: Target[]) => void
}

export const TargetsSection = ({ targets, onChange }: TargetsSectionProps) => {
    const t = useTranslations("CreateSurvey.targets")

    const handleAddTarget = () => {
        const newId = Math.max(...targets.map(t => t.id), 0) + 1
        const newTarget: Target = {
            id: newId,
            name: "",
            url: "",
            selector: ""
        }
        onChange([...targets, newTarget])
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>

                {targets.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            {t("noTargets")}
                        </p>
                        <Button onClick={handleAddTarget}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t("addTarget")}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {targets.map((target) => (
                            <div key={target.id} className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    Target {target.id}: {target.name || "Unnamed Target"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    URL: {target.url || "No URL specified"}
                                </p>
                            </div>
                        ))}
                        <Button variant="outline" onClick={handleAddTarget}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t("addTarget")}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
