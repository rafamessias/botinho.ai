"use client"

import * as React from "react"
import { OpineeoSurvey } from "@/components/survey-render/opineeo-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

interface FeedbackSurveyModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    surveyId?: string
    token?: string
}

export function FeedbackSurveyModal({
    open,
    onOpenChange,
    surveyId,
    token,
}: FeedbackSurveyModalProps) {
    const handleComplete = () => {
        // Auto-close modal on survey completion
        setTimeout(() => {
            onOpenChange(false)
        }, 1500)
    }

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader className="px-4">
                    <DialogTitle>Rate Our Service</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                {/* Only render survey when modal is open to avoid DOM mounting issues */}
                {open && surveyId && token ? (
                    <OpineeoSurvey
                        surveyId={surveyId}
                        token={token}
                        onComplete={handleComplete}
                        onClose={handleClose}
                    />
                ) : open && (!surveyId || !token) ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Survey not configured yet.</p>
                        <p className="text-sm mt-2">Please contact your administrator.</p>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

